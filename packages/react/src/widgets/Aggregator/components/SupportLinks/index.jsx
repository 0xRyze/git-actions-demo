import React from 'react'
import { Flex, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { SUBMIT_COLLECTION_LINK, SUPPORT_Link } from '../../../../constants/ExternalLinks'

const SupportLinks = () => {
  return (
    <Flex align="center">
      <Flex align="center">
        <Link fontSize={'xs'} color="mutedForeground" fontWeight={600} href={SUBMIT_COLLECTION_LINK} isExternal>
          Submit collection
        </Link>
        <ExternalLinkIcon ml={1} color="mutedForeground" boxSize={3} />
      </Flex>
      <Flex align="center">
        <Link ml={4} fontSize={'xs'} color="mutedForeground" fontWeight={600} href={SUPPORT_Link} isExternal>
          Help
        </Link>
        <ExternalLinkIcon ml={1} color="mutedForeground" boxSize={3} />
      </Flex>
    </Flex>
  )
}

export default SupportLinks
