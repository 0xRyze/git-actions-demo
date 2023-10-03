import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'

const mintAddresses = {
  BONK: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
}

const useGetBalance = ({
  connectedChainId,
  chainId,
  isSwapPaySupported,
  externalCurrencyEnabled,
  mintPrice,
  mintPriceUnit,
  payUsing,
  requiredCustomAmount,
}) => {
  const [evmBalance, setEvmBalance] = useState(0)
  const [solBalance, setSolBalance] = useState(0)
  const [swapPayBalance, setSwapPayBalance] = useState(0)
  const { account, provider } = useWeb3React()
  const { connected: solanaWalletConnected, publicKey } = useWallet()
  const { connection } = useConnection()

  const getEVMBalance = useCallback(async () => {
    if (account) {
      try {
        const bal = await provider.getBalance(account)
        setEvmBalance(bal)
      } catch (error) {
        console.log(error)
      }
    }
  }, [account, mintPrice, provider])

  const getSolBalance = useCallback(async () => {
    if (solanaWalletConnected && publicKey) {
      const solBal = await connection.getBalance(publicKey)
      setSolBalance(solBal)
    }
  }, [solanaWalletConnected, publicKey, connection])

  const getSwapPayBalance = useCallback(async () => {
    if (payUsing === 'BONK' && publicKey) {
      const mint = mintAddresses[payUsing.toUpperCase()]
      const tokenAccount = await getAssociatedTokenAddress(mint, publicKey)
      const tokenBalance = await connection.getTokenAccountBalance(tokenAccount)
      const bal = tokenBalance.value.uiAmount
      setSwapPayBalance(bal)
    }
  }, [connection, payUsing, publicKey])

  useEffect(() => {
    if (Number(chainId) === Number(connectedChainId)) {
      getEVMBalance()
    }
  }, [chainId, connectedChainId, getEVMBalance])

  useEffect(() => {
    getSolBalance()

    if (isSwapPaySupported) {
      getSwapPayBalance()
    }
  }, [publicKey, solanaWalletConnected, isSwapPaySupported, getSolBalance, getSwapPayBalance])

  const isEvmEnoughBalance = new BigNumber(evmBalance.toString()).gte(mintPrice)
  const isSolEnoughBalance = solBalance >= mintPrice * LAMPORTS_PER_SOL
  const isSwapPayEnoughBalance = parseFloat(swapPayBalance.toString()) >= parseFloat(requiredCustomAmount)

  const isEnoughBalance =
    isSwapPaySupported && payUsing.toUpperCase() !== 'DEFAULT'
      ? isSwapPayEnoughBalance
      : mintPriceUnit === 'SOL'
      ? isSolEnoughBalance
      : ['ETH', 'MATIC', 'SHM', 'BNB'].includes(mintPriceUnit)
      ? isEvmEnoughBalance
      : true

  return { isEnoughBalance }
}

export default useGetBalance
