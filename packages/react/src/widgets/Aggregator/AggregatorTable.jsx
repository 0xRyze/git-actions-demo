import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import Table from './components/Table'
import useLiveMint from './hooks/useLiveMint'
import useFreeMint from './hooks/useFreeMint'
import useUpcomingMint from './hooks/useUpcoming'
import AggregatorHeader from './AggregatorHeader'
import { fetchSearchResults, getCollectionTags, getStats } from '../../state/stats/source'
import { updateAccessKey } from '../../state/user/reducer'
import { debounce } from '../../utils'
import { NFT_TYPE, TABLE_VIEWS } from './constants'
import { updateSelectedCollectionId, updateShowMint } from '../../state/collection/reducer'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import { logMetric } from '../../components/analytics'
import { METRICS } from '../../components/analytics/constants'

// const Collection = React.lazy(() => import('../Collection').then((module) => ({ default: module.Collection })))
const Mint = React.lazy(() => import('../Mint').then((module) => ({ default: module.Mint })))
const Leaderboard = React.lazy(() => import('../Leaderboard').then((module) => ({ default: module.Leaderboard })))

const SupportLinks = React.lazy(() => import('./components/SupportLinks'))
const PoweredBy = React.lazy(() => import('./components/PoweredBy'))
const Pagination = React.lazy(() => import('./components/Pagination'))

const ITEMS_PER_PAGE = 15

