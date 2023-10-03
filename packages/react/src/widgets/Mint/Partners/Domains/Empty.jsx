import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'

const Empty = () => {
  return (
    <Flex marginY={8} direction="column" align="center">
      <Search2Icon mb={3} />
      <Text fontSize={'md'} fontWeight={500} width="80%" textAlign="center" margin="0 auto">
        Find your perfect domain by typing into the search field above.
      </Text>
    </Flex>
  )
}

export default Empty
