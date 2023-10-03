import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { getImageUrl } from '../../../../utils'
import dayjs from 'dayjs'
import LaunchpadLabel from '../../../../components/LaunchpadLabel'
import { useDispatch } from 'react-redux'

const Collection = ({
  collectionId,
  profileImage,
  name,
  isFeatured,
  launchedOn,
  startDate,
  onClickCollection,
  launchpad,
}) => {
  const dispatch = useDispatch()
  return (
    <Flex
      alignItems="center"
      onClick={() => {
        onClickCollection(collectionId)
      }}
      cursor="pointer"
      minW="full"
    >
      <Image
        src={
          profileImage &&
          getImageUrl(profileImage, {
            height: 100,
            quality: 80,
          })
        }
        fallback={<Box w={8} h={8} bg="muted" borderRadius={'sm'} />}
        w="8"
        h="8"
        borderRadius={'sm'}
        alt={name}
        objectFit="cover"
        loading={'lazy'}
        decoding={'async'}
      />
      <Box ml={2}>
        <Flex align="center" justify="space-between">
          <Text
            // gradientText={isFeatured}
            noOfLines={1}
            fontWeight={'medium'}
            fontSize={['xs', 'sm']}
            mr={1}
            lineHeight={1.4}
            flex={1}
          >
            {name}
          </Text>
          {isFeatured ? (
            <LaunchpadLabel launchpad={'FEATURED'} />
          ) : launchpad !== 'STANDARD' && launchpad !== 'OTHERS' ? (
            <LaunchpadLabel launchpad={launchpad} />
          ) : null}
        </Flex>

        <Flex align="center">
          <Text noOfLines={1} fontSize={['2xs']} color="mutedForeground" lineHeight={1.2}>
            {launchedOn === 'just now' ? dayjs.unix(startDate).format('MMM DD YYYY, h:mm a') : launchedOn}
          </Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Collection
