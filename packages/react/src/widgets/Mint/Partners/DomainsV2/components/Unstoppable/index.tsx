import { Box, Flex, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { getDomainSuggestions } from '../../../../../../state/partners/source'
import { debounce } from '../../../../../../utils'
import { isSelectedWalletSolana } from '../../../../../../utils/getWalletChain'
import AddressInput from '../../../Domains/AddressInput'
import Empty from '../../../Domains/Empty'
import Loading from '../../../Domains/Loading'
import useUd from '../../hooks/useUd'
import DomainActionButton from '../DomainActionButton'
import DomainItem from '../DomainItem'
import PayUsing from '../PayUsing'
import SearchBar from '../SearchBar'
import DomainMintLoader from '../DomainMintLoader'
import { updateMintError } from '../../../../../../state/collection/source'

interface Props {
  collectionState: any
  domainInterval: any
  accessKey: any
  selectedDomain: any
  selectedWallet: any
  domainList: any[]
  onSelectDomain: (_domain: any) => void
  payUsing: any
  loading: boolean
  toggleLoading: (_loading: boolean) => void
  setDomains: (list: any[]) => void
  search: string
  userWalletAddress: any
  toggleFetchingLatestPrice: (_loading: boolean) => void
  onChangeSearch: (_search: string) => void
  onClickCustomPay: (e: any) => void
  getPayableCurrency: () => (
    | {
        label: string
        value: string
        ticker: string
        chain: number
        address?: undefined
      }
    | {
        label: string
        value: string
        ticker: string
        address: string
        chain: number
      }
  )[]
  primaryAddress: any
  setFilterChains: any
  setShowWallets: any
  checkNetwork: () => any
  requestNetworkSwitch: () => Promise<void>
  address: any
  isEnoughBalance: boolean
  isFetchingLatestPrice: boolean
  payableAmount: any
  toggleSwapping: (_isSwapped: boolean) => void
  setIsDomainPurchased: (_isPurchased: boolean) => void
  isSwapping: boolean
  isDomainPurchased: boolean
  setAddress: any
}

const Unstoppable: React.FC<Props> = ({
  collectionState,
  domainInterval,
  accessKey,
  selectedDomain,
  selectedWallet,
  domainList,
  onSelectDomain,
  payUsing,
  loading,
  setDomains,
  toggleLoading,
  search,
  userWalletAddress,
  toggleFetchingLatestPrice,
  onChangeSearch,
  onClickCustomPay,
  getPayableCurrency,
  primaryAddress,
  setFilterChains,
  setShowWallets,
  checkNetwork,
  requestNetworkSwitch,
  address,
  isEnoughBalance,
  isFetchingLatestPrice,
  payableAmount,
  toggleSwapping,
  setIsDomainPurchased,
  isSwapping,
  isDomainPurchased,
  setAddress,
}) => {
  const [mintStatus, setMintStatus] = useState('start')
  const [mintedTx, setMintedTx] = useState(null)
  const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure()
  const { registerUd } = useUd(payUsing)

  const toast = useToast()

  const domainsPolling = useCallback(async () => {
    try {
      toggleFetchingLatestPrice(true)
      let domains
      domains = await getDomainSuggestions(accessKey, search, userWalletAddress)

      if (selectedDomain) {
        const domain = domains.find((item: any) => item.name === selectedDomain.name)

        if (domain) {
          onSelectDomain(domain)
        } else {
          onSelectDomain('')
        }
      }
      setDomains(domains)
    } catch (e) {
    } finally {
      toggleFetchingLatestPrice(false)
    }
  }, [accessKey, search, userWalletAddress])

  const getSuggestions = useCallback(
    debounce(async () => {
      try {
        if (!search?.length) return
        if (domainInterval.current) {
          clearInterval(domainInterval.current)
        }
        setDomains([])
        toggleLoading(true)
        onSelectDomain('')
        const hyphenatedSearch = search.trim().replace(/\s+/g, '-')
        const domains = await getDomainSuggestions(accessKey, encodeURIComponent(hyphenatedSearch), userWalletAddress)
        if (!!domains?.length) {
          setDomains(domains)
          domainInterval.current = setInterval(domainsPolling, 30000)
        }
      } catch (e) {
        console.log(e)
      } finally {
        toggleLoading(false)
      }
    }, 400),
    [search, accessKey, domainsPolling, userWalletAddress],
  )

  const enterPressed = (event: any) => {
    var code = event.keyCode || event.which
    if (code === 13 && search?.length > 0) {
      //13 is the enter keycode
      getSuggestions()
    }
  }

  useEffect(() => {
    if (userWalletAddress) {
      getSuggestions()
    }
  }, [userWalletAddress])

  const mintDomain = async () => {
    try {
      toggleSwapping(true)
      onLoaderOpen()
      setMintStatus('pending')
      if (domainInterval.current) {
        clearInterval(domainInterval.current)
      }
      await registerUd(
        accessKey,
        selectedDomain,
        payUsing,
        userWalletAddress,
        address,
        selectedWallet,
        domainInterval,
        getSuggestions,
      )
      setIsDomainPurchased(true)
      setMintStatus('completed')
    } catch (e) {
      // removeLockedDomain(accessKey, {
      //   name: selectedDomain.name,
      // })
      onSelectDomain('')
      getSuggestions()
      toast({
        title: `Failed to mint`,
        description: e?.response?.data?.data || e.reason || e.message,
        status: 'error',
        duration: 1000,
      })
      const error = e?.reason ? e?.reason : e?.message
      const params = {
        errorLog: JSON.stringify({
          userWalletAddress,
          error,
        }),
      }
      console.log(e)
      if (!error.includes('ser rejected')) {
        updateMintError(collectionState?.collectionId, accessKey, params)
        setMintStatus('error')
      } else {
        setMintStatus('ignore')
      }
    } finally {
      toggleSwapping(false)
    }
  }

  const resetStatus = () => {
    setMintStatus('start')
    setMintedTx(null)
  }

  return (
    <Flex w="full" flexDir={'column'}>
      <SearchBar
        onChangeSearch={(e) => onChangeSearch(e.target.value.split('.')[0])}
        enterPressed={enterPressed}
        getSuggestions={getSuggestions}
      />

      {!domainList?.length && !loading && <Empty />}
      {loading && <Loading />}

      {!!domainList?.length && (
        <Box>
          <PayUsing getPayableCurrency={getPayableCurrency} onClickCustomPay={onClickCustomPay} payUsing={payUsing} />

          <Box
            maxH="250px"
            overflowY="auto"
            // pr={3}
            pt={2}
            position="relative"
          >
            {domainList.map((domain, index) => (
              <DomainItem
                key={index}
                domain={{ ...domain, name: domain?.name }}
                selected={domain.name === selectedDomain?.name}
                onSelect={() => onSelectDomain(domain)}
                onUnSelect={() => onSelectDomain('')}
                currency={payUsing?.ticker}
              />
            ))}
          </Box>

          {selectedDomain && isSelectedWalletSolana(selectedWallet) && (
            <AddressInput address={address} setAddress={setAddress} />
          )}

          <DomainActionButton
            primaryAddress={primaryAddress}
            isUnstoppableDomain={true}
            isEnsDomain={false}
            isBnsDomain={false}
            isSolanaDomain={false}
            setFilterChains={setFilterChains}
            setShowWallets={setShowWallets}
            selectedWallet={selectedWallet}
            checkNetwork={checkNetwork}
            requestNetworkSwitch={requestNetworkSwitch}
            selectedDomain={selectedDomain}
            address={address}
            isEnoughBalance={isEnoughBalance}
            isFetchingLatestPrice={isFetchingLatestPrice}
            payableAmount={payableAmount}
            payUsing={payUsing}
            mintDomain={mintDomain}
            collectionChainId={collectionState?.chainId}
          />
        </Box>
      )}
      <DomainMintLoader
        tags={collectionState?.collectionTag}
        resetStatus={resetStatus}
        isOpen={isLoaderOpen}
        onClose={onLoaderClose}
        website="https://unstoppabledomains.com"
        celebrate={() => {
          window.open(
            `https://twitter.com/intent/tweet?text=Ready%20to%20take%20my%20online%20identity%20to%20the%20next%20level%20with%20my%20@unstoppableweb%20on%20bandit.network.%20And%20the%20best%20part?%20I%20also%20got%20some%20amazing%20rewards%20from%20@OnBndit,%20@bonk_inu,%20@NFTevening.%20Join%20me%20and%20claim%20yours%20now!`,
            '_blank',
          )
        }}
        showOffers={false}
        address={userWalletAddress?.toString()}
        list={[
          {
            title: `Mint`,
            completed: mintStatus,
            hasLink: !!mintedTx,
            enable: true,
            link: '',
          },
        ]}
      />
    </Flex>
  )
}

export default Unstoppable
