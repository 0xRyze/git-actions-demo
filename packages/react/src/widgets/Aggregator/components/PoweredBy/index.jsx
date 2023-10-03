import React from 'react'
import { Flex, Image, Link, Text } from '@chakra-ui/react'
import { banditB } from '../../../../assets/images'

const PoweredBy = () => {
  return (
    <Flex align="center">
      <Text color="mutedForeground" as="span" fontSize={'xs'} fontWeight={400}>
        Powered by{' '}
      </Text>
      <Image src={banditB} width={'12px'} height={'12px'} alt="Bandit Network" marginX={1} />

      <Link fontSize={'xs'} color="foreground" fontWeight={600} href="https://bandit.network" isExternal>
        Bandit
      </Link>
    </Flex>
  )
}

export default PoweredBy
