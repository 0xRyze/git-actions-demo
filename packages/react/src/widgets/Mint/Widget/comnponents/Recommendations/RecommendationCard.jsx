import React from 'react'
import { Box, Button, Flex, Image, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import { getImageUrl } from '../../../../../utils'
import TokenIcon from '../../../../../components/Svgs/tokenIcons'

export const RecommendationCardSkeleton = () => {
  return (
    <Flex bg="muted" w="full" minW={['44']} p="2" borderRadius={'8'} m="1" flexDir={'column'}>
      <Flex>
        <Skeleton w="14" h="10" borderRadius={'6'} />
        <Flex ml="2" w="full" flexDir={'column'} justifyContent={'space-between'}>
          <Skeleton h="4" w="full" />
          <Skeleton h="4" w="full" mt="2" />
        </Flex>
      </Flex>
      <Skeleton w="full" h="6" mt="2" />
    </Flex>
  )
}

const RecommendationCard = ({ title, image, isContest, collectionId, price, chainId }) => {
  const openCollection = () => {
    window.open(`${window.origin}?collectionId=${collectionId}`, '_blank')
  }
  return (
    <Flex bg="muted" w="full" minW={['44']} p="2" borderRadius={'8'} m="1" flexDir={'column'} className="swiper-slide">
      <Flex>
        <Image
          src={getImageUrl(image, {
            height: '100',
            quality: '80',
          })}
          w="10"
          h="10"
          borderRadius={'6'}
        />
        <Flex ml="2" w="full" flexDir={'column'} justifyContent={'space-between'}>
          <Tooltip label={title} display={title?.length > 15 ? 'initial' : 'none'}>
            <Text fontSize={'13'} noOfLines={1} fontWeight={'medium'}>
              {title}
            </Text>
          </Tooltip>
          <Text fontSize={'sm'}>
            <Flex align={'center'}>
              <Text fontSize={'12'}>Price: {price === '0' ? 'Free' : price ? price : '--'}</Text>
              <Box ml={1}>
                <TokenIcon width={10} height={10} chainId={chainId} />
              </Box>
            </Flex>
          </Text>
        </Flex>
      </Flex>
      <Button size={'xs'} mt="2" variant={'primary'} onClick={openCollection}>
        {isContest ? 'Claim' : 'Mint'}
      </Button>
    </Flex>
  )
}

export default RecommendationCard
