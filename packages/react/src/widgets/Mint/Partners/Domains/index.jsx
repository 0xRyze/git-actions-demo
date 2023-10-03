import { Box, Button, Flex, Select, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useConnection } from '@solana/wallet-adapter-react'
import {
  getDomainSuggestions,
  getEnsDomainSuggestions,
  getSnsDomainSuggestions,
} from '../../../../state/partners/source'
import { debounce, truncateAddress } from '../../../../utils'
import ActionButton from '../../Widget/ActionButton'
import DomainItem from './DomainItem'
import Empty from './Empty'

import styled from '@emotion/styled'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { updateSelectedCollectionId } from '../../../../state/collection/reducer'
import { switchChain } from '../../../../utils/switchChain'
import { StyledCloseIcon } from '../../Widget/styles'
import {
  EVM_DEVNET_TOKENS,
  EVM_MAINNET_TOKENS,
  SOL_DEVNET_TOKENS,
  SOL_MAINNET_TOKENS,
} from '../constants/supportedCurrencies'
import { useBalances } from '../hooks/useBalance'
import useEns from '../hooks/useEns'
import useSns from '../hooks/useSns'
import useUd from '../hooks/useUd'
import DomainMintingLoader from './DomainMintingLoader'
import Loading from './Loading'
import PurchaseSuccess from './PurchaseSuccess'
import { Input } from '../../../../components/ui/input'
import useWalletContext from '../../../../components/WalletModal/hooks/useWalletContext'
import { isSelectedWalletEvm, isSelectedWalletSolana } from '../../../../utils/getWalletChain'
import { environment } from '../../../../context/BanditContext'
import StorageSlider from './SNS/components/StorageSlider'
import DurationSelection from './ENS/components/DurationSelection'

