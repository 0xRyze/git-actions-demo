import TokenIcon from '../../../../components/Svgs/tokenIcons'
import { CHAIN_INFO, SupportedChainId } from '../../../../constants/chains'
import { Flex, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import Select from '../../../../components/Select'
import { Box } from '@chakra-ui/layout'
import { useThemeDetector } from '../../../../hooks/useThemeDetector'
import { environment } from '../../../../context/BanditContext'

const testnetChains = [
  SupportedChainId.SOLANA_DEVNET,
  SupportedChainId.GOERLI,
  SupportedChainId.BINANCE_TESTNET,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.SHARDEUM20,
  SupportedChainId.STACKS_TESTNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.CORE_TESTNET,
  SupportedChainId.TELOS_TESTNET,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.AVALANCHE_TESTNET,
  SupportedChainId.ZORA_GOERLI,
]
const mainnetChains = [
  SupportedChainId.SOLANA,
  SupportedChainId.MAINNET,
  SupportedChainId.BINANCE,
  SupportedChainId.SHARDEUM20,
  SupportedChainId.POLYGON_MAINNET,
  SupportedChainId.STACKS_MAINNET,
  SupportedChainId.BASE_MAINNET,
  SupportedChainId.CORE_MAINNET,
  SupportedChainId.TELOS_MAINNET,
  SupportedChainId.OPTIMISM_MAINNET,
  SupportedChainId.ARBITRUM,
  SupportedChainId.AVALANCHE,
  SupportedChainId.ZORA_MAINNET,
]
// const chains = testnetChains

const ChainSelector = ({ chain, selectChain, allowedChains }) => {
  const isDarkTheme = useThemeDetector()
  const { isOpen, onOpen, onClose } = useDisclosure()
  let chains = environment === 'production' ? mainnetChains : testnetChains
  chains =
    allowedChains && !!allowedChains.length ? [...chains.filter((chain) => allowedChains.includes(chain))] : chains
  if (chains.length <= 1) return null

  const chainOptions = [
    {
      value: '',
      label: 'All Chains',
    },
    ...chains.map((c) => ({
      value: c,
      label: CHAIN_INFO[c]?.label,
      icon: <TokenIcon chainId={c} width={'15px'} height={'15px'} />,
    })),
  ]

  return (
    <Box w={'200px'}>
      <Select
        id="select-chain"
        options={chainOptions}
        onChange={({ value }) => selectChain(value)}
        defaultValue={chainOptions?.filter((o) => o.value === chain)[0]}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </Box>
  )

  return (
    <Flex
      h={8}
      w="fit-content"
      alignSelf={'flex-start'}
      borderRadius={'lg'}
      borderColor="input"
      borderWidth={'1.5px'}
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      whiteSpace="nowrap"
      borderStyle="solid"
      boxShadow={'base'}
    >
      <Flex _last={{ borderRight: 'initial' }} cursor="pointer" alignItems={'center'}>
        {chains.map((_chain, index) => {
          if (_chain === '') {
            return (
              <Text
                key={_chain}
                fontSize={'sm'}
                mb={'0'}
                fontWeight={'medium'}
                borderRadius="md"
                color={_chain === chain ? 'foreground' : 'foreground'}
                selected={_chain === chain}
                onClick={() => selectChain(_chain)}
                p="2"
                _hover={{ backgroundColor: 'muted !important' }}
                backgroundColor={chain === '' ? 'muted !important' : 'initial'}
              >
                All
              </Text>
            )
          }
          const bg = _chain === chain ? 'muted !important' : 'initial'
          return (
            <Flex
              key={index}
              // key={_chain}
              cursor="pointer"
              p="2"
              borderRadius="md"
              _hover={{ backgroundColor: 'muted !important' }}
              backgroundColor={bg}
              onClick={() => selectChain(_chain)}
              justifyContent="center"
              alignItems={'center'}
            >
              <TokenIcon width={18} height={18} chainId={_chain} dark={isDarkTheme} />
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default ChainSelector
