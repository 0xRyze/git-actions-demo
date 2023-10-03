import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Loader from '../../../components/Loader'

const Pending = ({ goBack }) => {
  return (
    <Box>
      <Flex direction="column" alignItems="center" mt={6}>
        <Loader mb={5} />
        <Text fontSize={16}>Connecting to your wallet</Text>
        <Text fontSize={14}>Click connect in your wallet popup</Text>
      </Flex>
    </Box>
  )
}

export default Pending
