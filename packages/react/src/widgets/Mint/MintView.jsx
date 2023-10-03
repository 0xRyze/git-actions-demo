import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSelectedCollectionId, updateShowMint } from '../../state/collection/reducer'
import { changeQueryParams } from '../../utils'
import { Box } from '@chakra-ui/react'
import Widget from './Widget'
import useUser from './Widget/hooks/useUser'
import useWalletContext from '../../components/WalletModal/hooks/useWalletContext'
import Sage from './Widget/comnponents/Sage'
import { SAGE_CANDY_MACHINE_ID } from './Widget/comnponents/Sage/data'
import Domains from './Partners/Domains'

const MintView = ({ collectionId, accessKey, collection, clientConfig, onClickTab }) => {
  const { collectionState, isLoading } = collection
  const { collectionViewOpen } = useSelector((state) => state.collection)

  const { primaryAddress, selectedWallet, disconnect } = useWalletContext()

  const { fetchUser } = useUser()

  useEffect(() => {
    if (primaryAddress) {
      fetchUser()
    }
  }, [primaryAddress])

  useEffect(() => {
    const isMintView = window?.location.hash === '#mint'
    if (!collectionState?.mintEnabled && isMintView) {
      onClickTab(0)
    }
  }, [collectionState])

  const dispatch = useDispatch()

  const onClickClose = () => {
    dispatch(
      updateSelectedCollectionId({
        id: null,
      }),
    )
    dispatch(
      updateShowMint({
        showMint: false,
      }),
    )
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

  const getContent = () => {
    if (collectionState.isDomain) {
      return (
        <Domains
          onClickClose={onClickClose}
          accessKey={accessKey}
          collectionState={collectionState}
          disconnectWallet={disconnect}
        />
      )
    }

    if (
      collectionState?.contract?.candyMachineId === SAGE_CANDY_MACHINE_ID // TODO: change
    ) {
      return (
        <Sage
          onClickClose={onClickClose}
          collectionState={collectionState}
          // cm={cm}
          isCollectionFetching={isLoading}
          clientConfig={clientConfig}
        />
      )
    }

    return (
      <Widget
        onClickClose={onClickClose}
        collectionState={collectionState}
        // cm={cm}
        isCollectionFetching={isLoading}
        clientConfig={clientConfig}
      />
    )
  }

  return (
    <>
      <Box bg="background" height="100%" width="100%" flex="1">
        {getContent()}
      </Box>
    </>
  )
}

export default MintView
