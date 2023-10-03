import { Box, Flex, Image, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { getImageUrl } from '../../../utils'

export const CollectionCardSkeleton = () => {
  return (
    <Skeleton
      borderColor={'mutedForeground'}
      borderWidth={'1px'}
      borderStyle={'solid'}
      borderRadius={'12'}
      flexDir={'column'}
      overflow={'hidden'}
      pos={'relative'}
      cursor={'pointer'}
      justifyContent={'flex-start'}
      startColor="muted"
      endColor="input"
    >
      <Skeleton h="180px" w="full" borderRadius={'12'} startColor="muted" endColor="input" />
      <Skeleton
        mt="1"
        pb="2"
        flexDir={'column'}
        h="full"
        justifyContent={'center'}
        startColor="muted"
        endColor="input"
      />
    </Skeleton>
  )
}

const CollectionCard = ({ data, selectCollection }) => {
  return (
    <Flex
      borderColor={'mutedForeground'}
      borderWidth={'1px'}
      borderStyle={'solid'}
      borderRadius={'12'}
      flexDir={'column'}
      overflow={'hidden'}
      pos={'relative'}
      cursor={'pointer'}
      justifyContent={'flex-start'}
      onClick={() => selectCollection(data.collectionId)}
    >
      <Image
        h="180px"
        src={getImageUrl(data?.profileImage, { height: 400, quality: 80 })}
        fallback={<Box w={'full'} h={'180px'} bg="muted" borderRadius={'sm'} />}
        alt=""
        w="full"
        borderRadius={'12'}
        borderColor={'white'}
        borderWidth={'2px'}
        borderStyle={'solid'}
        objectFit={'cover'}
      />
      <Flex mt="1" pb="2" flexDir={'column'} h="full" justifyContent={'center'}>
        <Tooltip label={data?.name}>
          <Text fontWeight={'semibold'} fontSize={'14'} textAlign={'center'} noOfLines={1}>
            {data?.name}
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  )
}

export default CollectionCard
