import { Box, Modal, ModalFooter, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import { useRootContext } from '../../context/RootContext'
import { ModalBody, ModalContent } from '@chakra-ui/modal'
import PoweredBy from '../Aggregator/components/PoweredBy'
import MintContent from './MintContent'
import Providers from './Providers'

export const Mint = (props) => {
  const { selectedCollectionId } = useSelector((state) => state.collection)
  const { accessKey } = useSelector((state) => state.user)
  const clientConfig = useConsumerContext()

  const { rootRef } = useRootContext()

  if (!selectedCollectionId || !accessKey) {
    return null
  }

  return (
    <Modal
      size={'2xl'}
      isOpen={true}
      className="aggregator-mint"
      onClose={() => {}}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      portalProps={{ containerRef: rootRef }}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent borderRadius={'12'}>
        <ModalBody paddingX={4} pt={4} pb={2} borderRadius="xl" overflow="hidden">
          <Providers clientConfig={clientConfig}>
            <MintContent {...props} />
          </Providers>
          <ModalFooter p={0} pt={2} mt={2} justifyContent="center">
            <Box>
              <PoweredBy />
            </Box>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
