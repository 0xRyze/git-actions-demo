import { Box, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'
import { environment } from '../../../../../..'
import { getEnsDomainSuggestions } from '../../../../../../state/partners/source'
import { debounce } from '../../../../../../utils'
import Empty from '../../../Domains/Empty'
import Loading from '../../../Domains/Loading'
import useEns from '../../hooks/useEns'
import DomainActionButton from '../DomainActionButton'
import DomainItem from '../DomainItem'
import PayUsing from '../PayUsing'
import SearchBar from '../SearchBar'
import DurationSelection from './components/DurationSelection'
import DomainMintLoader from '../DomainMintLoader'
import { updateMintError } from '../../../../../../state/collection/source'

const isProd = environment === 'production'

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
  changeDuration: (_duration: number) => void
  duration: number
  payableAmount: number
  isSubtotalLoading: boolean
  subTotalPrice: number
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
  toggleSwapping: (_isSwapped: boolean) => void
  setIsDomainPurchased: (_isPurchased: boolean) => void
  isSwapping: boolean
  isDomainPurchased: boolean
}

const ENS: React.FC<Props> = ({
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
  changeDuration,
  duration,
  payableAmount,
  isSubtotalLoading,
  subTotalPrice,
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
  toggleSwapping,
  setIsDomainPurchased,
  isSwapping,
  isDomainPurchased,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [mintStatus, setMintStatus] = useState('start')
  const [mintedTx, setMintedTx] = useState(null)
  const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure()

  const { registerEnsDomain, ensRegistarController } = useEns()
  const { account } = useWeb3React()

  const domainsPolling = useCallback(async () => {
    try {
      toggleFetchingLatestPrice(true)
      let domains
      domains = await getEnsDomainSuggestions(accessKey, search)

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

        const domains = await getEnsDomainSuggestions(accessKey, hyphenatedSearch)
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
      await registerEnsDomain(
        accessKey,
        selectedDomain.name.split('.')[0],
        account,
        duration,
        selectedDomain?.availability?.price?.weiPerSecond,
        account,
        address,
        selectedDomain?.discountedRate[payUsing.value],
        payUsing.value,
        isProd,
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

          <DurationSelection
            selectedDomain={selectedDomain}
            duration={duration}
            selectDuration={changeDuration}
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            loading={loading}
            subTotalPrice={subTotalPrice}
            payUsing={payUsing}
          />

          <DomainActionButton
            primaryAddress={primaryAddress}
            isUnstoppableDomain={false}
            isEnsDomain={true}
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
        website="https://ens.domains"
        celebrate={() => {
          window.open(
            `https://twitter.com/intent/tweet?text=Just%20secured%20my%20new%20@ensdomains%20on%20bandit.network!%20Ready%20to%20rock%20my%20online%20presence.%20&hashtags=DigitalUpgrade`,
            '_blank',
          )
        }}
        showOffers={true}
        address={account}
        list={[
          {
            title: `Mint`,
            completed: mintStatus,
            hasLink: !!mintedTx,
            enable: true,
            link: '',
          },
        ]}
        pendingMessage={
          <Flex flexDir={'column'} alignItems={'center'} mt="2">
            <Text fontSize={12} fontWeight={600} mt="2">
              Registering your domain takes three steps
            </Text>
            <Text fontSize={12} fontWeight={500} mt="2">
              1. Complete the claim transaction to begin the process.
            </Text>
            <Text fontSize={12} fontWeight={500} mt="2">
              2. Waits 60 seconds for the claim transaction to complete.
            </Text>
            <Text fontSize={12} fontWeight={500} mt="2">
              3. Complete the register transaction to secure your name.
            </Text>
          </Flex>
        }
      />
    </Flex>
  )
}

export default ENS
