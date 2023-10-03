import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/layout'
import WalletList from './views/WalletList'
import Pending from './views/Pending'
import NotInstalled from './views/NotInstalled'
import { ArrowBackIcon } from '@chakra-ui/icons'
import QRCode from './views/QrCode'
import { useWalletConnectUri } from './hooks/useWalletConnectUri'
import { useWallet } from '@solana/wallet-adapter-react'
import useWalletContext from './hooks/useWalletContext'
import { useDispatch } from 'react-redux'
import { updateSelectedWallet } from '../../state/user/reducer'

export const VIEW = {
  WALLET_LIST: 'wallet_list',
  PENDING: 'pending',
  NOT_INSTALLED: 'not_installed',
  QR_CODE: 'qr_code',
}

const WalletModalView = () => {
  const [modalView, setModalView] = useState(VIEW.WALLET_LIST)

  const { selectedWallet, setSelectedWallet } = useWalletContext()
  const { uri = 'h', walletConnectConnector } = useWalletConnectUri()

  const walletAdapter = useWallet()
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedWallet?.chains?.includes('SOL') && walletAdapter.wallet && !walletAdapter.connected) {
      walletAdapter.connect().catch((e) => {
        console.log(e)
        setModalView(VIEW.WALLET_LIST)
      })
    }
  }, [walletAdapter, walletAdapter.wallet, selectedWallet])

  const connectWallet = useCallback(
    async (wallet) => {
      try {
        if (wallet.chains.includes('EVM')) {
          await wallet.connector.activate()
          dispatch(updateSelectedWallet({ wallet: wallet.name }))
        } else if (wallet.chains.includes('SOL')) {
          if (!walletAdapter.connected) {
            walletAdapter.select(wallet.connector.name)
          }
          dispatch(updateSelectedWallet({ wallet: 'Phantom' }))
        } else if (wallet.chains.includes('STACKS')) {
          wallet.connector.activate(
            (authData) => {
              dispatch(updateSelectedWallet({ wallet: 'stacks' }))
            },
            () => {
              setModalView(VIEW.WALLET_LIST)
            },
          )
        }
      } catch (e) {
        setModalView(VIEW.WALLET_LIST)
      }
    },
    [walletAdapter],
  )

  const goBack = useCallback(() => {
    setModalView(VIEW.WALLET_LIST)
    walletAdapter.select(null)
  }, [setModalView, VIEW])

  const getModalContent = () => {
    if (modalView === VIEW.WALLET_LIST) {
      return (
        <WalletList
          uri={uri}
          setModalView={setModalView}
          connectWallet={connectWallet}
          walletConnectConnector={walletConnectConnector}
        />
      )
    }

    if (modalView === VIEW.PENDING) {
      return <Pending goBack={goBack} />
    }

    if (modalView === VIEW.QR_CODE) {
      return <QRCode uri={uri} goBack={goBack} selectedWallet={selectedWallet} />
    }
    if (modalView === VIEW.NOT_INSTALLED) {
      return <NotInstalled goBack={goBack} />
    }
  }
  return (
    <Box>
      {modalView !== VIEW.WALLET_LIST && <ArrowBackIcon onClick={goBack} boxSize={'24px'} cursor="pointer" />}
      <Box mt={2}>{getModalContent()}</Box>
    </Box>
  )
}

export default WalletModalView
