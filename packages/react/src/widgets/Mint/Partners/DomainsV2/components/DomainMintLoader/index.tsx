import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import LoadingStepper from './LoadingStepper'
import SingleTransaction from './SingleTransaction'
import Recommendations from '../../../../Widget/comnponents/Recommendations'
import Survey from '../../../../Widget/comnponents/Survey'
import PendingMessage from './PendingMessage'

interface Props {
  tags: string[]
  list: any[]
  isOpen: boolean
  onClose: () => void
  resetStatus: () => void
  address?: string
  pendingMessage?: React.ReactNode
  website?: string
  celebrate?: () => void
  showOffers: boolean
}

const DomainMintLoader: React.FC<Props> = ({
  tags,
  list,
  isOpen,
  onClose,
  resetStatus,
  address,
  pendingMessage,
  showOffers,
  celebrate,
  website,
}) => {
  const [showSurvey, setShowSurvey] = useState(false)
  const [isLastSuccess, setLastSuccess] = useState(false)
  const [isLastError, setLastError] = useState(false)
  const [isLastIgnore, setLastIgnore] = useState(false)
  const [isAnyPending, setAnyPending] = useState(false)
  const _list = list.filter((l) => l.enable)
  const singleItem = _list.length === 1

  const closeModal = () => {
    onClose()
    resetStatus()
  }

  useEffect(() => {
    const _isAnyPending = _list?.some((tx: any) => tx?.completed === 'pending')
    const _isLastSuccess = _list[_list?.length - 1].completed === 'completed'
    const _isLastError = _list[_list?.length - 1].completed === 'error'
    const _isLastIgnore = _list[_list?.length - 1].completed === 'ignore'

    setAnyPending(_isAnyPending)
    setLastSuccess(_isLastSuccess)
    setLastError(_isLastError)
    setLastIgnore(_isLastIgnore)
  }, [_list])

  useEffect(() => {
    let _cleatTimeout: any

    if (isLastError) {
      _cleatTimeout = setTimeout(() => {
        setShowSurvey(true)
      }, 2000)
    }

    return () => {
      if (_cleatTimeout && isLastError) clearTimeout(_cleatTimeout)
    }
  }, [isLastError])

  useEffect(() => {
    let _cleatTimeout: any

    if (isLastSuccess) {
      _cleatTimeout = setTimeout(() => {
        setShowSurvey(true)
      }, 2000)
    }

    return () => {
      if (_cleatTimeout && isLastSuccess) clearTimeout(_cleatTimeout)
    }
  }, [isLastSuccess])

  useEffect(() => {
    if (isLastIgnore) {
      closeModal()
    }
  }, [isLastIgnore])

  const closeSurvey = () => {
    setShowSurvey(false)
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={closeModal}
      isCentered
      size={'xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent overflow="hidden">
        {/* <ModalHeader> */}
        {!isAnyPending && <ModalCloseButton zIndex={1} />}
        {/* </ModalHeader> */}
        <ModalBody position="relative" overflow="hidden" borderRadius="lg" p="4">
          <Box my={'8'}>
            {singleItem ? (
              <SingleTransaction
                transaction={_list[0]}
                postTransaction={{
                  showOffers,
                  celebrate,
                  website,
                  address,
                }}
              />
            ) : (
              <LoadingStepper list={_list} />
            )}
          </Box>
          {pendingMessage && isAnyPending && <PendingMessage>{pendingMessage}</PendingMessage>}
          <Recommendations tags={tags} />
          {showSurvey && <Survey closeSurvey={closeSurvey} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DomainMintLoader
