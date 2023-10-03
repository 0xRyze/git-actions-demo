import React, { useCallback, useEffect, useState } from 'react'
import { useContract } from './useContract'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from '../constants'
import { useDispatch } from 'react-redux'
import { updateSpaceBalance } from '../state/space/reducer'
import { SupportedChainId } from '../constants/chains'
import { environment } from '../context/BanditContext'

const ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const TESTNET_RELAYERS = {
  [SupportedChainId.BINANCE_TESTNET]: {
    address: '0x8421D4CeAB2DAB5B36051c28b5bAA6d2Ae1AF976',
  },
  [SupportedChainId.POLYGON_MUMBAI]: {
    address: '0x94d7469809701aA2E2276247914Cfd1a5c6f0A18',
  },
}

const MAINNET_RELAYERS = {
  [SupportedChainId.BINANCE_TESTNET]: {
    address: '0xD49F7B06635d6ECa4228d0B38Ec76B092e984Ba9',
  },
  [SupportedChainId.POLYGON_MAINNET]: {
    address: '0x8e5C6ED48bB51dB26538160712321b90F535F80b',
  },
}

const isProd = environment === 'production'

const RELAYERS = isProd ? MAINNET_RELAYERS : TESTNET_RELAYERS

const useRelayer = (canFetch = false) => {
  const [balance, setBalance] = useState(0)
  const { account, chainId } = useWeb3React()
  const contract = useContract(RELAYERS[chainId]?.address, ABI)
  const dispatch = useDispatch()

  const getSpaceBalance = useCallback(
    async (address) => {
      try {
        // console.log('Fetching balance...')
        const _account = address || account
        const _balance = await contract.getBalance(_account)
        // console.log('balance', _balance.toString())
        let bal = BigNumber(_balance.toString()).dividedBy(DEFAULT_TOKEN_DECIMAL).toNumber()
        setBalance(bal)
        if (!address) {
          dispatch(updateSpaceBalance(bal))
        }
        return bal
      } catch (error) {
        setBalance(0)
        console.log(error)
      }
    },
    [account, contract],
  )

  const fundSpace = useCallback(
    async (amount) => {
      try {
        if (!account) return
        const transaction = await contract.deposit({
          value: BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
        })
        const receipt = await transaction.wait()
        console.log(receipt)
        await getSpaceBalance()
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    [contract],
  )

  const withdrawSpaceFunds = useCallback(
    async (amount) => {
      try {
        if (!account) return
        const transaction = await contract.withdraw(BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
        const receipt = await transaction.wait()
        // console.log(receipt)
        await getSpaceBalance()
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    [contract],
  )

  useEffect(() => {
    if (canFetch) {
      getSpaceBalance()
    }
  }, [canFetch])

  return { getSpaceBalance, balance, fundSpace, chainId, withdrawSpaceFunds }
}

export default useRelayer
