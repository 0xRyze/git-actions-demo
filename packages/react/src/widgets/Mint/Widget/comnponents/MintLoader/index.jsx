import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import Recommendations from '../Recommendations'
import LoadingStepper from './LoadingStepper'
import Survey from '../Survey'
import SingleTransaction from './SingleTransaction'

const MintLoader = ({ list, isOpen, onClose, resetStatus, tag }) => {
  const [showSurvey, setShowSurvey] = useState(false)
  const [isLastSuccess, setLastSuccess] = useState(false)
  const [isLastError, setLastError] = useState(false)
  const [isLastIgnore, setLastIgnore] = useState(false)
  const [isAnyPending, setAnyPending] = useState(false)
  const _list = list.filter((l) => l.enable)
  const singleItem = _list.length === 1

  const closeModal = () => {
    // setShowSurvey(false)
    // setLastSuccess(false)
    // setLastError(false)
    // setLastIgnore(false)
    onClose()
    resetStatus()
  }

  useEffect(() => {
    const _isAnyPending = _list?.some((tx) => tx?.completed === 'pending')
    const _isLastSuccess = _list[_list?.length - 1].completed === 'completed'
    const _isLastError = _list[_list?.length - 1].completed === 'error'
    const _isLastIgnore = _list[_list?.length - 1].completed === 'ignore'

    setAnyPending(_isAnyPending)
    setLastSuccess(_isLastSuccess)
    setLastError(_isLastError)
    setLastIgnore(_isLastIgnore)
  }, [_list])

  useEffect(() => {
    let _cleatTimeout

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
    let _cleatTimeout

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
            {singleItem ? <SingleTransaction transaction={_list[0]} /> : <LoadingStepper list={_list} />}
          </Box>
          <Recommendations tag={tag} />
          {showSurvey && <Survey closeSurvey={closeSurvey} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MintLoader
