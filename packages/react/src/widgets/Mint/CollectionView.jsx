import React, { useCallback } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { Button, Link } from '@chakra-ui/react'
import Website from '../../components/Svgs/website'
import Discord from '../../components/Svgs/discord'
import Twitter from '../../components/Svgs/twitter'
import CopyAddress from '../../components/CopyAddress'
import styled from '@emotion/styled'
import { getImageUrl, makeFriendlyNumber } from '../../utils'
import { DISCORD, TWITTER } from '../../constants/socialMedia'
import TokenIcon from '../../components/Svgs/tokenIcons'
import TopWallets from '../Aggregator/components/TableItems/TopWallets'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export const Description = styled(Text)`
  div {
    .short-text .readMoreText {
      color: var(--bad-colors-primary) !important;
      text-decoration: underline;
      font-weight: 600;
    }
  }
`

const CollectionView = ({ onClickTab, collection }) => {
  const { collectionState } = collection
  const { profile, contract, stats, mintEnabled, isExternalMint, isCollectionContest, isDomain } = collectionState || {}
  const { profileImage, coverImage, name, description, socialmedia } = profile || {}
  const { chainId, contractAddress, candyMachineId } = contract || {}
  const { twitter, discord, website } = socialmedia || {}
  const { price, maxSupply, mintPercentage, totalSupply } = stats || {}

  const onClickMint = useCallback(() => {
    if (isExternalMint) {
      window.open(website, '_blank')
    } else {
      onClickTab(1)
    }
  }, [isExternalMint, onClickTab])
  return (
    <Box mt={4}>
      <Box borderRadius={'lg'} overflow={'hidden'} position={'relative'}>
        <Image
          bg="muted"
          fallback={<Box w="full" h={'180px'} bg={'muted'} />}
          src={getImageUrl(coverImage, { height: 250 })}
          w="full"
          h={'180px'}
          objectFit="cover"
        />
        <Box position={'absolute'} zIndex={1} right={2} bottom={2} bg={'muted'} borderRadius={'md'}>
          {website && (
            <Button variant="secondary" size={'sm'}>
              <Link href={`${website}`} target="_blank">
                <Website width="24px" height="24px" iconcolor={'var(--bad-colors-mutedForeground)'} />
              </Link>
            </Button>
          )}
          {discord && (
            <Button variant="secondary" size={'xs'}>
              <Link href={`${DISCORD}${discord}`} target="_blank">
                <Discord width="24px" height="24px" iconcolor={'var(--bad-colors-mutedForeground)'} />
              </Link>
            </Button>
          )}
          {twitter && (
            <Button variant="secondary" size={'xs'}>
              <Link href={`${TWITTER}${twitter}`} target="_blank">
                <Twitter width="24px" height="24px" iconcolor={'var(--bad-colors-mutedForeground)'} />
              </Link>
            </Button>
          )}
        </Box>
      </Box>
      <Box
        borderRadius={'lg'}
        overflow={'hidden'}
        w={[24, 24]}
        h={[24, 24]}
        mt={-20}
        ml={4}
        zIndex={2}
        position={'relative'}
        borderColor={'input'}
        borderWidth={'1px'}
        borderStyle={'solid'}
      >
        <Image
          bg="muted"
          fallback={<Box w={[24, 24]} h={[24, 24]} bg={'muted'} />}
          src={getImageUrl(profileImage, { height: 250 })}
          w={[24, 24]}
          h={[24, 24]}
          objectFit="cover"
        />
      </Box>

      <Box mt={1}>
        <Flex
          flexDirection={['column', 'row']}
          alignItems={['flex-start', 'center']}
          justifyContent={['space-between']}
          mb={2}
        >
          <Box flex={1}>
            <Text noOfLines={2} fontSize={'lg'} fontWeight={'bold'} mb={1}>
              {name}
            </Text>
            <Flex mb={1}>
              <Text fontSize={'md'} mr={1}>
                {(chainId === 9091 || chainId === 9090) && !isCollectionContest && !isDomain
                  ? `Candy Machine Address:`
                  : `Contract Address:`}
              </Text>
              <CopyAddress
                address={chainId === 9091 || chainId === 9090 ? candyMachineId : contractAddress}
                chainId={chainId}
              />
            </Flex>
          </Box>

          <Flex flex={1} justifyContent="flex-end">
            <Box>
              <Text color="mutedForeground" fontSize={'xs'}>
                Mint Price
              </Text>
              <Box fontSize={'sm'}>
                <Flex align={'center'}>
                  {price?.value === '0' ? 'Free' : price?.value ? price?.value : '--'}
                  <Box ml={1}>
                    <TokenIcon width={10} height={10} chainId={chainId} />
                  </Box>
                </Flex>
              </Box>
            </Box>
            <Box ml={4}>
              <Text color="mutedForeground" fontSize={'xs'}>
                Total Mints
              </Text>
              <Text fontSize={'sm'}>
                {makeFriendlyNumber(Number(totalSupply)).toLocaleString()}{' '}
                {maxSupply !== 0 && `/${makeFriendlyNumber(maxSupply).toLocaleString()}`}
              </Text>
            </Box>
            <Box ml={4}>
              <Text color="mutedForeground" fontSize={'xs'}>
                Top Wallets
              </Text>
              <TopWallets
                topWallets={stats?.topWalletsPreview}
                totalTopWallets={stats?.totalTopWallets}
                chainId={contract?.chainId}
                profile={profile}
                collectionId={collectionState?.collectionId}
              />
            </Box>
            <Box ml={4}>
              <Text color="mutedForeground" fontSize={'xs'}>
                Mint %
              </Text>
              <Text fontSize={'sm'}>{maxSupply === 0 ? '-' : mintPercentage}</Text>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/*{description && (*/}
      {/*  <Description fontSize={'sm'} mb={4}>*/}
      {/*    <ReadMoreAndLess className="read-more-content" charLimit={100} readMoreText="  more" readLessText="  less">*/}
      {/*      {description}*/}
      {/*    </ReadMoreAndLess>*/}
      {/*  </Description>*/}
      {/*)}*/}

      <Flex justifyContent="center">
        <Button
          minWidth={40}
          variant="primary"
          textAlign={'center'}
          onClick={onClickMint}
          isDisabled={!mintEnabled}
          rightIcon={isExternalMint ? <ExternalLinkIcon /> : null}
        >
          Mint
        </Button>
      </Flex>
    </Box>
  )
}

export default CollectionView
