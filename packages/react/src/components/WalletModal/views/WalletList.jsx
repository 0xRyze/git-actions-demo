import React, { useCallback } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { normalizeWalletName } from '../utils/normaliseWalletName'
import useWallets from '../hooks/useWallets'
import { isMobile } from '@stacks/connect'
import { VIEW } from '../WalletModalView'
import useWalletContext from '../hooks/useWalletContext'
import { useSelector } from 'react-redux'
import { environment } from '../../../context/BanditContext'

const WalletList = ({ setModalView, uri, connectWallet, walletConnectConnector }) => {
  const { setSelectedWallet, filterChains } = useWalletContext()
  const { wallets } = useWallets(filterChains)

  const accessKey = useSelector((state) => state.user.accessKey)

  const handleWalletClick = useCallback(
    async (wallet) => {
      try {
        setSelectedWallet(wallet)
        localStorage.setItem('LAST_USED_WALLET', normalizeWalletName(wallet.name))
        setModalView(VIEW.PENDING)
        if (isMobile()) {
          if (normalizeWalletName(wallet.name) === 'walletconnect') {
            await wallet.mobileConnector.activate()
          } else if (!wallet.isInstalled) {
            wallet.handleMobile(uri, wallet.mobile)
          } else {
            connectWallet(wallet)
          }
        } else if (!wallet.isInstalled) {
          if (normalizeWalletName(wallet.name) === 'walletconnect' || wallet.isWalletConnect) {
            wallet.connector.activate()
            setModalView(VIEW.QR_CODE)
          } else {
            setModalView(VIEW.NOT_INSTALLED)
          }
        } else {
          connectWallet(wallet)
        }
      } catch (e) {
        setModalView(VIEW.WALLET_LIST)
        console.log(e)
      }
    },
    [setSelectedWallet, setModalView, VIEW, connectWallet, uri],
  )

  const isHahaAccessKey = accessKey === '4fd9f92bf7d54611abf7201b5510e9bf'
  const isBanditAccessKey = accessKey === '73d8ed4eeddc43d8b96e0b08afb675ac'

  const isHaha = environment === 'production' ? isHahaAccessKey || isBanditAccessKey : true

  return (
    <Box>
      <Text fontSize={18} mb={4}>
        Connect your wallet
      </Text>
      {wallets
        .filter((wallet) => (isHaha ? true : normalizeWalletName(wallet.name) !== 'haha'))
        .reduce((wallets, wallet) => {
          if (isHahaAccessKey) {
            wallets.unshift(wallet)
          } else {
            wallets.push(wallet)
          }

          return wallets
        }, [])
        .filter((wallet) => wallet.chains)
        .map((wallet) => (
          <Flex key={wallet.name} align="center" mb={4} cursor={'pointer'} onClick={() => handleWalletClick(wallet)}>
            <Image
              src={`https://bandit.network/svgs/wallets.svg#${normalizeWalletName(wallet.brand.spriteId)}`}
              width={8}
              height={8}
            />
            <Text ml={2}>{wallet.name}</Text>
          </Flex>
        ))}
    </Box>
  )
}

export default WalletList
