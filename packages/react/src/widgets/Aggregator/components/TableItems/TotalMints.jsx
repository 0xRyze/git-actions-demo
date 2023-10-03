import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { makeFriendlyNumber } from '../../../../utils'

const TotalMints = ({ maxSupply, totalSupply }) => {
  return (
    <Flex>
      <Text fontSize={['xs', 'sm']} fontWeight={'medium'}>
        {makeFriendlyNumber(Number(totalSupply)).toLocaleString()}
      </Text>
      {maxSupply !== 0 && (
        <Text color="mutedForeground" fontSize={['xs', 'sm']} fontWeight={'medium'} title={maxSupply}>
          /{makeFriendlyNumber(maxSupply).toLocaleString()}
        </Text>
      )}
    </Flex>
  )
}

export default TotalMints
