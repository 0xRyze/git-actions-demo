import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import JazzIcon from '../../../../../components/Svgs/JazzIcon'
import { fetchContestParticipants } from '../../../../../state/contest/source'
import { truncateAddress } from '../../../../../utils'

const Participants = ({ collectionId, accessKey }) => {
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState(1)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const ITEMS_PER_PAGE = 12

  const getParticipants = useCallback(async () => {
    try {
      if (!collectionId || !accessKey) return
      setFetching(true)
      const { data, totalResult } = await fetchContestParticipants(collectionId, offset, ITEMS_PER_PAGE, accessKey)
      setParticipants(data)
      setTotalParticipants(totalResult)
    } catch (e) {
      console.log(e)
    } finally {
      setFetching(false)
      setLoading(false)
    }
  }, [collectionId, accessKey, offset, page])

  useEffect(() => {
    getParticipants()
  }, [getParticipants])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    setOffset((newPage - 1) * ITEMS_PER_PAGE)
  }

  if (loading)
    return (
      <Skeleton
        mt={2}
        ml="2"
        isLoaded={false}
        fadeDuration={0.1}
        minW={'40'}
        minH={8}
        startColor="muted"
        endColor="input"
        borderRadius={'8'}
      />
    )

  if (!participants.length) return null

  return (
    <>
      <Flex onClick={onOpen} alignItems="flex-end" cursor="pointer">
        {participants.slice(0, 11).map((address, index) => (
          <Box h={'24px'} ml={index > 0 ? '-15px' : '0'} key={address}>
            <JazzIcon key={address} address={address} />
          </Box>
        ))}
        <Text fontWeight={'medium'} fontSize={14} ml={2}>
          {totalParticipants} Participants
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="0">{`Participants (${totalParticipants})`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mr={3} mt={2}>
              <Grid
                // templateRows='repeat(2, 1fr)'
                templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
                gap={4}
                mt={4}
              >
                {participants.map((address, index) => (
                  <GridItem key={index}>
                    <Flex align="center">
                      <JazzIcon address={address} />
                      <Text ml={2} fontSize={14}>
                        {truncateAddress(address, 6)}
                      </Text>
                    </Flex>
                  </GridItem>
                ))}
              </Grid>
              <Flex alignItems={'center'} mt="2" justifyContent={'center'}>
                <Flex>
                  <ChevronLeftIcon
                    w="7"
                    h="7"
                    color={page === 1 ? 'brand.400' : 'mutedForeground'}
                    cursor={page === 1 ? 'not-allowed' : 'pointer'}
                    mx="1"
                    onClick={page === 1 ? () => {} : () => handlePageChange(page - 1)}
                  />
                  <ChevronRightIcon
                    w="7"
                    h="7"
                    color={offset + ITEMS_PER_PAGE >= totalParticipants ? 'brand.400' : 'mutedForeground'}
                    cursor={offset + ITEMS_PER_PAGE >= totalParticipants ? 'not-allowed' : 'pointer'}
                    mx="1"
                    onClick={offset + ITEMS_PER_PAGE >= totalParticipants ? () => {} : () => handlePageChange(page + 1)}
                  />
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Participants
