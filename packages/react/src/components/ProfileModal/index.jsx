import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/modal'
import { Button, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useToast } from '@chakra-ui/react'
import React from 'react'
import Discord from '../Svgs/discord'
import { truncateAddress } from '../../utils'
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons'
import useUser from '../../widgets/Mint/Widget/hooks/useUser'
import { disconnectDiscord, disconnectTwitter, getDiscordOAuthUrl, getTwitterOAuthUrl } from '../../state/user/source'
import useSignature from '../../hooks/useSignature'
import { useDispatch, useSelector } from 'react-redux'
import useWalletContext from '../WalletModal/hooks/useWalletContext'
import { normalizeWalletName } from '../WalletModal/utils/normaliseWalletName'
import { updateUserDetails } from '../../state/user/reducer'
import { useRootContext } from '../../context/RootContext'

const ProfileModal = ({ isOpen, onClose, walletAddress, disconnectWallet }) => {
  const toast = useToast()
  const dispatch = useDispatch()

  const { accessKey } = useSelector((state) => state.user)
  const { selectedWallet, disconnect } = useWalletContext()
  const { rootRef } = useRootContext()

  const { user, refreshUser } = useUser()

  const [signature, getSignature] = useSignature()

  const { socialmedia } = user

  const onClickDisconnect = () => {
    dispatch(updateUserDetails({}))
    disconnectWallet()
    onClose()
  }

  const disconnectSocial = async (social) => {
    try {
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      const _account = walletAddress
      if (social === 'twitter') {
        const res = await disconnectTwitter(_signature, _account, accessKey)
      } else {
        const res = await disconnectDiscord(_signature, _account, accessKey)
      }
      refreshUser()
    } catch (error) {
      console.log(error)
    }
  }

  const connectSocial = async (social) => {
    try {
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      const _account = walletAddress
      if (social === 'twitter') {
        await getTwitterOAuthUrl(_signature, _account, accessKey)
      } else {
        await getDiscordOAuthUrl(_signature, _account, accessKey)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        toast({ title: `Copied to clipboard: ${truncateAddress(walletAddress, 5)}`, duration: 3000 })
      })
      .catch((err) => {
        console.error(`Error copying to clipboard: ${err}`)
      })
  }
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      portalProps={{ containerRef: rootRef }}
    >
      <ModalOverlay />
      <ModalContent w="300px" h="240px">
        <ModalBody paddingX={4}>
          <Flex justify="end" mb={1}>
            <Button variant="secondary" size={'xs'} onClick={onClose}>
              <CloseIcon width={2} height={2} mr={0} color={'mutedForeground'} />
            </Button>
          </Flex>
          <Tabs size={'sm'}>
            <TabList as="flex" justifyContent={'center'}>
              <Tab flex={1}>Wallets</Tab>
              <Tab flex={1}>Profile</Tab>
            </TabList>
            <TabPanels mt="6">
              <TabPanel>
                <Flex flexDir={'column'} alignItems={'center'}>
                  <Image
                    alt=""
                    src={`https://bandit.network/svgs/wallets.svg#${normalizeWalletName(
                      selectedWallet?.brand?.spriteId,
                    )}`}
                    w="12"
                    h="12"
                    p="2"
                    bg={'muted'}
                    borderRadius={'6'}
                  />
                  <Tooltip label="Click to Copy">
                    <Text mt="2" cursor={'pointer'} onClick={copyToClipboard}>
                      {truncateAddress(walletAddress, 5)}
                    </Text>
                  </Tooltip>
                  <Text></Text>
                  <Button variant="ghost" pos={'absolute'} bottom={'4'} onClick={onClickDisconnect}>
                    Disconnect
                  </Button>
                </Flex>
              </TabPanel>
              <TabPanel p="0">
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontSize={'14'}>Social Accounts</Text>
                  <RepeatIcon onClick={refreshUser} w={4} h={4} cursor="pointer" color="mutedForeground" />
                </Flex>
                {/* {socialmedia?.twitter ? (
                  <Flex
                    p="2"
                    border={`1.5px solid ${colors.gray[300]}`}
                    borderRadius={'6'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Twitter width="18" height="18" />
                    <Text fontSize={'12'} fontWeight={500} mr="auto" ml={2}>
                      {socialmedia?.twitter}
                    </Text>
                    <CloseIcon
                      ml="2"
                      mr="2"
                      w="2.5"
                      h="2.5"
                      cursor="pointer"
                      onClick={() => disconnectSocials('twitter')}
                    />
                  </Flex>
                ) : (
                  <Flex
                    w="full"
                    px="2"
                    py="1"
                    border={`1.5px solid ${colors.gray[300]}`}
                    borderRadius={'6'}
                    alignItems={'center'}
                  >
                    <Twitter width="18" height="18" />
                    <Text fontSize={'12'} ml={2}>
                      Connect Twitter
                    </Text>
                    <Text
                      fontSize={'12'}
                      ml="auto"
                      _hover={{
                        backgroundColor: colors.gray[300],
                      }}
                      borderRadius={'4'}
                      py="0.1"
                      px="2"
                      cursor={'pointer'}
                      onClick={() => connectSocial('twitter')}
                    >{`+ Connect`}</Text>
                  </Flex>
                )} */}
                {socialmedia?.discord ? (
                  <Flex
                    p="2"
                    border={`1.5px solid`}
                    borderColor={'muted'}
                    borderRadius={'6'}
                    mt="2"
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Discord width="18" height="18" />
                    <Text fontSize={'12'} fontWeight={500} ml={2}>
                      {socialmedia?.discord}
                    </Text>
                    <CloseIcon
                      ml="2"
                      mr="2"
                      w="2.5"
                      h="2.5"
                      cursor="pointer"
                      onClick={() => disconnectSocial('discord')}
                    />
                  </Flex>
                ) : (
                  <Flex
                    w="full"
                    px="2"
                    py="1"
                    border={`1.5px solid`}
                    borderColor={'muted'}
                    borderRadius={'6'}
                    alignItems={'center'}
                    mt="2"
                  >
                    <Discord width="18" height="18" />
                    <Text fontSize={'12'} ml={2}>
                      Connect Discord
                    </Text>
                    <Text
                      fontSize={'12'}
                      ml="auto"
                      _hover={{
                        backgroundColor: 'muted',
                      }}
                      borderRadius={'4'}
                      py="0.1"
                      px="2"
                      cursor={'pointer'}
                      onClick={() => connectSocial('discord')}
                    >{`+ Connect`}</Text>
                  </Flex>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProfileModal
