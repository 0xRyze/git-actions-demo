import React from 'react'
import { Flex } from '@chakra-ui/react'
import LoadingText from '../../../../components/Loader/LoadingText'
import Loader from '../../../../components/Loader'

const DomainMintingLoader = ({ completed, message }) => {
  if (completed) return null
  return (
    <Flex flexDir={'column'} w="full" justifyContent={'center'} alignItems={'center'}>
      <Flex align="center" mb="4">
        <Loader size="md" mr={'10px'} />
        <LoadingText text="Minting In Progress" fontSize={22} fontWeight={600} />
      </Flex>
      {message()}
    </Flex>
  )
}

export default DomainMintingLoader
