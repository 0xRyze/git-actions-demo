import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import ActionButton from '../../../Widget/ActionButton'
import { isSelectedWalletSolana } from '../../../../../utils/getWalletChain'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { SupportedEvmChains } from '../../../../../constants/chains'

interface Props {
  primaryAddress: any
  isUnstoppableDomain: boolean
  isEnsDomain: boolean
  isBnsDomain: boolean
  isSolanaDomain: boolean
  setFilterChains: any
  setShowWallets: any
  selectedWallet: any
  checkNetwork: () => any
  requestNetworkSwitch: () => Promise<void>
  selectedDomain: any
  address: any
  isEnoughBalance: boolean
  isFetchingLatestPrice: boolean
  payableAmount: any
  payUsing: any
  mintDomain: () => Promise<void>
  collectionChainId: number
}

const DomainActionButton: React.FC<Props> = ({
  primaryAddress,
  isUnstoppableDomain,
  isEnsDomain,
  isBnsDomain,
  isSolanaDomain,
  setFilterChains,
  setShowWallets,
  selectedWallet,
  checkNetwork,
  requestNetworkSwitch,
  selectedDomain,
  address,
  isEnoughBalance,
  isFetchingLatestPrice,
  payableAmount,
  payUsing,
  mintDomain,
  collectionChainId,
}) => {
  // const { chainId: connectedChainId } = useWeb3React()
  // const { connected } = useWallet()
  const getChainType = () => {
    if (isUnstoppableDomain) {
      return ['EVM', 'SOL']
    } else if (isEnsDomain || isBnsDomain) {
      return ['EVM']
    } else {
      return ['SOL']
    }
  }
  return (
    <Box mt={'4'}>
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
                const _chains = getChainType()
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
  )
}

export default DomainActionButton
