import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import SpaceSlider from './SpaceSlider'
import React from 'react'

interface Props {
  selectedDomain: any
  size: number
  setSize: any
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  loading: boolean
  subTotalPrice: any
}

const StorageSlider: React.FC<Props> = ({
  selectedDomain,
  size,
  setSize,
  onOpen,
  onClose,
  isOpen,
  loading,
  subTotalPrice,
}) => {
  const toast = useToast()
  return (
    <Flex mt="2" justifyContent={'space-between'}>
      <Flex alignItems={'center'}>
        <Text fontSize={'12'} mr="1">
          Storage Cost:
        </Text>

        <Text
          textDecoration={'underline'}
          fontSize={'12'}
          cursor={'pointer'}
          onClick={() => {
            if (!selectedDomain) {
              return toast({ title: 'Select Domain', status: 'warning' })
            }
            onOpen()
          }}
        >
          Edit
        </Text>
      </Flex>

      <Flex alignItems={'center'} justifyContent={'center'}>
        {loading ? (
          <Spinner size="xs" />
        ) : (
          <Text fontSize={'12'} fontWeight={'bold'}>
            +{`${(subTotalPrice / LAMPORTS_PER_SOL)?.toFixed(5)}`}
          </Text>
        )}
        <Text ml="1" fontSize={'12'} fontWeight={'bold'}>
          {`SOL`}
        </Text>
        <Text fontSize={'12'} mx="1">{`(${size} KB)`}</Text>
      </Flex>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit storage size</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text
              fontSize={'12'}
              py="2"
              px="4"
              borderColor={'mutedForeground'}
              borderWidth={'1px'}
              borderStyle={'solid'}
              borderRadius={'8'}
            >
              Storage size cannot be changed after initial registration.
            </Text>
            <SpaceSlider size={size} setSize={setSize} loading={loading} subTotalPrice={subTotalPrice} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default StorageSlider
