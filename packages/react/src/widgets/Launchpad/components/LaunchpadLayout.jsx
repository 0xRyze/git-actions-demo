import React from 'react'
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { updateSelectedWallet } from '../../../state/user/reducer'
import { useDispatch } from 'react-redux'
import { useRootContext } from '../../../context/RootContext'

const LaunchpadLayout = ({ isOpen, onClose, children }) => {
  const { rootRef } = useRootContext()

  const resetStepper = () => {
    onClose()
  }
  const { account, connector } = useWeb3React()
  const dispatch = useDispatch()
  const disconnectEvmWallet = () => {
    try {
      if (connector.deactivate) {
        connector.deactivate()
      } else {
        connector.resetState()
      }
      dispatch(updateSelectedWallet({ wallet: undefined }))
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      portalProps={{ containerRef: rootRef }}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent maxW="3xl" borderRadius={'12'}>
        <ModalHeader>
          {/* <Flex>
            <Flex
              userSelect="none"
              // size={'lg'}
              key={'lg'}
              borderRadius="lg"
              alignItems={'center'}
              border="1.5px solid"
              borderColor="input"
              cursor="pointer"
              p={1}
              paddingX={2}
            >
              <Flex alignItems={'center'}>
                <Box ml="1" mr="1.5">
                  <Image alt="" src={METAMASK_ICON_URL} w="4" h="4" />
                </Box>
                <Text color="gray.800" fontSize={'14'}>
                  {truncateAddress(account, 5)}
                </Text>
              </Flex>
              <CloseIcon cursor="pointer" color={'gray.800'} w={3} h={3} ml={2} onClick={disconnectEvmWallet} />
            </Flex>
          </Flex> */}
          <Tooltip label="Close">
            <ModalCloseButton onClick={resetStepper} />
          </Tooltip>
        </ModalHeader>
        <ModalBody>
          <Box mb={2}>{children}</Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LaunchpadLayout
