import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal'
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { scanTransaction } from '../../../../../state/confirmation/source'
import { WarningIcon } from '@chakra-ui/icons'
import Loader from '../../../../../components/Loader'
import { useSelector } from 'react-redux'
import { Interface } from '@ethersproject/abi'
import Blowfish from '../../../../../components/Svgs/blowfish'

const Message = ({ severity, message }) => {
  const isSever = severity === 'CRITICAL'
  return (
    <Flex
      alignItems={'flex-start'}
      p="2"
      borderWidth={'2px'}
      borderStyle={'dashed'}
      borderColor={isSever ? 'red.100' : 'orange.100'}
      w="full"
      borderRadius={'8'}
      my="1"
    >
      <Icon as={WarningIcon} color={isSever ? 'red.400' : 'orange.400'} w="3" h="3" mt="0.5" />
      <Box ml="1">
        <Text fontWeight={'semibold'} color={isSever ? 'red.400' : 'orange.400'} fontSize={'12'}>
          {severity}
        </Text>
        <Text mt="1" fontSize={'10'}>
          {message}
        </Text>
      </Box>
    </Flex>
  )
}

const MintConfirmation = ({ isOpen, onClose, onMint, getTransactionDetails }) => {
  const [loading, setLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [forceAllow, setForceAllow] = useState(false)
  const [scanned, setScanned] = useState({})

  const accessKey = useSelector((state) => state.user.accessKey)

  const scanTxs = useCallback(async (accessKey) => {
    try {
      if (!getTransactionDetails) return
      const { priceInWei, args, account, contractAddress, chainId, abiFunction, abi, _mintFunction } =
        await getTransactionDetails()

      const abiInterface = new Interface(abi)
      const data = abiInterface.encodeFunctionData(_mintFunction, [...args])
      const params = {
        from: account,
        to: contractAddress,
        data: data,
        value: priceInWei,
        origin: window.origin,
        // origin: 'https://opensea.phi',
        walletAddress: account,
        chain: chainId,
        // chain: 1,
      }
      const res = await scanTransaction(accessKey, params)
      setScanned(res)
      setIsBlocked(res?.action === 'BLOCK')
      //   console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (accessKey) {
      scanTxs(accessKey)
    }
  }, [scanTxs, accessKey])

  const closed = () => {
    setIsBlocked(false)
    setForceAllow(false)
    onClose()
  }

  const onConfirm = () => {
    closed()
    onMint()
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={closed}
      isCentered
      size={'xs'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        {loading ? (
          <Flex pos={'relative'} flexDir={'column'} w="full" h="60" alignItems={'center'} justifyContent={'center'}>
            <Loader />
          </Flex>
        ) : (
          <>
            {/*<ModalHeader pt={1} pb={1}>*/}
            {/*  <ModalCloseButton size={'sm'} onClick={closed} />*/}
            {/*</ModalHeader>*/}
            <ModalBody pos={'relative'}>
              <ModalCloseButton top={0} right={'5px'} size={'sm'} onClick={closed} />

              <Flex pos={'relative'} flexDir={'column'} w="full" h="full" mt={2}>
                {isBlocked && !forceAllow && (
                  <Flex
                    flexDir={'column'}
                    h="20"
                    w="full"
                    alignItems={'flex-start'}
                    justifyContent={'center'}
                    p="2"
                    borderRadius={'8'}
                    mt="1"
                    borderWidth={'2px'}
                    borderStyle={'dashed'}
                    borderColor={'red.100'}
                  >
                    <Flex>
                      <Icon as={WarningIcon} color={'red.400'} w="3" h="3" mt="0.5" />
                      <Box ml="2">
                        <Text color="red.400" fontWeight={'semibold'} fontSize={'12'}>
                          TRANSACTION FLAGGED
                        </Text>
                        <Text mt="1" color="red.300" fontSize={'10'}>
                          We believe this transaction is malicious and unsafe to approve. Approving may lead to loss of
                          funds
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                )}

                {scanned?.action === 'NONE' && (
                  <Flex
                    flexDir={'column'}
                    h="20"
                    w="full"
                    alignItems={'center'}
                    justifyContent={'center'}
                    p="2"
                    borderRadius={'8'}
                    mt="4"
                    borderWidth={'2px'}
                    borderStyle={'dashed'}
                    borderColor={'green.100'}
                  >
                    <Flex alignItems={'flex-start'}>
                      <Icon as={WarningIcon} color={'green.400'} w="3" h="3" mt="0.5" />
                      <Box ml="2">
                        <Text fontWeight={'semibold'} color={'green.400'} fontSize={'12'}>
                          No Issues Found
                        </Text>
                        <Text mt="1" fontSize={'10'}>
                          We believe this transaction is legitimate and safe to approve.
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                )}
                {(!isBlocked || forceAllow) && (
                  <Flex flexDir={'column'}>
                    {scanned?.warnings &&
                      scanned?.warnings?.map((warning, index) => (
                        <Message key={index} severity={warning?.severity} message={warning?.message} />
                      ))}
                  </Flex>
                )}
              </Flex>
            </ModalBody>
            {!loading && (
              <ModalFooter w="full" justifyContent={'space-between'} pt="2" pb={2}>
                <Flex h="full">
                  <Blowfish w="24" h="4" />
                </Flex>
                {/* <Button size={'sm'} variant={'outline'} mr={3} onClick={closed}>
                  Cancel
                </Button> */}
                {(!isBlocked || forceAllow) && (
                  <Button size={'xs'} variant="primary" onClick={onConfirm}>
                    Confirm
                  </Button>
                )}
                {isBlocked && !forceAllow && (
                  <Button size={'xs'} variant="primary" onClick={() => setForceAllow(true)}>
                    Proceed Anyway
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default MintConfirmation
