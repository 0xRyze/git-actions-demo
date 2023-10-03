import { useEffect, useState } from 'react'
import { useContract } from '../../../../hooks/useContract'
import { isAddress } from '@ethersproject/address'
import { ERC20ABI } from '../constants'
import { useWeb3React } from '@web3-react/core'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import usePreviousValue from '../../../../hooks/usePreviousValue'
import { DEFAULT_TOKEN_DECIMAL } from '../../../../constants'
import useWalletContext from '../../../../components/WalletModal/hooks/useWalletContext'

const initialValue = {
  ETH: 0,
  MATIC: 0,
  ETH_USDT: 0,
  MATIC_USDT: 0,
  BONK: 0,
  SOL: 0,
  SOL_USDT: 0,
  SHM: 0,
  TLOS: 0,
  AGOR: 0,
  AVAX: 0,
}

export function useBalances({ currency, address, tokenDecimals = 1, refresh = false }: any) {
  const [balances, setBalances] = useState<{ [key: string]: any }>(initialValue)
  const { account, provider } = useWeb3React()
  const usdtContract = useContract(isAddress(address) ? address : null, ERC20ABI)
  // const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { selectedWallet } = useWalletContext()

  const previousSolAccount = usePreviousValue(publicKey?.toBase58())
  const previousEvmAccount = usePreviousValue(account)

  const getSplTokenBalance = async (mintAddress: any, walletAddress: any) => {
    try {
      if (!connection) return
      const mint = new PublicKey(mintAddress)
      const wallet = new PublicKey(walletAddress)
      const { value } = await connection.getTokenAccountsByOwner(wallet, { mint })
      if (value.length === 0) {
        return 0
      }
      const tokenAccountAddress = value[0].pubkey
      const {
        value: { uiAmount },
      } = await connection.getTokenAccountBalance(tokenAccountAddress)
      setBalances((state) => ({
        ...state,
        [currency]: uiAmount,
      }))
      return uiAmount
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSolBalance = async (walletAddress: any) => {
    try {
      if (!connection) return
      const balance = await connection.getBalance(new PublicKey(walletAddress))
      setBalances((state) => ({
        ...state,
        [currency]: new BigNumber(balance).dividedBy(LAMPORTS_PER_SOL).toNumber(),
      }))
      return balance
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (selectedWallet?.chains.includes('SOL')) {
      if (previousSolAccount && previousSolAccount !== publicKey?.toBase58()) {
        setBalances(initialValue)
      }
    } else {
      if (previousEvmAccount && previousEvmAccount !== account) {
        setBalances(initialValue)
      }
    }
  }, [selectedWallet, previousSolAccount, previousEvmAccount, publicKey, account, refresh])

  useEffect(() => {
    if (selectedWallet?.chains.includes('SOL') && publicKey) {
      if (currency === 'SOL') {
        fetchSolBalance(publicKey.toBase58())
      } else if (currency === 'SOL_USDT' || currency === 'BONK') {
        getSplTokenBalance(address, publicKey.toBase58())
      }
    }
  }, [selectedWallet, publicKey, currency, refresh])

  useEffect(() => {
    if (selectedWallet?.chains.includes('EVM') && provider && account) {
      const fetchBalances = async () => {
        try {
          const balance = await provider.getBalance(account)
          setBalances((state) => ({
            ...state,
            [currency]: new BigNumber(balance.toString()).dividedBy(DEFAULT_TOKEN_DECIMAL).toNumber(),
          }))
        } catch (e) {
          console.log(e)
        }
      }

      const fetchTokenBalance = async () => {
        try {
          const balance = await usdtContract.balanceOf(account)
          setBalances((state) => ({
            ...state,
            [currency]: new BigNumber(balance.toString()).dividedBy(10 ** tokenDecimals).toNumber(),
          }))
        } catch (e) {
          console.log(e)
        }
      }

      if (['ETH', 'MATIC', 'BNB', 'SHM', 'TLOS', 'AGOR', 'AVAX'].includes(currency)) {
        fetchBalances()
      } else if (usdtContract) {
        fetchTokenBalance()
      }
    }
  }, [selectedWallet, provider, account, currency, address, usdtContract, tokenDecimals, refresh])

  return { balances: balances }
}
