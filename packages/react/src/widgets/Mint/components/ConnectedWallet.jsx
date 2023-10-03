import React from 'react'
import { Button } from '@chakra-ui/react'
import { truncateAddress } from '../../../utils'
import useWalletContext from '../../../components/WalletModal/hooks/useWalletContext'
import ThreeDotIcon from '../../../components/Svgs/ThreeDotIcon'
import { useDisclosure } from '@chakra-ui/hooks'
import ProfileModal from '../../../components/ProfileModal'

const ConnectedWallet = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { primaryAddress, disconnect, selectedWallet } = useWalletContext()

  if (!primaryAddress) return null
  return (
    <>
      <Button onClick={onOpen} variant="outline" size={'sm'} rightIcon={<ThreeDotIcon />}>
        {truncateAddress(primaryAddress, 5)}
      </Button>

      <ProfileModal
        isOpen={isOpen}
        onClose={onClose}
        disconnectWallet={disconnect}
        walletAddress={primaryAddress}
        selectedWallet={selectedWallet}
      />
    </>
  )
}

export default ConnectedWallet
