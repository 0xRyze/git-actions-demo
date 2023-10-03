import React from 'react'
import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { makeFriendlyNumber } from '../../../../utils'

const UniqueMinters = ({ minters, totalSupply }) => {
  return (
    <Box>
      <Flex justifyContent={'center'}>
        <Text fontSize={['14', '14', '14', '11', '14']} fontWeight={'medium'}>
          {isNaN(minters / totalSupply) || !isFinite(minters / totalSupply)
            ? '0%'
            : `${((minters / totalSupply) * 100).toPrecision(3)}%`}
        </Text>
        <Text color="mutedForeground" fontSize={'sm'} fontWeight={'medium'} ml="2">{`(${makeFriendlyNumber(
          minters,
        )})`}</Text>
      </Flex>
      <Progress
        h={2}
        w={'100%'}
        minWidth={'20'}
        borderRadius={'8'}
        value={isNaN(minters / totalSupply) ? 0 : (minters / totalSupply) * 100}
        backgroundColor={'input'}
      />
    </Box>
  )
}

export default UniqueMinters