const AggregatorTable = ({ accessKey, showPoweredBy = true }) => {
  const clientConfig = useConsumerContext()
  const { config, isConsumerLoading } = clientConfig || {}
  const { allowedChains = [], allowedMarketPlaces, allowedCollections, allowedTags = [] } = config || {}
  const [tableView, setTableView] = useState(TABLE_VIEWS[0])
  const [nftType, setNftType] = useState(NFT_TYPE[0])
  const [chain, setChain] = useState('')
  const [search, setSearch] = useState('')
  const [collectionList, setCollectionList] = useState(
    TABLE_VIEWS.reduce((acc, tv) => {
      acc = {
        ...acc,
        [tv.value]: {},
      }

      return acc
    }, {}),
  )

  const [totalResults, setTotalResults] = useState(
    TABLE_VIEWS.reduce((acc, tv) => {
      acc = {
        ...acc,
        [tv.value]: 0,
      }

      return acc
    }, {}),
  )

  const [page, setPage] = useState(1)
  const [nftTypes, setNftTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const { columns: liveMintColumns } = useLiveMint()
  const { columns: freeMintColumns } = useFreeMint()
  const { columns: upcomingColumns } = useUpcomingMint()

  const { isOpen: isLaunchpadOpen, onOpen: onOpenLaunchpad, onClose: onCloseLaunchpad } = useDisclosure()

  const dispatch = useDispatch()

  const searchInputRef = useRef()

  // const disable = true

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const collectionId = queryParams.get('collectionId')
    const source = queryParams.get('source')
    const isMintView = window?.location.hash === '#mint'
    if (collectionId) {
      dispatch(updateSelectedCollectionId({ id: collectionId }))
    }

    if (source) {
      updateSource(source, collectionId)
    }

    if (isMintView) {
      dispatch(
        updateShowMint({
          showMint: true,
        }),
      )
    }
  }, [])

  const updateSource = useCallback(
    (source, collectionId) => {
      logMetric(accessKey, METRICS.SOURCE, { source, collectionId })
    },
    [accessKey],
  )

  const fetchStatsData = useCallback(
    async (accessKey) => {
      try {
        setIsLoading(true)
        let searchResults = []
        if (search) {
          const { data } = await fetchSearchResults(
            accessKey,
            search,
            [nftType.value],
            tableView.value,
            chain === '' ? (!!allowedChains.length ? allowedChains : []) : [chain],
            allowedMarketPlaces,
            allowedCollections,
          )
          searchResults = data
        }
        let collectionIds = searchResults?.reduce((acc, result) => {
          acc.push(result.collectionId)
          return acc
        }, [])
        const { data, totalResults } = await getStats(
          accessKey,
          tableView.value,
          (page - 1) * ITEMS_PER_PAGE,
          ITEMS_PER_PAGE,
          chain === '' ? (!!allowedChains.length ? allowedChains : []) : [chain],
          !!collectionIds.length ? collectionIds : allowedCollections,
          [...allowedTags, nftType.value],
          !!collectionIds.length ? [] : allowedMarketPlaces,
        )
        setCollectionList((state) => ({
          ...state,
          [tableView.value]: {
            ...state[tableView.value],
            [page]: data,
          },
        }))
        setTotalResults((state) => ({ ...state, [tableView.value]: totalResults }))
      } catch (e) {
      } finally {
        setIsLoading(false)
      }
    },
    [chain, tableView, search, page, nftType, allowedChains],
  )

  const fetchNftTypes = useCallback(async (accessKey) => {
    try {
      const data = await getCollectionTags(accessKey)
      setNftTypes([{ label: 'All', value: 'all' }, ...data?.map((type) => ({ value: type.id, label: type.value }))])
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (accessKey && !isConsumerLoading) {
      fetchStatsData(accessKey)
    }
  }, [accessKey, fetchStatsData, isConsumerLoading])

  useEffect(() => {
    if (accessKey && !isConsumerLoading) {
      fetchNftTypes(accessKey)
    }
  }, [accessKey, fetchNftTypes, isConsumerLoading])

  useEffect(() => {
    if (accessKey) {
      dispatch(updateAccessKey({ accessKey }))
    }
  }, [accessKey])

  const setSearchDebounced = debounce((...props) => {
    setSearch(...props)
    setPage(1)
  }, 500)

  const onPageChange = (_page) => {
    setIsLoading(true)
    setPage(_page)
  }

  const onChangeTableView = (_tableView) => {
    setTableView(_tableView)
    // setTotalResults(0)
    setPage(1)
  }

  const onChangeNftType = (type) => {
    setNftType(type)
    setPage(1)
    // setTotalResults(0)
  }

  const selectChain = (_chain) => {
    setChain(() => _chain)
    // setTotalResults(0)
    setPage(1)
  }

  const handleClearSearch = () => {
    searchInputRef.current.value = ''
    setSearch('')
  }

  const handleMenu = (_isEdit) => {
    setIsEdit(_isEdit)
  }

  const columns = useMemo(() => {
    let _columns = liveMintColumns
    switch (tableView.value) {
      case 'free':
        _columns = freeMintColumns
        break
      case 'upcoming':
        _columns = upcomingColumns
        break
      default:
        _columns = liveMintColumns
    }
    return _columns
  }, [tableView, freeMintColumns, upcomingColumns, liveMintColumns])

  return (
    <Box maxWidth={1660} margin="0 auto">
      <AggregatorHeader
        accessKey={accessKey}
        TABLE_VIEWS={TABLE_VIEWS}
        NFT_TYPE={nftTypes}
        tableView={tableView}
        nftType={nftType}
        onChangeTableView={onChangeTableView}
        onChangeNftType={onChangeNftType}
        chain={chain}
        selectChain={selectChain}
        allowedChains={allowedChains}
        search={search}
        setSearchDebounced={setSearchDebounced}
        handleClearSearch={handleClearSearch}
        onOpenLaunchpad={onOpenLaunchpad}
        onCloseLaunchpad={onCloseLaunchpad}
        isLaunchpadOpen={isLaunchpadOpen}
        searchInputRef={searchInputRef}
        handleMenu={handleMenu}
      />
      <Table
        columns={columns}
        isLoading={isLoading}
        data={collectionList[tableView.value][page] || []}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <Suspense fallback={null}>
        <Flex justify="space-Between" align="center" marginY={4} flexDirection={['column', 'column', 'row']}>
          <Box mt={[2, 2, 0]}>
            <SupportLinks />
          </Box>
          <Box order={['-1', '-1', 'inherit']}>
            <Pagination
              currentPage={page}
              totalCount={totalResults[tableView.value]}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={onPageChange}
            />
          </Box>
          <Box mt={[2, 2, 0]}>
            <PoweredBy />
          </Box>
        </Flex>
      </Suspense>

      <Suspense fallback={null}>
        {/* {createPortal(<Collection accessKey={accessKey} />, document.body)} */}
        {createPortal(<Mint accessKey={accessKey} />, document.body)}
        {createPortal(<Leaderboard accessKey={accessKey} />, document.body)}
      </Suspense>
    </Box>
  )
}

export default AggregatorTable
