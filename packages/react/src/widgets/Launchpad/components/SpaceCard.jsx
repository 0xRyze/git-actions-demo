import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { getImageUrl } from '../../../utils'

const SpaceCard = ({ data, selectSpace }) => {
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
      onClick={() => selectSpace(data.spaceId)}
    >
      <Image
        h="180px"
        src={getImageUrl(data?.profile?.profileImage, { height: 400, quality: 80 })}
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
        <Tooltip label={data?.profile?.name}>
          <Text fontWeight={'semibold'} fontSize={'14'} textAlign={'center'} noOfLines={1}>
            {data?.profile?.name}
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  )
}

export default SpaceCard
