import React from 'react'
import { Flex, Spinner } from '@chakra-ui/react'

const Loading = () => {
  return (
    <Flex height="350px" justify="center" align="center">
      <Spinner thickness="4px" size="lg" />
    </Flex>
  )
}

export default Loading;
