import React, { useEffect, useRef, useState } from 'react'
import { fetchQuote, swapFromSolana } from '@mayanfinance/swap-sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import EvmSwapDetail from './EvmSwapDetail'
import { useToast } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'

const getChainName = (chain) => {
  switch (Number(chain)) {
    case 1:
      return 'ethereum'
    case 137:
      return 'polygon'
    case 56:
      return 'bsc'
    case 9090:
      return 'solana'
    default:
      return 'ethereum'
  }
}

const useToEvmSwap = ({ chainId, amountIn, fromCurrency, toCurrency, multiplier, estimateGasPrice, enabled }) => {
  const [quote, setQuote] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [gasPrice, setGasPrice] = useState(0)
  const { publicKey: solanaWalletAddress, signTransaction } = useWallet()

  const { connection } = useConnection()

  const { account } = useWeb3React()

  const toast = useToast()
  const timer = useRef(null)
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const _quote = await fetchQuoteFromMayan(1000000000)
        setQuote(_quote)
      } catch (e) {
        toast({
          title: `Failed to fetch price`,
          description: e.reason || e.message,
          status: 'error',
          duration: 1000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    if (chainId && [1, 56, 137, 9090].includes(Number(chainId)) && fromCurrency !== 'default' && enabled) {
      init()
      if (chainId && [1, 56, 137].includes(Number(chainId))) {
        fetchGasPrice()
      }
      timer.current = setInterval(init, 30000)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [chainId, fromCurrency])

  const fetchGasPrice = async () => {
    try {
      const { gasPriceInWei } = await estimateGasPrice()
      setGasPrice(gasPriceInWei)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchQuoteFromMayan = async (amount) => {
    const _quote = await fetchQuote({
      amount,
      fromToken: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      toToken: '0x0000000000000000000000000000000000000000',
      fromChain: 'solana',
      toChain: getChainName(chainId),
      slippage: 3,
    })

    return _quote
  }

  const verifySwapComplete = async (tx, retryAttemts, commitment = 'finalized') => {
    try {
      const res = await axios.get(`https://explorer-api.mayan.finance/v1/swap/trx/${tx}`)
      if (res.data.status === 'REDEEMED_ON_EVM') {
        return res.data
      } else {
        if (commitment === 'processed') {
          return res.data
        } else {
          await new Promise((resolve) => setTimeout(resolve, 10000))
          return verifySwapComplete(tx, 0)
        }
      }
    } catch (e) {
      console.log(e)

      if (retryAttemts > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        return verifySwapComplete(tx, retryAttemts - 1)
      } else {
        throw new Error('Failed to swap')
      }
    }
  }

  const initSwap = async (amount) => {
    try {
      const quote = await fetchQuoteFromMayan(amount)

      const swapTrx = await swapFromSolana(
        quote,
        solanaWalletAddress.toBase58(),
        account,
        100000,
        null,
        signTransaction,
        connection,
      )

      await verifySwapComplete(swapTrx, 100, 'processed')

      return swapTrx
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  const renderEvmSwapDetails = () => {
    return (
      <EvmSwapDetail
        multiplier={multiplier}
        amountIn={amountIn}
        getQuote={fetchQuoteFromMayan}
        quote={quote}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        gasPrice={gasPrice}
      />
    )
  }

  const requiredCustomAmountForEvm = quote.expectedAmountOut
    ? new BigNumber(amountIn)
        .multipliedBy(multiplier)
        .plus(quote.redeemRelayerFee)
        .plus(gasPrice)
        .multipliedBy(1000000000)
        .dividedBy(quote.minAmountOut)
        .plus(quote.swapRelayerFee)
        .toFixed(4)
    : new BigNumber(amountIn).toFixed(2)

  return {
    initSwap,
    verifySwapComplete,
    renderEvmSwapDetails,
    requiredCustomAmountForEvm,
    isEvmSwapDetailsLoading: isLoading,
  }
}

export default useToEvmSwap
