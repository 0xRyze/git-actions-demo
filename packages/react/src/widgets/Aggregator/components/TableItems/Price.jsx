import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import TokenIcon from '../../../../components/Svgs/tokenIcons'

const Price = ({ chainId, price }) => {
  return (
    <Flex alignItems="center" justifyContent={'center'}>
      <Text fontSize={['xs', 'sm']} fontWeight={'medium'} mr={1} sx={{ lineHeight: 1 }}>
        {price?.value
          ? price?.value === 'TBD'
            ? price?.value
            : parseFloat(Number(price?.value)?.toPrecision(6))
          : '--'}
      </Text>
      <Box ml="1">
        <TokenIcon width={14} height={14} chainId={chainId} />
      </Box>
    </Flex>
  )
}

export default Price
