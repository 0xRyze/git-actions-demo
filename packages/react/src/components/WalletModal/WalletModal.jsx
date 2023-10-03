import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import WalletModalView from './WalletModalView'
import useWalletContext from './hooks/useWalletContext'
import { useRootContext } from '../../context/RootContext'

export const WalletModal = ({ onClose, ...rest }) => {
  const { showWallets, setShowWallets, handleClose } = useWalletContext()
  const { rootRef } = useRootContext()
  if (!showWallets) return null
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={showWallets}
      onClose={handleClose}
      isCentered
      size="xs"
      portalProps={{ containerRef: rootRef }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <WalletModalView {...rest} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
