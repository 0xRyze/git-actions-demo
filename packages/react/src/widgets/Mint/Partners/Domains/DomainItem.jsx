import React from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'

const StrikeThrough = styled(Text)`
  position: relative;
  width: fit-content;
  margin: 0 auto;

  &:after {
    content: '';
    border-top: 1px solid #2d3748;
    width: 100%;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
  }
`

const DomainItem = ({ selected, onSelect, onUnSelect, domain, currency }) => {
  const { name, availability, rate, discountedRate, discount } = domain

  const { price, status } = availability
  const {
    subTotal: { usdCents },
  } = price

  const onClickClose = (e) => {
    e.stopPropagation()
    onUnSelect()
  }

  const buttonTitle = () => {
    if (status === 'NOT_AVAILABLE') {
      return 'Sold'
    } else if (selected) {
      return 'Selected'
    } else if (!selected) {
      return 'Select'
    }
  }

  const onButtonClick = () => {
    if (selected) {
      onUnSelect()
    } else if (!selected) {
      onSelect()
    }
  }

  return (
    <Box
      position="relative"
      paddingY={2}
      mb={3}
      zIndex="1"
      border="1px solid #cccccc"
      borderRadius={10}
      flexDir={'row'}
    >
      {/*{selected && (*/}
      {/*  <CloseIcon*/}
      {/*    onClick={onClickClose}*/}
      {/*    cursor="pointer"*/}
      {/*    w={'12px'}*/}
      {/*    h={'12px'}*/}
      {/*    position="absolute"*/}
      {/*    right="-3px"*/}
      {/*    top="-3px"*/}
      {/*    zIndex="-1"*/}
      {/*  />*/}
      {/*)}*/}
      <Flex paddingX={3} align="center" justify="space-between" flexDir={'row'}>
        <Text fontSize={14}>{name}</Text>
        <Flex align="center">
          {status === 'AVAILABLE' && (
            <Box mr={4}>
              <Text textAlign="center" fontSize={12} fontWeight={600}>
                {discountedRate[currency] ?? usdCents / 100} {currency}{' '}
                <span style={{ fontWeight: 600 }}>(${discountedRate['USDT']})</span>
              </Text>
              {discount > 0 && (
                <Flex>
                  <StrikeThrough textAlign="center" fontSize={10} fontWeight={500} lineHeight={1}>
                    {rate[currency] ?? usdCents / 100} {currency}{' '}
                    <span style={{ fontWeight: 400 }}>(${usdCents / 100})</span>
                  </StrikeThrough>
                  <Text ml={1} textAlign="center" fontSize={10} fontWeight={500} lineHeight={1} color="green">
                    ({discount}% off)
                  </Text>
                </Flex>
              )}
            </Box>
          )}

          <Button
            size="sm"
            variant="outline"
            bg={selected ? 'input' : 'initial'}
            minWidth="20"
            onClick={onButtonClick}
            isDisabled={status === 'NOT_AVAILABLE'}
          >
            {buttonTitle()}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default DomainItem
