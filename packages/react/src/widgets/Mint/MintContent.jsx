import React, { useEffect, useState } from 'react'
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Box, Flex } from '@chakra-ui/layout'
import { CloseIcon } from '@chakra-ui/icons'
import CollectionView from './CollectionView'
import MintView from './MintView'
import { useDispatch, useSelector } from 'react-redux'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import useCollection from './Widget/hooks/useCollection'
import { updateSelectedCollectionId, updateShowMint } from '../../state/collection/reducer'
import { changeQueryParams } from '../../utils'
import ConnectedWallet from './components/ConnectedWallet'
import Loader from '../../components/Loader'

const MintContent = (props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { selectedCollectionId, collectionViewOpen, showMint } = useSelector((state) => state.collection)
  const { accessKey } = useSelector((state) => state.user)

  const clientConfig = useConsumerContext()
  const collection = useCollection(selectedCollectionId, accessKey)

  const dispatch = useDispatch()

  useEffect(() => {
    if (showMint) {
      setSelectedTabIndex(1)
    }
  }, [showMint])

  if (collection.isLoading) {
    return (
      <Flex justifyContent={'center'} minH="40" alignItems={'center'}>
        <Loader />
      </Flex>
    )
  }

  const onClickTab = (index) => {
    if (index === 1) {
      changeQueryParams(
        window.location.search,
        window.location.pathname,
        selectedCollectionId,
        (url) => {
          window.history.pushState({}, '', url)
        },
        false,
        true,
        false,
      )
    } else {
      changeQueryParams(
        window.location.search,
        window.location.pathname,
        selectedCollectionId,
        (url) => {
          window.history.pushState({}, '', url)
        },
        false,
        false,
        false,
      )
    }

    setSelectedTabIndex(index)
  }

  const onClickClose = () => {
    dispatch(
      updateShowMint({
        showMint: false,
      }),
    )
    dispatch(
      updateSelectedCollectionId({
        id: null,
      }),
    )
    changeQueryParams(
      window.location.search,
      window.location.pathname,
      collection?.collectionState?.collectionId,
      (url) => {
        window.history.pushState({}, '', url)
      },
      false,
      false,
      true,
    )
  }

  return (
    <div>
      {/* <Providers clientConfig={clientConfig}> */}
      <Tabs size={'sm'} index={selectedTabIndex}>
        <Flex justify="space-between">
          <TabList alignSelf={['flex-start']}>
            <Tab onClick={() => onClickTab(0)}>Collection</Tab>
            <Tab
              onClick={() => onClickTab(1)}
              isDisabled={!collection?.collectionState?.mintEnabled || collection?.collectionState?.isExternalMint}
            >
              Mint
            </Tab>
          </TabList>

          <Flex flexDirection={['column-reverse', 'row']} alignItems={['center', 'flex-start']}>
            <Box mr={[0, 2]} mt={[2, 0]}>
              <ConnectedWallet />
            </Box>

            <Button variant="secondary" size={'sm'} alignSelf={['flex-end', 'flex-start']} onClick={onClickClose}>
              <CloseIcon width={3} height={3} mr={0} color={'mutedForeground'} />
            </Button>
          </Flex>
        </Flex>

        <TabPanels>
          <TabPanel>
            <CollectionView onClickTab={onClickTab} collection={collection} />
          </TabPanel>
          <TabPanel>
            <MintView
              {...props}
              accessKey={props.accessKey}
              collection={collection}
              collectionId={selectedCollectionId}
              clientConfig={clientConfig}
              onClickTab={onClickTab}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </Providers> */}
    </div>
  )
}

export default MintContent
