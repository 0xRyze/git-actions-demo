import React from 'react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useRootContext } from '../../context/RootContext'
import LeaderBoardTable from './components/LeaderBoardTable'
import { useDispatch, useSelector } from 'react-redux'
import { updateSelectedSpaceId } from '../../state/collection/reducer'

export const Leaderboard = ({ isOpen = true }) => {
  const { rootRef } = useRootContext()
  const selectedSpaceId = useSelector((state) => state.collection.selectedSpaceId)

  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(updateSelectedSpaceId({ id: null }))
  }

  if (!selectedSpaceId) return null

  return (
    <Modal
      blockScrollOnMount={false}
      portalProps={{ containerRef: rootRef }}
      isOpen={!!selectedSpaceId}
      onClose={onClose}
      isCentered
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Leaderboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/*<LeaderBoardFilters />*/}
          <LeaderBoardTable selectedSpaceId={selectedSpaceId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
