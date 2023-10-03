import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import {
  fair,
  foundation,
  heyMint,
  launchMyNft,
  magicEden,
  manifold,
  opensea,
  rarible,
  zora,
} from '../../assets/images/launchpad'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import { getImageUrl } from '../../utils'

const launchpadIcons = {
  SEA_DROP: opensea,
  FAIR: fair,
  MAGIC_EDEN: magicEden,
  MANIFOLD: manifold,
  ZORA: zora,
  FOUNDATION: foundation,
  FOUNDATION_DROP: foundation,
  HEY_MINT: heyMint,
  RARIBLE: rarible,
  LAUNCH_MY_NFT: launchMyNft,
}
const launchpadLabel = {
  SEA_DROP: 'Open Sea',
  FAIR: 'Fair',
  MAGIC_EDEN: 'Magic Eden',
  MANIFOLD: 'Manifold',
  ZORA: 'Zora',
  FOUNDATION: 'Foundation',
  FOUNDATION_DROP: 'Foundation',
  HEY_MINT: 'Hey Mint',
  RARIBLE: 'Rarible',
  LAUNCH_MY_NFT: 'Launch My Nft',
  FEATURED: 'Featured',
}

const LaunchpadLabel = ({ launchpad }) => {
  const { profile } = useConsumerContext()
  const { profileImage } = profile || {}
  return (
    <Flex align="center" ml={2} border="1px solid" borderColor="input" borderRadius={4} p="2px">
      <Image
        w={3}
        h={3}
        mr={1}
        borderRadius={5}
        src={launchpad === 'FEATURED' ? `${getImageUrl(profileImage, { height: 40 })}` : launchpadIcons[launchpad]}
        objectFit={'contain'}
      />

      <Text noOfLines={1} fontSize={'2xs'} color="mutedForeground">
        {launchpadLabel[launchpad]}
      </Text>
    </Flex>
  )
}

export default LaunchpadLabel
