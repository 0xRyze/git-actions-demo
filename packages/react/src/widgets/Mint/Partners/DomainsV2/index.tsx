import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { environment } from '../../../..'
import useWalletContext from '../../../../components/WalletModal/hooks/useWalletContext'
import { isSelectedWalletSolana } from '../../../../utils/getWalletChain'
import { switchChain } from '../../../../utils/switchChain'
import {
  EVM_DEVNET_TOKENS,
  EVM_MAINNET_TOKENS,
  SOL_DEVNET_TOKENS,
  SOL_MAINNET_TOKENS,
} from '../constants/supportedCurrencies'
import { useBalances } from '../hooks/useBalance'
import BNS from './components/BNS'
import ENS from './components/ENS'
import SNS from './components/SNS'
import Unstoppable from './components/Unstoppable'

export const LoadingScreen: any = styled(Box)`
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

const SOL_CURRENCIES = isProd ? SOL_MAINNET_TOKENS : SOL_DEVNET_TOKENS
const EVM_CURRENCIES = isProd ? EVM_MAINNET_TOKENS : EVM_DEVNET_TOKENS

type PayUsing = {
  label: string
  value: string
  ticker: string
  address?: string
  chain: number
  decimals?: number
  id?: number
}

const PAY_USING_INITIAL_VALUES: PayUsing = {
  label: null,
  value: 'ETH',
  chain: null,
  ticker: 'ETH',
}

interface Props {
  onClickClose: () => void
  accessKey: any
  collectionState: any
  disconnectWallet: any
}

const DomainsV2: React.FC<Props> = ({ onClickClose, accessKey, collectionState, disconnectWallet }) => {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [domainList, setDomainList] = useState([])
  const [payUsing, setPayUsing] = useState<PayUsing>(PAY_USING_INITIAL_VALUES)
  const [selectedDomain, setSelectedDomain] = useState<any>('')
  const [swapping, setSwapping] = useState(false)
  const [domainPurchased, setDomainPurchased] = useState(false)
  const [isFetchingLatestPrice, setIsFetchingLatestPrice] = useState(false)
  const [isEnoughBalance, setIsEnoughBalance] = useState(false)
  const [payableAmount, setPayableAmount] = useState(0)
  const [isSubtotalLoading, setIsSubtotalLoading] = useState(false)
  const [subTotalPrice, setSubTotalPrice] = useState(0)
  const [size, setSize] = useState(1)
  const [duration, setDuration] = useState(1)
  const domainInterval = useRef()

  const { primaryAddress, selectedWallet, setShowWallets, setFilterChains } = useWalletContext()
  const { connection } = useConnection()
  const { chainId: connectedChainId, account } = useWeb3React()
  const userWalletAddress = primaryAddress

  const isSolanaDomain = collectionState?.domainId === 'sns'
  const isUnstoppableDomain = collectionState?.domainId === 'unstoppable'
  const isBnsDomain = collectionState?.domainId === 'bns'
  const isEnsDomain = collectionState?.domainId === 'ens'

  const { balances } = useBalances({
    currency: payUsing.value,
    address: payUsing.address,
    tokenDecimals: payUsing.decimals,
  })

  const onSelectDomain = (_domain: any) => {
    setSelectedDomain(_domain)
  }

  const toggleLoading = (_loading: boolean) => {
    setLoading(_loading)
  }

  const setDomains = (list: any[]) => {
    setDomainList(list)
  }

  const toggleFetchingLatestPrice = (_loading: boolean) => {
    setIsFetchingLatestPrice(_loading)
  }

  const onChangeSearch = (_search: string) => {
    setSearch(_search)
  }

  const changeSize = (_size: number) => {
    setSize(_size)
  }

  const changeDuration = (_duration: number) => {
    setDuration(_duration)
  }

  const getPayableCurrency = useCallback(() => {
    if (isSelectedWalletSolana(selectedWallet)) {
      return SOL_CURRENCIES
    } else {
      if (isEnsDomain) {
        return [EVM_CURRENCIES[0], EVM_CURRENCIES[1]]
      }
      return EVM_CURRENCIES
    }
  }, [selectedWallet, isEnsDomain])

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
    if (isBnsDomain) {
      return connectedChainId === collectionState?.chainId
    }
    return connectedChainId === payUsing.chain
  }

  const hasEnoughBalance = useCallback(
    (subTotalPrice = 0) => {
      if (!balances) return
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
    } else if (selectedDomain && isEnsDomain) {
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
  }, [connection, size, payUsing, isEnsDomain, selectedDomain, duration])

  const requestNetworkSwitch = async () => {
    try {
      await switchChain(selectedWallet.connector, payUsing.chain ? payUsing.chain : collectionState?.chainId)
    } catch (e) {
      console.log(e)
    }
  }

  const onClickCustomPay = useCallback(
    (e: any) => {
      const currencyList = getPayableCurrency()
      const selectedCurrency = currencyList.filter((c) => c.value === e.target.value)
      setPayUsing(selectedCurrency[0])
    },
    [getPayableCurrency],
  )

  const toggleSwapping = (_isSwapped: boolean) => {
    setSwapping(_isSwapped)
  }

  const setIsDomainPurchased = (_isPurchased: boolean) => {
    setDomainPurchased(_isPurchased)
  }

  useEffect(() => {
    if (isSelectedWalletSolana(selectedWallet)) {
      setPayUsing(SOL_CURRENCIES[0])
    } else {
      setPayUsing(EVM_CURRENCIES[0])
      setAddress(primaryAddress)
    }

    if (isBnsDomain) {
      setPayUsing(PAY_USING_INITIAL_VALUES)
    }

    return () => {
      if (domainInterval.current) {
        clearInterval(domainInterval.current)
      }
    }
  }, [selectedWallet, primaryAddress, isBnsDomain])

  useEffect(() => {
    getPayableAmount()
    hasEnoughBalance()
    getRent()
  }, [getPayableAmount, hasEnoughBalance, getRent])

  return (
    <Box w="full">
      {isSolanaDomain && (
        <SNS
          collectionState={collectionState}
          domainInterval={domainInterval}
          accessKey={accessKey}
          selectedDomain={selectedDomain}
          selectedWallet={selectedWallet}
          domainList={domainList}
          onSelectDomain={onSelectDomain}
          payUsing={payUsing}
          loading={loading}
          setDomains={setDomains}
          toggleLoading={toggleLoading}
          search={search}
          userWalletAddress={userWalletAddress}
          toggleFetchingLatestPrice={toggleFetchingLatestPrice}
          onChangeSearch={onChangeSearch}
          changeSize={changeSize}
          size={size}
          payableAmount={payableAmount}
          isSubtotalLoading={isSubtotalLoading}
          subTotalPrice={subTotalPrice}
          getPayableCurrency={getPayableCurrency}
          onClickCustomPay={onClickCustomPay}
          primaryAddress={primaryAddress}
          setFilterChains={setFilterChains}
          setShowWallets={setShowWallets}
          checkNetwork={checkNetwork}
          requestNetworkSwitch={requestNetworkSwitch}
          address={address}
          isEnoughBalance={isEnoughBalance}
          isFetchingLatestPrice={isFetchingLatestPrice}
          toggleSwapping={toggleSwapping}
          setIsDomainPurchased={setIsDomainPurchased}
          isSwapping={swapping}
          isDomainPurchased={domainPurchased}
        />
      )}

      {isEnsDomain && (
        <ENS
          collectionState={collectionState}
          domainInterval={domainInterval}
          accessKey={accessKey}
          selectedDomain={selectedDomain}
          selectedWallet={selectedWallet}
          domainList={domainList}
          onSelectDomain={onSelectDomain}
          payUsing={payUsing}
          loading={loading}
          setDomains={setDomains}
          toggleLoading={toggleLoading}
          search={search}
          userWalletAddress={userWalletAddress}
          toggleFetchingLatestPrice={toggleFetchingLatestPrice}
          onChangeSearch={onChangeSearch}
          changeDuration={changeDuration}
          duration={duration}
          payableAmount={payableAmount}
          isSubtotalLoading={isSubtotalLoading}
          subTotalPrice={subTotalPrice}
          getPayableCurrency={getPayableCurrency}
          onClickCustomPay={onClickCustomPay}
          primaryAddress={primaryAddress}
          setFilterChains={setFilterChains}
          setShowWallets={setShowWallets}
          checkNetwork={checkNetwork}
          requestNetworkSwitch={requestNetworkSwitch}
          address={address}
          isEnoughBalance={isEnoughBalance}
          isFetchingLatestPrice={isFetchingLatestPrice}
          toggleSwapping={toggleSwapping}
          setIsDomainPurchased={setIsDomainPurchased}
          isSwapping={swapping}
          isDomainPurchased={domainPurchased}
        />
      )}

      {isUnstoppableDomain && (
        <Unstoppable
          collectionState={collectionState}
          domainInterval={domainInterval}
          accessKey={accessKey}
          selectedDomain={selectedDomain}
          selectedWallet={selectedWallet}
          domainList={domainList}
          onSelectDomain={onSelectDomain}
          payUsing={payUsing}
          loading={loading}
          setDomains={setDomains}
          toggleLoading={toggleLoading}
          search={search}
          userWalletAddress={userWalletAddress}
          toggleFetchingLatestPrice={toggleFetchingLatestPrice}
          onChangeSearch={onChangeSearch}
          getPayableCurrency={getPayableCurrency}
          onClickCustomPay={onClickCustomPay}
          primaryAddress={primaryAddress}
          setFilterChains={setFilterChains}
          setShowWallets={setShowWallets}
          checkNetwork={checkNetwork}
          requestNetworkSwitch={requestNetworkSwitch}
          address={address}
          isEnoughBalance={isEnoughBalance}
          isFetchingLatestPrice={isFetchingLatestPrice}
          payableAmount={payableAmount}
          toggleSwapping={toggleSwapping}
          setIsDomainPurchased={setIsDomainPurchased}
          isSwapping={swapping}
          isDomainPurchased={domainPurchased}
          setAddress={setAddress}
        />
      )}

      {isBnsDomain && (
        <BNS
          collectionState={collectionState}
          domainInterval={domainInterval}
          accessKey={accessKey}
          selectedDomain={selectedDomain}
          selectedWallet={selectedWallet}
          domainList={domainList}
          onSelectDomain={onSelectDomain}
          payUsing={payUsing}
          loading={loading}
          setDomains={setDomains}
          toggleLoading={toggleLoading}
          search={search}
          userWalletAddress={userWalletAddress}
          toggleFetchingLatestPrice={toggleFetchingLatestPrice}
          onChangeSearch={onChangeSearch}
          getPayableCurrency={getPayableCurrency}
          onClickCustomPay={onClickCustomPay}
          primaryAddress={primaryAddress}
          setFilterChains={setFilterChains}
          setShowWallets={setShowWallets}
          checkNetwork={checkNetwork}
          requestNetworkSwitch={requestNetworkSwitch}
          address={address}
          isEnoughBalance={isEnoughBalance}
          isFetchingLatestPrice={isFetchingLatestPrice}
          payableAmount={payableAmount}
          toggleSwapping={toggleSwapping}
          setIsDomainPurchased={setIsDomainPurchased}
          isSwapping={swapping}
          isDomainPurchased={domainPurchased}
        />
      )}

      {/* {selectedDomain && isSelectedWalletSolana(selectedWallet) && isUnstoppableDomain && (
        <AddressInput address={address} setAddress={setAddress} />
      )} */}
    </Box>
  )
}

export default DomainsV2
