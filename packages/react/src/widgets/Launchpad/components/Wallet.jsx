import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProfileModal from '../../../components/ProfileModal'
import ThreeDotIcon from '../../../components/Svgs/ThreeDotIcon'
import useStacks from '../../../components/WalletModal/hooks/useStacks'
import { SELECTABLE_WALLETS } from '../../../hooks/useOrderedConnections'
import { updateShowMint } from '../../../state/collection/reducer'
import { updateSelectedWallet } from '../../../state/user/reducer'
import { getDiscordOAuthUrl, getTwitterOAuthUrl, getUser } from '../../../state/user/source'
import { changeQueryParams, truncateAddress } from '../../../utils'
import useSignature from '../../../hooks/useSignature'
import useWalletContext from '../../../components/WalletModal/hooks/useWalletContext'
import { normalizeWalletName } from '../../../components/WalletModal/utils/normaliseWalletName'

const Wallet = (props) => {
  const { accessKey, onClose } = props
  const { account, connector } = useWeb3React()
  const [signature, getSignature] = useSignature()
  //   const [isOpen, setIsOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { collectionViewOpen } = useSelector((state) => state.collection)
  const { publicKey: solanaAccount } = useWallet()
  const [twitterUsername, setTwitterUsername] = useState('')
  const [discordUsername, setDiscordUsername] = useState('')
  const { primaryAddress, disconnect, selectedWallet } = useWalletContext()

  const solanaAccountStr = !!solanaAccount ? solanaAccount.toBase58() : ''

  useEffect(() => {
    if (account || solanaAccount) {
      onClose()
    }
  }, [account, solanaAccount])

  const getUserData = useCallback(async () => {
    if (account || solanaAccount) {
      const _account = account || solanaAccount
      try {
        const data = await getUser(_account, accessKey)
        // console.log(data)
        setTwitterUsername(data.socialmedia.twitter)
        setDiscordUsername(data.socialmedia.discord)
      } catch (error) {
        console.log(error)
      }
    }
  }, [account, solanaAccount])

  useEffect(() => {
    getUserData()
  }, [getUserData])

  const dispatch = useDispatch()

  const { stacksAddress } = useStacks()

  const onClickClose = () => {
    dispatch(
      updateShowMint({
        showMint: false,
      }),
    )
    if (collectionViewOpen) {
      changeQueryParams(
        window.location.search,
        window.location.pathname,
        collectionState?.collectionId,
        (url) => {
          window.history.pushState({}, '', url)
        },
        true,
        false,
        false,
      )
    } else {
      changeQueryParams(
        window.location.search,
        window.location.pathname,
        collectionState?.collectionId,
        (url) => {
          window.history.pushState({}, '', url)
        },
        false,
        false,
        true,
      )
    }
  }

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

  const handleProfileModalClose = () => {
    setShowProfileModal(false)
  }

  const handleProfileModalOpen = () => {
    setShowProfileModal(true)
  }

  const getAddress = () => {
    if (selectedWallet === 'stacks') {
      return stacksAddress
    } else if (selectedWallet === 'Phantom') {
      return solanaAccount.toBase58()
    } else if (SELECTABLE_WALLETS.includes(selectedWallet)) {
      return account
    } else {
      return null
    }
  }

  const disconnectSocial = async (social) => {
    try {
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      const _account = getAddress()
      if (social === 'twitter') {
        const res = await disconnectTwitter(_signature, _account, accessKey)
      } else {
        const res = await disconnectDiscord(_signature, _account, accessKey)
      }
      await getUserData()
    } catch (error) {
      console.log(error)
    }
  }

  const connectSocial = async (social) => {
    try {
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      const _account = getAddress()
      if (social === 'twitter') {
        await getTwitterOAuthUrl(_signature, _account, accessKey)
      } else {
        await getDiscordOAuthUrl(_signature, _account, accessKey)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {(selectedWallet === 'stacks' ? stacksAddress : selectedWallet === 'Phantom' ? solanaAccountStr : account) && (
        <HStack justify="flex-start">
          <Flex
            userSelect="none"
            size={'lg'}
            key={'lg'}
            borderRadius="lg"
            alignItems={'center'}
            border="1.5px solid"
            borderColor="input"
            cursor="pointer"
            p={1}
            onClick={handleProfileModalOpen}
          >
            <Flex alignItems={'center'}>
              <Box ml="1" mr="1.5">
                {/* <User width="16" height="16" /> */}
                <Image
                  alt=""
                  src={`https://bandit.network/svgs/wallets.svg#${normalizeWalletName(selectedWallet?.name)}`}
                  w="4"
                  h="4"
                />
              </Box>
              <Text color="gray.800" fontSize={'14'}>
                {selectedWallet === 'stacks'
                  ? truncateAddress(stacksAddress, 5)
                  : selectedWallet === 'Phantom'
                  ? truncateAddress(solanaAccountStr, 5)
                  : truncateAddress(account, 5)}
              </Text>
            </Flex>
            <ThreeDotIcon cursor="pointer" />
          </Flex>
        </HStack>
      )}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        data={{ twitter: twitterUsername, discord: discordUsername }}
        disconnectSocials={disconnectSocial}
        disconnectWallet={disconnect}
        walletAddress={
          selectedWallet === 'stacks' ? stacksAddress : selectedWallet === 'Phantom' ? solanaAccountStr : account
        }
        connectSocial={connectSocial}
      />
    </>
  )
}

export default Wallet
