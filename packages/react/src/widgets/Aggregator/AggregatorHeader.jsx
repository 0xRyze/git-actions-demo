import React, { Suspense } from 'react'
import { Box, Button, Flex, InputLeftElement, InputRightElement, Link, Skeleton, useMediaQuery } from '@chakra-ui/react'
import { Input } from '../../components/ui/input'

import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { IoFilterOutline } from 'react-icons/io5'
import { useDisclosure } from '@chakra-ui/hooks'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import Select from '../../components/Select'
import ChainSelector from './components/ChainSelector/ChainSelector'

// const Launchpad = React.lazy(() => import('../Launchpad'))

const AggregatorHeader = ({
  accessKey,
  TABLE_VIEWS,
  NFT_TYPE,
  tableView,
  nftType,
  onChangeTableView,
  onChangeNftType,
  chain,
  selectChain,
  allowedChains,
  setSearchDebounced,
  search,
  handleClearSearch,
  onOpenLaunchpad,
  onCloseLaunchpad,
  isLaunchpadOpen,
  searchInputRef,
  handleMenu,
  containerRef,
}) => {
  const [isLesserThan768] = useMediaQuery('(max-width: 768px)', {
    ssr: false,
  })
  const { isOpen, onToggle } = useDisclosure()
  const { isOpen: isSmallSearchOpen, onToggle: onSearchToggle } = useDisclosure()
  const { isOpen: isNftTypeOpen, onOpen: onNftTypeOpen, onClose: onNftTypeClose } = useDisclosure()
  const { isOpen: isTableViewOpen, onOpen: onTableViewOpen, onClose: onTableViewClose } = useDisclosure()

  const { config } = useConsumerContext()
  const { launchpadEnabled, categoryFilterEnabled, typeFilterEnabled } = config

  const getSearchInput = (search) => {
    return (
      <Input
        id="search-input"
        minWidth={250}
        size={'sm'}
        onChange={(e) => setSearchDebounced(e.target.value)}
        placeholder="Search Collection/Contest"
        ref={searchInputRef}
        InputLeftAddon={
          <InputLeftElement h={8} pointerEvents="none" children={<SearchIcon stroke={1} color="mutedForeground" />} />
        }
        InputRightAddon={
          search ? (
            <InputRightElement
              h={8}
              children={<CloseIcon color="mutedForeground" w="3" cursor="pointer" onClick={handleClearSearch} />}
            />
          ) : null
        }
      />
    )
  }
  return (
    <Box marginY={4}>
      {isSmallSearchOpen && <Box mb={2}>{getSearchInput(search)}</Box>}

      <Flex>
        <Flex mr="auto">
          {isLesserThan768 ? (
            <Button variant="outline" onClick={onSearchToggle}>
              <SearchIcon color="mutedForeground" />
            </Button>
          ) : (
            getSearchInput(search)
          )}
        </Flex>

        {launchpadEnabled && (
          <Suspense
            fallback={<Skeleton h={8} w={'120px'} borderRadius={'6'} mr="2" startColor="muted" endColor="input" />}
          >
            <Link href="https://bandit.network/launchpad" isExternal>
              <Button variant="outline" size={'sm'} w={'120px'} onClick={onOpenLaunchpad} mr={2}>
                Launchpad
              </Button>
            </Link>
            {/*<Launchpad*/}
            {/*  accessKey={accessKey}*/}
            {/*  isOpen={isLaunchpadOpen}*/}
            {/*  onOpenLaunchpad={onOpenLaunchpad}*/}
            {/*  onClose={onCloseLaunchpad}*/}
            {/*/>*/}
          </Suspense>
        )}

        {(categoryFilterEnabled || typeFilterEnabled || allowedChains.length > 1) && (
          <Button variant="outline" size={'sm'} rightIcon={<IoFilterOutline />} onClick={onToggle}>
            Filters
          </Button>
        )}
      </Flex>

      {isOpen && (
        <Box>
          <Flex flexDirection={['column', 'row']} justify="end" mt={2}>
            <Flex>
              {categoryFilterEnabled && (
                <Box mr={2} mb={[2, 2, 0]} minW={'140px'}>
                  <Select
                    id="category"
                    options={NFT_TYPE}
                    onChange={onChangeNftType}
                    defaultValue={nftType}
                    isOpen={isNftTypeOpen}
                    onClose={onNftTypeClose}
                    onOpen={onNftTypeOpen}
                  />
                </Box>
              )}
              {typeFilterEnabled && (
                <Box mr={2} mb={[2, 2, 0]} minW={'140px'}>
                  <Select
                    id="collection-type"
                    options={TABLE_VIEWS}
                    onChange={onChangeTableView}
                    defaultValue={tableView}
                    isOpen={isTableViewOpen}
                    onClose={onTableViewClose}
                    onOpen={onTableViewOpen}
                  />
                </Box>
              )}
            </Flex>
            <ChainSelector chain={chain} selectChain={selectChain} allowedChains={allowedChains} />
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default AggregatorHeader