export const LoadingScreen = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 16px;
`

const isProd = environment === 'production'

const SOL_DESTINATION_WALLET = isProd
  ? 'HGZmW9bWZZhVvfGbBBU1dvYHsXwi7BqPX5vG39v87iXW'
  : '5bPVXMADTeJCbZ1dMfn6GRm8Zm1mSbwR84UsyRT4eVAT'
const EVM_DESTINATION_WALLET = isProd
  ? '0x4D535c34DD050B0Bc0e7dC6A988a1443Dfb520ac'
  : '0x663Bae08ad96BC7D0f5F895dAb6daA84F9F6De0C'

const SOL_CURRENCIES = isProd ? SOL_MAINNET_TOKENS : SOL_DEVNET_TOKENS
const EVM_CURRENCIES = isProd ? EVM_MAINNET_TOKENS : EVM_DEVNET_TOKENS

const Domains = ({ accessKey, onClickClose, collectionState, disconnectWallet }) => {
  const [address, setAddress] = useState('')
  const [size, setSize] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [domainList, setDomainList] = useState([])
  const [payUsing, setPayUsing] = useState({
    label: null,
    value: null,
    chain: null,
  })
  const [selectedDomain, setSelectedDomain] = useState('')
  const [swapping, setSwapping] = useState(false)
  const [domainPurchased, setDomainPurchased] = useState(false)
  const [isFetchingLatestPrice, setIsFetchingLatestPrice] = useState(false)
  const [isEnoughBalance, setIsEnoughBalance] = useState(false)
  const [payableAmount, setPayableAmount] = useState(0)
  const [isSubtotalLoading, setIsSubtotalLoading] = useState(false)
  const [subTotalPrice, setSubTotalPrice] = useState(0)
  const { isOpen: isSnsModalOpen, onOpen: onSnsModalOpen, onClose: onSnsModalClose } = useDisclosure()
  const { isOpen: isEnsModalOpen, onOpen: onEnsModalOpen, onClose: onEnsModalClose } = useDisclosure()
  const [duration, setDuration] = useState(1)

  const { primaryAddress, selectedWallet, setShowWallets, setFilterChains } = useWalletContext()

  const isSolanaDomain = collectionState?.contract?.contractAddress === 'bonfida-sns'
  const isUnstopableDomain = collectionState?.contract?.contractAddress === 'unstoppable-domain'
  const isEnsDomain = !isSolanaDomain && !isUnstopableDomain

  // const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const { connection } = useConnection()

  const dispatch = useDispatch()

  const { chainId: connectedChainId, account } = useWeb3React()

  const userWalletAddress = primaryAddress

  const { balances } = useBalances({
    currency: payUsing.value,
    address: payUsing.address,
    tokenDecimals: payUsing.decimals,
  })

  const { registerUd, renderAddressInput } = isUnstopableDomain && useUd(payUsing)
  const { registerEnsDomain, ensRegistarController } = isEnsDomain && useEns()
  const { registerSns } = isSolanaDomain && useSns()

  const toast = useToast()

  const domainInterval = useRef()

  useEffect(() => {
    if (isSelectedWalletSolana(selectedWallet)) {
      setPayUsing(SOL_CURRENCIES[0])
    } else {
      setPayUsing(EVM_CURRENCIES[0])
      setAddress(primaryAddress)
    }

    return () => {
      if (domainInterval.current) {
        clearInterval(domainInterval.current)
      }
    }
  }, [selectedWallet, primaryAddress])

  useEffect(() => {
    if (userWalletAddress) {
      getSuggestions()
    }
  }, [userWalletAddress])

  const domainsPolling = useCallback(async () => {
    try {
      setIsFetchingLatestPrice(true)

      let domains
      if (isUnstopableDomain) {
        domains = await getDomainSuggestions(accessKey, search, userWalletAddress)
      } else if (isSolanaDomain) {
        domains = await getSnsDomainSuggestions(accessKey, search)
      } else if (isEnsDomain) {
        domains = await getEnsDomainSuggestions(accessKey, search)
      }
      if (selectedDomain) {
        const domain = domains.find((item) => item.name === selectedDomain.name)

        if (domain) {
          setSelectedDomain(domain)
        } else {
          selectedDomain('')
        }
      }
      setDomainList(domains)
    } catch (e) {
    } finally {
      setIsFetchingLatestPrice(false)
    }
  }, [accessKey, search, userWalletAddress])

  const getSuggestions = useCallback(
    debounce(async () => {
      try {
        if (!search?.length) return
        if (domainInterval.current) {
          clearInterval(domainInterval.current)
        }
        setDomainList([])
        setLoading(true)
        setSelectedDomain('')
        const hyphenatedSearch = search.trim().replace(/\s+/g, '-')
        if (isUnstopableDomain) {
          const domains = await getDomainSuggestions(accessKey, encodeURIComponent(hyphenatedSearch), userWalletAddress)
          if (!!domains?.length) {
            setDomainList(domains)
            domainInterval.current = setInterval(domainsPolling, 30000)
          }
        } else if (isSolanaDomain) {
          const domains = await getSnsDomainSuggestions(accessKey, hyphenatedSearch)
          if (!!domains?.length) {
            setDomainList(domains)
            domainInterval.current = setInterval(domainsPolling, 30000)
          }
        } else if (isEnsDomain) {
          const domains = await getEnsDomainSuggestions(accessKey, hyphenatedSearch)
          if (!!domains?.length) {
            setDomainList(domains)
            domainInterval.current = setInterval(domainsPolling, 30000)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }, 400),
    [search, accessKey, domainsPolling, userWalletAddress],
  )

  const onChangeSearch = (e) => {
    if (isSolanaDomain || isEnsDomain) {
      setSearch(e.target.value.split('.')[0])
    } else {
      setSearch(e.target.value)
    }
  }

  const getPayableCurrency = () => {
    if (isSelectedWalletSolana(selectedWallet)) {
      return SOL_CURRENCIES
    } else {
      if (isEnsDomain) {
        return [EVM_CURRENCIES[0], EVM_CURRENCIES[1]]
      }
      return EVM_CURRENCIES
    }
  }

  const getPayableAmount = useCallback(
    (subTotalPrice = 0) => {
      if (selectedDomain) {
        if (payUsing.ticker === 'USDT') {
          setPayableAmount(selectedDomain.discountedRate['USDT'])
        } else {
          if (payUsing.value !== 'SOL' && isSelectedWalletSolana(selectedWallet)) {
            subTotalPrice = 0
          }
          setPayableAmount(Number(selectedDomain.discountedRate[payUsing.value]) + subTotalPrice)
        }
      }
      return 0
    },
    [selectedDomain, payUsing],
  )

  const checkNetwork = () => {
    return connectedChainId === payUsing.chain
  }

  const hasEnoughBalance = useCallback(
    (subTotalPrice = 0) => {
      if (!selectedDomain) {
        return true
      }
      if (isSolanaDomain) {
        if (payUsing.ticker === 'SOL') {
          setIsEnoughBalance(
            new BigNumber(balances[payUsing.value]).gte(
              new BigNumber(selectedDomain?.discountedRate[payUsing.ticker])
                .plus(subTotalPrice / LAMPORTS_PER_SOL)
                .toNumber(),
            ),
          )
        } else {
          setIsEnoughBalance(
            new BigNumber(balances[payUsing.value]).gte(Number(selectedDomain?.discountedRate[payUsing.ticker])),
          )
        }
      } else {
        setIsEnoughBalance(
          new BigNumber(balances[payUsing.value]).gte(
            Number(selectedDomain?.discountedRate[payUsing.ticker] + subTotalPrice),
          ),
        )
      }
    },
    [selectedDomain, balances, payUsing],
  )

  const getRent = useCallback(async () => {
    if (connection && isSolanaDomain && selectedDomain) {
      try {
        setIsSubtotalLoading(true)
        const _subTotalPrice = await connection.getMinimumBalanceForRentExemption(size * 1000)
        setSubTotalPrice(_subTotalPrice)
        hasEnoughBalance(_subTotalPrice)
        getPayableAmount(_subTotalPrice / LAMPORTS_PER_SOL)
      } catch (error) {
        console.log(error)
      } finally {
        setIsSubtotalLoading(false)
      }
    } else if (selectedDomain && isEnsDomain && ensRegistarController) {
      try {
        setIsSubtotalLoading(true)
        const _subTotalPrice = BigNumber(Number(selectedDomain?.discountedRate[payUsing.ticker])).multipliedBy(duration)
        setSubTotalPrice(_subTotalPrice.toNumber())
        setIsEnoughBalance(new BigNumber(balances[payUsing.value]).gte(_subTotalPrice.toNumber()))
        setPayableAmount(_subTotalPrice.toNumber())
      } catch (error) {
        console.log(error)
      } finally {
        setIsSubtotalLoading(false)
      }
    }
  }, [connection, size, payUsing, isEnsDomain, selectedDomain, ensRegistarController, duration])

  useEffect(() => {
    getPayableAmount()
    hasEnoughBalance()
    getRent()
  }, [getPayableAmount, hasEnoughBalance, getRent])

  const requestNetworkSwitch = async () => {
    try {
      await switchChain(selectedWallet.connector, payUsing.chain)
    } catch (e) {
      console.log(e)
    }
  }

  const onClickCustomPay = (e) => {
    const currencyList = getPayableCurrency()
    const selectedCurrency = currencyList.filter((c) => c.value === e.target.value)
    setPayUsing(selectedCurrency[0])
  }

  const onSelectDomain = (_domain) => {
    setSelectedDomain(_domain)
  }

  const enterPressed = (event) => {
    var code = event.keyCode || event.which
    if (code === 13 && search?.length > 0) {
      //13 is the enter keycode
      getSuggestions()
    }
  }

  const onClickCollection = (id) => {
    dispatch(updateSelectedCollectionId({ id }))
  }

  const mintDomain = async () => {
    try {
      setSwapping(true)
      if (domainInterval.current) {
        clearInterval(domainInterval.current)
      }
      if (isUnstopableDomain) {
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
      } else if (isSolanaDomain) {
        await registerSns(accessKey, payableAmount, payUsing, selectedDomain, userWalletAddress, size)
      } else if (isEnsDomain) {
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
      }
      setDomainPurchased(true)
    } catch (e) {
      // removeLockedDomain(accessKey, {
      //   name: selectedDomain.name,
      // })
      setSelectedDomain('')
      getSuggestions()
      toast({
        title: `Failed to mint`,
        description: e?.response?.data?.data || e.reason || e.message,
        status: 'error',
        duration: 1000,
      })
      console.log(e)
    } finally {
      setSwapping(false)
    }
  }

  const selectDuration = (time) => {
    setDuration(time)
  }

  const switchWallet = () => {
    if (isSolanaDomain) {
      if (!isSelectedWalletSolana(selectedWallet)) {
        return false
      } else {
        return true
      }
    } else if (isUnstopableDomain) {
      return true
    } else if (isEnsDomain) {
      if (isSelectedWalletSolana(selectedWallet)) {
        return false
      } else {
        return true
      }
    }
  }

  const switchWalletChild = () => {
    if (isSolanaDomain && !isSelectedWalletSolana(selectedWallet)) {
      return 'Connect Wallet'
    } else if (isEnsDomain && isSelectedWalletEvm(selectedWallet)) {
      return 'Connect to EVM Wallet'
    }
  }

  return (
    <Box>
      {(swapping || domainPurchased) && (
        <LoadingScreen>
          {domainPurchased && <StyledCloseIcon onClick={onClickClose} zIndex={1} />}
          <DomainMintingLoader
            completed={domainPurchased}
            message={() => (
              <>
                <Text fontSize={14} fontWeight={500}>
                  {`Minting ${selectedDomain.name} to ${
                    isSelectedWalletSolana(selectedWallet)
                      ? truncateAddress(userWalletAddress, 5)
                      : truncateAddress(account, 5)
                  }`}
                  .
                </Text>
                <Text fontSize={14} fontWeight={500}>
                  Please do not refresh the page.
                </Text>
                {isEnsDomain && (
                  <Flex flexDir={'column'} alignItems={'center'} mt="2">
                    <Text fontSize={14} fontWeight={600} mt="2">
                      Registering your domain takes three steps
                    </Text>
                    <Text fontSize={14} fontWeight={500} mt="2">
                      1. Complete the claim transaction to begin the process.
                    </Text>
                    <Text fontSize={14} fontWeight={500} mt="2">
                      2. Waits 60 seconds for the claim transaction to complete.
                    </Text>
                    <Text fontSize={14} fontWeight={500} mt="2">
                      3. Complete the register transaction to secure your name.
                    </Text>
                  </Flex>
                )}
              </>
            )}
          />
          {domainPurchased && (
            <PurchaseSuccess
              address={address}
              onClickCollection={onClickCollection}
              // showOffers={isUnstopableDomain ? selectedDomain?.discount > 0 : false}
              showOffers={false}
              website={() => {
                if (isUnstopableDomain) {
                  return 'https://unstoppabledomains.com'
                } else if (isEnsDomain) {
                  return 'https://ens.domains'
                } else if (isSolanaDomain) {
                  return 'https://sns.id/'
                }
              }}
              twitterHandle={() => {
                if (isUnstopableDomain) {
                  return '@unstoppableweb'
                } else if (isEnsDomain) {
                  return '@ensdomains'
                } else if (isSolanaDomain) {
                  return '@bonfida'
                }
              }}
              isEnsDomain={isEnsDomain}
            />
          )}
        </LoadingScreen>
      )}

      {/*<CollectionMintDetails collectionState={collectionState} />*/}

      <Flex mt={4}>
        <Input
          id="ud-search"
          placeholder="Search for your new domain"
          onChange={onChangeSearch}
          onKeyPress={enterPressed}
          size="md"
          autoComplete="off"
        />
        <Button size="md" variant={'primary'} cursor="pointer" onClick={getSuggestions} ml={3} mt={2}>
          Search
        </Button>
      </Flex>

      {!domainList?.length && !loading && <Empty />}
      {loading && <Loading />}

      {!!domainList?.length && (
        <Box>
          <Flex justifyContent="space-between" mt={4} alignItems={'center'}>
            <Text color="foreground" fontWeight={400} fontSize={14}>
              Pay using
            </Text>
            <Flex justifyContent="center" align="center" mb={2}>
              <Select
                value={payUsing?.value}
                size="sm"
                onChange={onClickCustomPay}
                borderColor="muted"
                borderWidth="1.5px"
                borderRadius="lg"
                boxShadow="base"
                _hover={{}}
              >
                {getPayableCurrency().map(({ label, value }) => (
                  <option value={value}>{label}</option>
                ))}
              </Select>
            </Flex>
          </Flex>

          <Box
            h={selectedDomain && isSelectedWalletSolana(selectedWallet) && !isSolanaDomain ? '100px' : '250px'}
            overflowY="auto"
            // pr={3}
            pt={2}
            position="relative"
          >
            {domainList.map((domain, index) => (
              <DomainItem
                key={index}
                domain={{ ...domain, name: isSolanaDomain ? domain?.name + '.sol' : domain?.name }}
                selected={domain.name === selectedDomain?.name}
                onSelect={() => onSelectDomain(domain)}
                onUnSelect={() => onSelectDomain('')}
                currency={payUsing?.ticker}
              />
            ))}
          </Box>

          {isSolanaDomain && (
            <StorageSlider
              size={size}
              setSize={setSize}
              onOpen={onSnsModalOpen}
              onClose={onSnsModalClose}
              isOpen={isSnsModalOpen}
              loading={isSubtotalLoading}
              subTotalPrice={subTotalPrice}
            />
          )}

          {isEnsDomain && (
            <DurationSelection
              selectedDomain={selectedDomain}
              duration={duration}
              selectDuration={selectDuration}
              onOpen={onEnsModalOpen}
              onClose={onEnsModalClose}
              isOpen={isEnsModalOpen}
              loading={loading}
              subTotalPrice={subTotalPrice}
              payUsing={payUsing}
            />
          )}

          {selectedDomain &&
            isSelectedWalletSolana(selectedWallet) &&
            isUnstopableDomain &&
            renderAddressInput({ address, setAddress })}

          <Box mt={'15px'}>
            <ActionButton
              validators={[
                // {
                //   should: switchWallet(),
                //   fallbackProps: {
                //     onClick: disconnectWallet,
                //     children: switchWalletChild(),
                //   },
                // },
                {
                  should: !!primaryAddress,
                  fallbackProps: {
                    onClick: () => {
                      const _chains = isUnstopableDomain ? ['EVM', 'SOL'] : isEnsDomain ? ['EVM'] : ['SOL']
                      setFilterChains(_chains)
                      setShowWallets(true)
                    },
                    children: 'Connect Wallet',
                  },
                },

                {
                  should: isSelectedWalletSolana(selectedWallet) ? true : checkNetwork(),
                  fallbackProps: {
                    onClick: requestNetworkSwitch,
                    children: 'Switch Network',
                  },
                },
                {
                  should: !!selectedDomain,
                  fallbackProps: {
                    onClick: () => {},
                    children: 'Select Domain',
                    disabled: true,
                  },
                },
                {
                  should: isSolanaDomain || !!address,
                  fallbackProps: {
                    onClick: () => {},
                    children: 'Enter Ethereum address..',
                    disabled: true,
                  },
                },

                {
                  should: isEnoughBalance,
                  fallbackProps: {
                    onClick: () => {},
                    children: 'Insufficient balance',
                    disabled: true,
                  },
                },
                {
                  should: !isFetchingLatestPrice,
                  fallbackProps: {
                    onClick: () => {},
                    children: 'Fetching best price..',
                    disabled: true,
                  },
                },
              ]}
              onClick={mintDomain}
            >
              <Box mr={'20px'}>
                <Text color="background" fontSize={12}>
                  {payableAmount} {payUsing.ticker}
                </Text>
                <Text color="background" textAlign="left" fontSize={'8px'} mt={'2px'}>
                  Total amount
                </Text>
              </Box>
              <Text color="background">Mint</Text>
            </ActionButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Domains
