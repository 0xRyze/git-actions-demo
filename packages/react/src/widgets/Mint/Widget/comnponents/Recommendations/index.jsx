import React, { useCallback, useEffect, useState } from 'react'
import RecommendationCard, { RecommendationCardSkeleton } from './RecommendationCard'
import { Flex, Text } from '@chakra-ui/layout'
import { fetchRecommendations } from '../../../../../state/collection/source'
import useWalletContext from '../../../../../components/WalletModal/hooks/useWalletContext'
import { useConsumerContext } from '../../../../../hooks/useConsumerContext'
// import { Swiper, SwiperSlide } from 'swiper/react'

const Recommendations = ({ tags }) => {
  const [collectionList, setCollectionList] = useState([])
  const { primaryAddress } = useWalletContext()
  const { accessKey } = useConsumerContext()
  const [loading, setLoading] = useState(true)

  const getRecommendations = useCallback(async () => {
    try {
      if (!primaryAddress || !accessKey) return
      const res = await fetchRecommendations(primaryAddress, accessKey, tags)
      setCollectionList(res)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [primaryAddress, accessKey, tags])

  useEffect(() => {
    getRecommendations()
  }, [getRecommendations])

  return (
    <Flex flexDir={'column'}>
      {collectionList && (
        <Text fontSize="sm" opacity={0.5}>
          More collections to consider:
        </Text>
      )}
      <Flex overflowY={'auto'}>
        {!loading &&
          collectionList &&
          collectionList.map(({ collectionId, profileImage, name, chainId, price }) => (
            <RecommendationCard
              key={collectionId}
              collectionId={collectionId}
              image={profileImage}
              title={name}
              isContest={false}
              price={price}
              chainId={chainId}
            />
          ))}
      </Flex>
      <Flex>{loading && [0, 1, 2].map((e) => <RecommendationCardSkeleton />)}</Flex>
    </Flex>
  )
}

export default Recommendations
