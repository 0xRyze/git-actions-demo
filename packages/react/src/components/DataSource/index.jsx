import { Box, chakra, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { banditB } from '../../assets/images'

const DataSource = () => {
  return (
    <Box>
      <Flex alignItems={'center'}>
        <Text color="foreground" mr="1" fontWeight={'600'}>
          Powered By:
        </Text>
        <Flex
          alignItems={'center'}
          backgroundColor={'gray.100'}
          p="2"
          borderRadius={'8'}
          cursor="pointer"
          onClick={() => window.open('https://bandit.network')}
        >
          <Image alt="" w="5" h="5" src={banditB} />
          <Text color="gray.600" fontWeight={'600'} ml="2">
            Bandit
          </Text>
          <ExternalLinkIcon color={'gray.600'} ml="2" w="4" h="4" />
        </Flex>
      </Flex>
    </Box>
  )
}

export default chakra(DataSource)
