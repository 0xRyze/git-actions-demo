import React, { useEffect, useRef, useState } from 'react'
import { fetchQuote, swapFromSolana } from '@mayanfinance/swap-sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import axios from 'axios'

const getSwapDetails = (currency) => {
  switch (currency) {
    case 'BONK':
      return {
        token: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        chain: 'solana',
        quoteAmount: 1000000,
      }
    case 'SOL':
      return {
        token: '0x0000000000000000000000000000000000000000',
        chain: 'solana',
        quoteAmount: 1,
      }
    case 'USDT':
      return {
        token: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        chain: 'solana',
        quoteAmount: 1,
      }
    case 'ETH':
      return {
        token: '0x0000000000000000000000000000000000000000',
        chain: 'ethereum',
        quoteAmount: 1,
      }
    default:
      return null
  }
}

const useCustomSwap = ({ amountIn, fromCurrency, toCurrency }) => {
  const [quote, setQuote] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [gasPrice, setGasPrice] = useState(0)
  const { publicKey: solanaWalletAddress, signTransaction } = useWallet()

  const { connection } = useConnection()

  const toast = useToast()
  const timer = useRef(null)

  const quoteAmount = getSwapDetails(fromCurrency)?.quoteAmount || 1

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const _quote = await fetchQuoteFromMayan(quoteAmount)
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
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      init()
      timer.current = setInterval(init, 30000)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [fromCurrency, toCurrency])

  const fetchQuoteFromMayan = async (amount) => {
    const _quote = await fetchQuote({
      amount,
      fromToken: getSwapDetails(fromCurrency).token,
      toToken: getSwapDetails(toCurrency).token,
      fromChain: getSwapDetails(fromCurrency).chain,
      toChain: getSwapDetails(toCurrency).chain,
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
        solanaWalletAddress.toBase58(),
        100000,
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

  const requiredAmount =
    fromCurrency !== toCurrency && quote.expectedAmountOut
      ? new BigNumber(amountIn).multipliedBy(quoteAmount).dividedBy(quote.minAmountOut).toFixed(4)
      : new BigNumber(amountIn).toFixed(2)

  return {
    initSwap,
    verifySwapComplete,
    requiredAmount,
    isFetchingQuote: isLoading,
  }
}

export default useCustomSwap
