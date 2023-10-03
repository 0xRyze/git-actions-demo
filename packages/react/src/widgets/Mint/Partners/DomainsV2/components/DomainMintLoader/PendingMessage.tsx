import { Flex } from '@chakra-ui/react'
import React from 'react'

interface Props {
  children: React.ReactNode
}

const PendingMessage: React.FC<Props> = ({ children }) => {
  return (
    <Flex mt="-4" mb="10" w="full" justifyContent={'center'}>
      {children}
    </Flex>
  )
}

export default PendingMessage
