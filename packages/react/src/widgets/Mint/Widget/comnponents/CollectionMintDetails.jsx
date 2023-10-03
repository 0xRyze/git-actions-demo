import React, { useCallback } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import CopyAddress from '../../../../components/CopyAddress'
import TokenIcon from '../../../../components/Svgs/tokenIcons'
import { getImageUrl } from '../../../../utils'

const StatsItem = ({ title, value, valuePrefix, ...props }) => {
  return (
    <Flex align="center" {...props}>
      <Text fontSize="12px" fontWeight={600} opacity={'0.6 !important'} mr="5px">
        {title}:
      </Text>
      <Flex align="center">
        {valuePrefix}
        <Text fontSize="12px" fontWeight={600} opacity={'0.6 !important'}>
          {value}
        </Text>
      </Flex>
    </Flex>
  )
}

const CollectionMintDetails = ({ collectionState }) => {
  const getStatsContent = useCallback(() => {
    const { stats, contract } = collectionState
    const statsItem = [
      {
        title: 'Mint price',
        value: stats?.price?.value,
        valuePrefix: (
          <Box mr="1">
            <TokenIcon width="12px" height="12px" chainId={contract?.chainId} />
          </Box>
        ),
      },
      { title: 'Minted', value: stats?.totalSupply },
      { title: 'Supply', value: stats?.maxSupply },
    ]

    return statsItem.map((item, index) => (
      <StatsItem
        key={index}
        p={index !== 0 ? '0 10px' : '0 10px 0 0 '}
        borderRight={index !== statsItem.length - 1 ? '1px solid #49536E' : 'unset'}
        title={item.title}
        value={item.value}
        valuePrefix={item.valuePrefix}
      />
    ))
  }, [collectionState])
  return (
    <Box>
      <Flex gap={2} align="center">
        <Image
          src={
            collectionState?.profile?.profileImage
              ? getImageUrl(collectionState?.profile?.profileImage, { height: 150 })
              : '/assets/images/BadBanditnft.png'
          }
          width={'50px'}
          height={'50px'}
          alt=""
          borderRadius="12"
        />
        <Flex direction="column">
          <Text fontSize={16} fontWeight={500}>
            {collectionState?.profile?.name}
          </Text>
          <CopyAddress
            address={
              [9090, 9091].includes(collectionState?.contract?.chainId)
                ? collectionState?.contract?.candyMachineId
                : collectionState?.contract?.contractAddress
            }
            chainId={collectionState?.contract?.chainId}
          />
        </Flex>
      </Flex>

      <Flex mt={'5px'}>{!collectionState?.isCollectionContest && !collectionState?.isDomain && getStatsContent()}</Flex>
    </Box>
  )
}

export default CollectionMintDetails
