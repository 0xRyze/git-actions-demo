import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { getCollectionById } from '../../../state/collection/source'
import { getAllCollectionByAddress } from '../../../state/stats/source'
import { useCreateContext } from '../hooks/useCreateContext'
import WelcomeScreen from '../../Mint/WelcomeScreen'
import CollectionCard, { CollectionCardSkeleton } from './CollectionCard'
import Pagination from '../../Aggregator/components/Pagination'
import { isWhitelistedForLaunchpad } from '../../../state/launchpad/source'
import CreatorStudioHeader from '../CreatorStudioHeader'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserSpaces } from '../../../state/launchpad/source'
import SpaceCard from './SpaceCard'
import FundModal from './FundModal'
import useRelayer from '../../../hooks/useRelayer'
import { switchChain } from '../../../utils/switchChain'
import { CHAIN_INFO } from '../../../constants/chains'
import { useSelector } from 'react-redux'
import { HamburgerIcon } from '@chakra-ui/icons'
import useWalletContext from '../../../components/WalletModal/hooks/useWalletContext'

const EditCollection = React.lazy(() => import('../EditCollection'))

const ITEMS_PER_PAGE = 12

const Dashboard = (props) => {
  // const [showWallets, setShowWallets] = useState(false)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setDataIsLoading] = useState(false)
  const {
    setCollectionId,
    collectionId,
    setCreateState,
    setModules,
    setIsEditingCollection,
    setShareSpaceDetails,
    supportedChains,
  } = useCreateContext()
  const { accessKey, onOpen, changeActionType, clientConfig, createProps } = props
  const [collections, setCollections] = useState([])
  const [spaces, setSpaces] = useState([])
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [total, setTotal] = useState(0)
  const [isWhitelisted, setIsWhitelisted] = useState(false)

  const { account, chainId: connectedChainId, connector } = useWeb3React()
  const { publicKey: solanaAccount } = useWallet()
  const [selectedChainId, setSelectedChainId] = useState(0)

  const { isOpen: isFundOpen, onOpen: onFundOpen, onClose: onFundClose } = useDisclosure()
  const [isFund, setIsFund] = useState(false)

  const { setShowWallets, setFilterChains } = useWalletContext()

  const { getSpaceBalance } = useRelayer()
  const spaceBalance = useSelector((state) => state.space).balance

  const fetchSpaces = useCallback(async () => {
    try {
      const _account = account || solanaAccount
      if (accessKey && _account) {
        setDataIsLoading(true)
        const spaces = await getUserSpaces(_account, accessKey)
        setSpaces(spaces)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setDataIsLoading(false)
    }
  }, [accessKey, account, solanaAccount])

  const fetchCollections = useCallback(async () => {
    try {
      if (!selectedSpace) return
      const _account = account || solanaAccount
      if (accessKey && _account) {
        setDataIsLoading(true)
        const { data, totalResults } = await getAllCollectionByAddress(
          accessKey,
          _account,
          (page - 1) * ITEMS_PER_PAGE,
          ITEMS_PER_PAGE,
          selectedSpace.spaceId,
        )
        setTotal(totalResults)
        setCollections(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setDataIsLoading(false)
    }
  }, [accessKey, account, page, solanaAccount, selectedSpace])

  const fetchIsUserWhitelisted = useCallback(async () => {
    if (account || solanaAccount) {
      try {
        setIsLoading(true)
        const { launchpadAccess } = await isWhitelistedForLaunchpad(accessKey, account || solanaAccount.toBase58())
        setIsWhitelisted(launchpadAccess)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
  }, [accessKey, account, solanaAccount])

  useEffect(() => {
    ;(async () => {
      await fetchIsUserWhitelisted()
    })()
  }, [fetchIsUserWhitelisted])

  useEffect(() => {
    ;(async () => {
      await fetchSpaces()
    })()
  }, [fetchSpaces])

  useEffect(() => {
    ;(async () => {
      await fetchCollections()
    })()
  }, [fetchCollections])

  useEffect(() => {
    if (account && isWhitelisted) {
      getSpaceBalance()
    }
  }, [getSpaceBalance, account, isWhitelisted, selectedChainId])

  useEffect(() => {
    setSelectedChainId(connectedChainId)
  }, [connectedChainId])

  const changeChain = async (_chainId) => {
    try {
      await switchChain(connector, Number(_chainId))
      setSelectedChainId(Number(_chainId))
    } catch (error) {
      console.log(error)
    }
  }

  const onClickConnectWallet = () => {
    setShowWallets(true)
    setFilterChains(['SOL', 'EVM'])
    setSelectedSpace(null)
    setCollections([])
  }

  const setCollectionToContext = async (id) => {
    try {
      const collection = await getCollectionById(accessKey, id)
      const { profile, contestMetaData, spaceId } = collection
      setCreateState((state) => ({
        ...state,
        profile,
        space: { spaceId },
      }))

      const modules = contestMetaData.map(({ name, req, rewardData, tasks }) => ({
        name,
        req,
        rewardData,
        tasks,
        readOnly: false,
      }))
      setModules(modules)
      setIsEditingCollection(true)
      setShareSpaceDetails(false)
    } catch (e) {}
  }

  const selectCollection = async (id) => {
    if (!accessKey) return
    changeActionType('edit')
    setCollectionId(id)
    await setCollectionToContext(id)
    onOpen()
  }

  const selectSpace = async (id) => {
    if (!accessKey) return
    setSelectedSpace(spaces.find((space) => space?.spaceId === id))
  }

  const onPageChange = (_page) => {
    setPage(_page)
  }

  const getContent = () => {
    if (isLoading || isDataLoading) {
      return (
        <Flex w="full" h="fit-content" justifyContent={'center'} alignItems={'center'}>
          <Grid
            w="full"
            templateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)',
              'repeat(3, 1fr)',
              'repeat(5, 1fr)',
              'repeat(6, 1fr)',
            ]}
            gap={10}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((_, index) => (
              <GridItem key={index} w="full">
                <CollectionCardSkeleton />
              </GridItem>
            ))}
          </Grid>
        </Flex>
      )
    }

    if (solanaAccount || account) {
      if (isWhitelisted) {
        return (
          <Box w="full" margin={'0 auto'}>
            {collections.length > 0 && (
              <>
                <Grid
                  templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(3, 1fr)',
                    'repeat(3, 1fr)',
                    'repeat(5, 1fr)',
                    'repeat(6, 1fr)',
                  ]}
                  gap={10}
                >
                  {collections.map((collection, index) => (
                    <GridItem key={index}>
                      <CollectionCard data={collection} selectCollection={selectCollection} />
                    </GridItem>
                  ))}
                </Grid>
                <Flex mt="6" justifyContent={'center'}>
                  <Pagination
                    currentPage={page}
                    totalCount={total}
                    pageSize={ITEMS_PER_PAGE}
                    onPageChange={onPageChange}
                  />
                </Flex>
              </>
            )}

            {!selectedSpace && spaces.length > 0 && (
              <>
                <Grid
                  templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(3, 1fr)',
                    'repeat(3, 1fr)',
                    'repeat(5, 1fr)',
                    'repeat(6, 1fr)',
                  ]}
                  gap={10}
                >
                  {spaces.map((space, index) => (
                    <GridItem key={index}>
                      <SpaceCard data={space} selectSpace={selectSpace} />
                    </GridItem>
                  ))}
                </Grid>
                <Flex mt="6" justifyContent={'center'}>
                  <Pagination
                    currentPage={page}
                    totalCount={total}
                    pageSize={ITEMS_PER_PAGE}
                    onPageChange={onPageChange}
                  />
                </Flex>
              </>
            )}

            {spaces.length <= 0 && (
              <Flex h="full" w={'full'} alignItems="center" justifyContent="center">
                No spaces found
              </Flex>
            )}

            {selectedSpace && collections.length <= 0 && (
              <Flex h="full" w={'full'} alignItems="center" justifyContent="center">
                No collections found
              </Flex>
            )}
          </Box>
        )
      } else {
        return (
          <Flex w="full" h="70vh" justifyContent={'center'} alignItems={'center'}>
            <Flex flexDir="column" h="60" w="full" justifyContent="center" alignItems="center">
              <Text fontSize="20" mb="4">
                Want to create Collection/Contest?
              </Text>
              <Button
                bg="black"
                color="white"
                _hover={{
                  backgroundColor: 'black',
                }}
                size="sm"
                onClick={() => window.open(clientConfig?.config?.links?.whitelist)}
              >
                Apply for whitelist
              </Button>
            </Flex>
          </Flex>
        )
      }
    } else {
      return (
        <Flex w="full" h="70vh" justifyContent={'center'} alignItems={'center'}>
          {/*{showWallets ? (*/}
          {/*  <Flex flexDir={'column'} h={'70vh'} justifyContent={'center'} alignItems={'center'}>*/}
          {/*    <CloseButton alignSelf={'flex-end'} onClick={() => setShowWallets(false)} />*/}
          {/*    <AllWallets onlyEvm={!supportedChains.some((chain) => chain === 9090 || chain === 9091)} />*/}
          {/*  </Flex>*/}
          {/*) : (*/}
          {/* */}
          {/*)}*/}

          <WelcomeScreen onClickConnectWallet={onClickConnectWallet} clientConfig={clientConfig} />
        </Flex>
      )
    }
  }

  const getHeader = useCallback(() => {
    if ((solanaAccount || account) && isWhitelisted) {
      return (
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Text
                fontWeight={!selectedSpace ? 'bold' : 'medium'}
                onClick={() => {
                  setSelectedSpace(null)
                  setCollections([])
                }}
                cursor={'pointer'}
              >
                Spaces
              </Text>
            </BreadcrumbItem>
            {selectedSpace && (
              <BreadcrumbItem>
                <Text fontWeight={selectedSpace ? 'bold' : 'medium'}>Collections</Text>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
          {account && (
            <Flex alignItems={'center'}>
              <Text mr="2">
                Balance: {spaceBalance?.toPrecision(3)} {` ${CHAIN_INFO[selectedChainId]?.nativeCurrency?.symbol}`}
              </Text>
              <Button
                size={'xs'}
                variant="outline"
                mr="4"
                display={['none', 'initial']}
                onClick={() => {
                  onFundOpen()
                  setIsFund(true)
                }}
              >
                Deposit Funds
              </Button>
              <Button
                size={'xs'}
                variant="outline"
                display={['none', 'initial']}
                onClick={() => {
                  onFundOpen()
                  setIsFund(false)
                }}
              >
                Withdraw Funds
              </Button>

              <Menu isLazy>
                <MenuButton
                  size={'sm'}
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  display={['initial', 'none']}
                  borderColor={'muted'}
                />
                <MenuList bg={'muted'}>
                  <MenuItem
                    bg={'muted'}
                    onClick={() => {
                      onFundOpen()
                      setIsFund(true)
                    }}
                  >
                    Deposit Funds
                  </MenuItem>
                  <MenuItem
                    bg={'muted'}
                    onClick={() => {
                      onFundOpen()
                      setIsFund(false)
                    }}
                  >
                    Withdraw Funds
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      )
    }
  }, [solanaAccount, account, isWhitelisted, spaceBalance, selectedSpace, selectedChainId])

  return (
    <>
      <CreatorStudioHeader
        isWhitelisted={isWhitelisted}
        changeActionType={changeActionType}
        selectedChainId={selectedChainId}
        changeChain={changeChain}
        isLoading={isLoading}
        {...createProps}
      />
      {getHeader()}
      <Flex mt="2" h="80vh">
        {getContent()}
        <Suspense fallback={null}>
          <EditCollection {...props} />
        </Suspense>
        <FundModal
          isOpen={isFundOpen}
          onOpen={onFundOpen}
          onClose={onFundClose}
          isFund={isFund}
          selectedChainId={selectedChainId}
        />
      </Flex>
    </>
  )
}

export default Dashboard
