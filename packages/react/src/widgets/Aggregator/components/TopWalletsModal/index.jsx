import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { TopWalletTable } from './TopWalletTable'
import { getImageUrl } from '../../../../utils'
import { useRootContext } from '../../../../context/RootContext'
import { getTopWallets } from '../../../../state/stats/source'
import { useSelector } from 'react-redux'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

const TopWalletModal = ({ isOpen, onClose, profile, totalTopWallets, collectionId, chainId }) => {
  const { rootRef } = useRootContext()
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalData, setTotalData] = useState(0)
  const ITEMS_PER_PAGE = 5
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const accessKey = useSelector((state) => state.user.accessKey)

  const fetchTopWalletData = useCallback(async () => {
    try {
      if (!accessKey || !isOpen) return
      setLoading(true)
      const { data } = await getTopWallets(accessKey, offset, ITEMS_PER_PAGE, collectionId)
      setData(data)
      setTotalData(totalTopWallets)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [accessKey, isOpen, page])

  useEffect(() => {
    fetchTopWalletData()
  }, [fetchTopWalletData])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    setOffset((newPage - 1) * ITEMS_PER_PAGE)
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      portalProps={{ containerRef: rootRef }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Top Wallets</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          <Flex alignItems={'center'}>
            <Image
              src={
                profile?.profileImage &&
                getImageUrl(profile?.profileImage, {
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
            />
            <Text ml="2">{profile?.name}</Text>
          </Flex>

          <TopWalletTable
            loading={loading}
            data={data}
            totalTopWallets={totalTopWallets}
            collectionId={collectionId}
            chainId={chainId}
          />
          <Flex alignItems={'center'} mt="2" justifyContent={'space-between'}>
            <Box display={['initial']} />
            <Flex alignSelf={'flex-end'}>
              <ChevronLeftIcon
                w="7"
                h="7"
                color={page === 1 ? 'muted' : 'mutedForeground'}
                cursor={page === 1 ? 'not-allowed' : 'pointer'}
                mx="1"
                onClick={page === 1 ? () => {} : () => handlePageChange(page - 1)}
              />
              <ChevronRightIcon
                w="7"
                h="7"
                color={offset + ITEMS_PER_PAGE >= totalData ? 'muted' : 'mutedForeground'}
                cursor={offset + ITEMS_PER_PAGE >= totalData ? 'not-allowed' : 'pointer'}
                mx="1"
                onClick={offset + ITEMS_PER_PAGE >= totalData ? () => {} : () => handlePageChange(page + 1)}
              />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default TopWalletModal
