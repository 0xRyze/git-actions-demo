import { Box, Button, Flex, Select, Skeleton, Text } from '@chakra-ui/react'
import React, { Suspense } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { CHAIN_INFO } from '../../constants/chains'
import ConnectedWallet from '../Mint/components/ConnectedWallet'
import { environment } from '../../context/BanditContext'

const CreateCollection = React.lazy(() => import('./CreateCollection'))

const MAINNET_CHAINS = [
  {
    label: CHAIN_INFO[1].label, // Ethereum Mainnet
    value: 1,
  },
  {
    label: CHAIN_INFO[137].label, // Polygon Mainnet
    value: 137,
  },
  {
    label: CHAIN_INFO[8082].label, // Shardeum Sphinx
    value: 8082,
  },
  {
    label: CHAIN_INFO[56].label, // Binance Mainnet
    value: 56,
  },
]

const TESTNET_CHAINS = [
  {
    label: CHAIN_INFO[5].label, // Goerli
    value: 5,
  },
  {
    label: CHAIN_INFO[80001].label, // Mumbai
    value: 80001,
  },
  {
    label: CHAIN_INFO[8081].label, // Shardeum.2
    value: 8081,
  },
  {
    label: CHAIN_INFO[97].label, // Binance
    value: 97,
  },
]

const isProd = environment === 'production'
const CHAINS = isProd ? MAINNET_CHAINS : TESTNET_CHAINS

const CreatorStudioHeader = (props) => {
  const { account } = useWeb3React()
  const { publicKey: solanaAccount } = useWallet()
  const { changeActionType, onOpen, isWhitelisted, selectedChainId, changeChain, isLoading } = props
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      justifyContent={'space-between'}
      alignItems={'center'}
      mb="4"
      mt="2"
      //   position={['initial', 'initial', 'absolute', 'absolute', 'absolute']}
      //   right="6"
      //   top="16px"
    >
      <Text fontSize={'20'} fontWeight={'semibold'}>
        Creator Studio
      </Text>
      <Flex
        w={['full', 'full', 'initial']}
        mt={['4', '4', '4', '0', '0']}
        justifyContent={['space-between', 'space-between', 'space-between', 'space-between', 'space-between']}
        flexDir={['column', 'row']}
      >
        <Box>
          {isLoading ? (
            <>
              <Skeleton
                w={['full', '40']}
                h="8"
                mr={['0', '0', '4', '4', '4']}
                mb={['4', '0', '0', '0', '0']}
                borderRadius={'8'}
                startColor="muted"
                endColor="input"
              />
            </>
          ) : (
            <>
              {(account || solanaAccount) && isWhitelisted && (
                <>
                  <Button
                    variant="primary"
                    w={['full', 'initial']}
                    size={'sm'}
                    mr={['0', '0', '4', '4', '4']}
                    mb={['4', '0', '0', '0', '0']}
                    onClick={() => {
                      changeActionType('create')
                      onOpen()
                    }}
                  >
                    Create Collection/Contest
                  </Button>
                  <Suspense fallback={null}>
                    <CreateCollection {...props} />
                  </Suspense>
                </>
              )}
            </>
          )}
        </Box>
        {account && (
          <Select
            value={selectedChainId}
            onChange={(e) => changeChain(e.target.value)}
            display={['initial', 'none']}
            size={'sm'}
            w={['full', '40']}
            borderColor="input"
            placeholder="Select Chain"
            mr={['0', '4', '4', '4', '4']}
            mb={['4', '0', '0', '0', '0']}
            borderRadius={'6'}
            _hover={{}}
          >
            {CHAINS.map(({ label, value }) => (
              <option value={value}>{label}</option>
            ))}
          </Select>
        )}
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Box />
          {account && (
            <Select
              value={selectedChainId}
              defaultValue={selectedChainId}
              onChange={(e) => changeChain(e.target.value)}
              display={['none', 'initial']}
              size={'sm'}
              w={['full', '40']}
              borderColor="input"
              placeholder="Select Chain"
              mr={['0', '4', '4', '4', '4']}
              // mb={['4', '0', '0', '0', '0']}
              borderRadius={'6'}
              _hover={{}}
            >
              {CHAINS.map(({ label, value }) => (
                <option value={value}>{label}</option>
              ))}
            </Select>
          )}
          <ConnectedWallet />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CreatorStudioHeader
