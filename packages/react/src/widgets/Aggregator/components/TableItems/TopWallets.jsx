import { useDisclosure } from '@chakra-ui/hooks'
import { Text } from '@chakra-ui/layout'
import React, { Suspense } from 'react'

const TopWalletModal = React.lazy(() => import('../TopWalletsModal'))

const TopWallets = ({ collectionId, totalTopWallets, profile, chainId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Text
        fontSize={['xs', 'sm']}
        fontWeight={600}
        cursor={'pointer'}
        onClick={() => {
          if (totalTopWallets > 0) onOpen()
        }}
        color="primary"
      >
        {totalTopWallets > 0 ? totalTopWallets : '-'}
      </Text>

      <Suspense fallback={null}>
        <TopWalletModal
          onClose={onClose}
          isOpen={isOpen}
          profile={profile}
          totalTopWallets={totalTopWallets}
          collectionId={collectionId}
          chainId={chainId}
        />
      </Suspense>
    </>
  )
}

export default TopWallets
