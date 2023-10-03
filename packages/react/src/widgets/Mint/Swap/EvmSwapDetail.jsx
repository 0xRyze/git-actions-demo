import React, { useEffect, useState } from 'react'
import { Box, Divider, Flex, Text, Tooltip } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'

import BigNumber from 'bignumber.js'
import Account from '../components/Account'
import { eToNumber } from '../../../utils'

const StyledCard = styled(Box)`
  box-shadow: 0 5px 10px rgb(0, 0, 0, 12%);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
`

export const Item = ({ title, value, info }) => {
  return (
    <Flex justifyContent="space-between">
      <Text fontSize={12} fontWeight={600} opacity={'0.8 !important'}>
        {title}{' '}
        {info && (
          <Tooltip label={info}>
            <QuestionOutlineIcon />
          </Tooltip>
        )}
      </Text>
      <Text fontSize={12} fontWeight={600}>
        {value}
      </Text>
    </Flex>
  )
}

const EvmSwapDetail = ({ quote, getQuote, amountIn, toCurrency = '', fromCurrency, multiplier, gasPrice }) => {
  const [collapse, setCollapse] = useState(false)
  const [toEvmQuote, setToEvmQuote] = useState({})

  useEffect(() => {
    if (!!Object.keys(quote).length && amountIn) {
      fetchToEvmQuote()
    }
  }, [quote, amountIn, multiplier])

  const fetchToEvmQuote = async () => {
    try {
      const requiredCustomAmountForEvm = new BigNumber(amountIn)
        .multipliedBy(multiplier)
        .plus(quote.redeemRelayerFee)
        .plus(gasPrice)
        .multipliedBy(1000000000)
        .dividedBy(quote.minAmountOut)
        .plus(quote.swapRelayerFee)
        .toFixed(0)

      const _quote = await getQuote(requiredCustomAmountForEvm)
      setToEvmQuote(_quote)
    } catch (e) {
      console.log(e)
    }
  }

  const toggleCollapse = () => {
    setCollapse((state) => !state)
  }

  if (!Object.keys(toEvmQuote).length) return null

  const { minReceived, minAmountOut, expectedAmountOut, priceImpact, swapRelayerFee, redeemRelayerFee } = toEvmQuote

  return (
    <StyledCard>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight={500} fontSize={14}>
          1 {fromCurrency} = {eToNumber(String(toEvmQuote?.price))} {toCurrency}
        </Text>
        {collapse ? (
          <ChevronUpIcon cursor="pointer" boxSize={'24px'} onClick={toggleCollapse} />
        ) : (
          <ChevronDownIcon cursor="pointer" boxSize={'24px'} onClick={toggleCollapse} />
        )}
      </Flex>
      {!collapse && (
        <>
          <Item
            title="Minimum Received"
            value={`${minReceived} ${toCurrency}`}
            info="The least amount of tokens you will receive on this trade"
          />

          <Divider colorScheme="black" marginY={2} />
          {/*<Item*/}
          {/*  title="Expected output"*/}
          {/*  value={`${expectedAmountOut} ${toCurrency}`}*/}
          {/*  info="Minimum Received minus relayer fees"*/}
          {/*/>*/}
          <Item
            title="Price Impact"
            value={`${new BigNumber(priceImpact).multipliedBy(100).toString()}%`}
            info="The difference between the market price and estimated price due to trade size"
          />
          <Item
            title="Slippage Tolerance"
            value="3%"
            info="The maximum difference between your estimated price and execution price"
          />
          <Item
            title="Relayer Fee"
            value={`${swapRelayerFee.toFixed(2)} ${fromCurrency} + ${redeemRelayerFee} ${toCurrency}`}
            info=""
          />
          <Divider colorScheme={'blackAlpha'} marginY={2} />

          <Item
            title="Payment wallet"
            value={<Account selectedWallet="Phantom" />}
            info="Payment will be made from this account."
          />
          <Item
            title="Receivable wallet"
            value={<Account selectedWallet="evm" />}
            info="NFT will be minted to this account and transferred to the same account"
          />
        </>
      )}
    </StyledCard>
  )
}

export default EvmSwapDetail
