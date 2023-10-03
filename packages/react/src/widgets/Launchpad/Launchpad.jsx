import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import React, { Suspense } from 'react'
import FallbackView from '../Aggregator/components/FallbackView'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import { useRootContext } from '../../context/RootContext'

const CreatorStudio = React.lazy(() => import('./CreatorStudio'))

const LaunchpadView = (props) => {
  const clientConfig = useConsumerContext()
  const { rootRef } = useRootContext()

  const { accessKey, isOpen, onClose } = props

  // if (!account)
  //   return (
  //     <WalletLayout isOpen={isOpen} onClose={onClose}>
  //       {(() => {
  //         if (showWallets) {
  //           return <AllWallets onlyEvm={true} />
  //         } else {
  //           return <WelcomeScreen onClickConnectWallet={onClickConnectWallet} clientConfig={clientConfig} />
  //         }
  //       })()}
  //     </WalletLayout>
  //   )

  // return isEdit ? <EditCollection {...props} /> : <CreateCollection {...props} />

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        closeOnOverlayClick={false}
        blockScrollOnMount={false}
        portalProps={{ containerRef: rootRef }}
      >
        <DrawerOverlay />
        <DrawerContent h={['94vh']} borderTopLeftRadius={'12'} borderTopRightRadius={'12'}>
          <DrawerCloseButton
            bg="foreground"
            borderRadius={'50%'}
            top={'-35px'}
            color={'muted'}
            pos={'absolute'}
            right="10px"
            boxShadow="base"
          />
          <DrawerBody h="full">
            <Suspense fallback={<FallbackView />}>
              <CreatorStudio {...props} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default LaunchpadView
