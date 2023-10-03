import React from 'react'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Tooltip } from '@chakra-ui/react'

const WalletLayout = ({ isOpen, onClose, children }) => {
  const resetStepper = () => {
    onClose()
  }
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent maxW="lg" borderRadius={'12'}>
        {/*<ModalHeader>Launch your collection!</ModalHeader>*/}
        <Tooltip label="Close">
          <ModalCloseButton onClick={resetStepper} />
        </Tooltip>
        <ModalBody>
          <Box p={2}>{children}</Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WalletLayout
