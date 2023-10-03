import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import DurationSlider from './DurationSlider'
import React from 'react'

interface Props {
  selectedDomain: any
  duration: number
  selectDuration: any
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  loading: boolean
  subTotalPrice: any
  payUsing: any
}

const DurationSelection: React.FC<Props> = ({
  selectedDomain,
  duration,
  selectDuration,
  onOpen,
  onClose,
  isOpen,
  loading,
  subTotalPrice,
  payUsing,
}) => {
  const toast = useToast()
  return (
    <Flex justifyContent={'space-between'}>
      <Flex alignItems={'center'}>
        <Text fontSize={'12'} mr="1">
          Duration:
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

      <Text fontSize={'12'} mr="1">{`${duration} Year`}</Text>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registration duration</ModalHeader>
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
              Extending for multiple years will save money on network costs by avoiding yearly transactions.
            </Text>
            <DurationSlider
              duration={duration}
              setDuration={selectDuration}
              loading={loading}
              subTotalPrice={subTotalPrice}
              payUsing={payUsing}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default DurationSelection
