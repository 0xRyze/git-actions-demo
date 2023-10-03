import React, { useEffect, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import Counter from '../../components/Counter'
import Stage from './components/dynamicMint/Stage'
import ActionButton from './Widget/ActionButton'
import useDynamicMint from './hooks/useDynamicMint'
import { useWeb3React } from '@web3-react/core'
import useWalletContext from '../../components/WalletModal/hooks/useWalletContext'
import { LoadingScreen, StyledCloseIcon } from './Widget/styles'
import MintingLoader from './Widget/MintingLoader'
import { BLOCK_EXPLORER, SupportedChainId } from '../../constants/chains'
import { Checkbox } from '@chakra-ui/react'
import { SUPPORTED_NETWORKS_NAMES } from '../../constants/network'
import { switchChain } from '../../utils/switchChain'

const DynamicMint = ({ config, collectionState, onClickClose }) => {
  const [dynamicConfig, setDynamicConfig] = useState({})
  const [agreeTnc, setAgreeTnc] = useState(false)

  const { contract, mintPrice, mintPriceUnit, id: collectionId } = collectionState
  const { chainId, contractAddress } = contract
  const { connector, account, chainId: connectedChainId } = useWeb3React()
  const { showWallets, setShowWallets, setFilterChains } = useWalletContext()
  const isWrongNetwork = Number(chainId) !== Number(connectedChainId)

  const {
    stagesCompleted,
    selectedStage,
    changeSelectedStage,
    counterValue,
    setCounterValue,
    displayConfig,
    initiateMint,
    loading,
    mintStatus,
    mintedTx,
  } = useDynamicMint({
    collectionId,
    chainId,
    mintPrice,
    mintPriceUnit,
    dynamicConfig,
    contractAddress,
  })

  useEffect(() => {
    if (config) {
      try {
        const _c = JSON.parse(config)
        setDynamicConfig(_c)
      } catch (e) {}
    }
  }, [config])

  const requestNetworkSwitch = async () => {
    try {
      await switchChain(connector, Number(chainId))
    } catch (e) {
      console.log(e)
    }
  }

  if (!Object.keys(dynamicConfig).length) return 'Loading...'

  const { counter } = displayConfig

  return (
    <div>
      {(loading || mintStatus !== 'start') && (
        <LoadingScreen>
          {mintStatus && <StyledCloseIcon onClick={onClickClose} />}
          <MintingLoader
            completed={mintStatus}
            price={mintPrice}
            viewNFT={chainId === SupportedChainId.SHARDEUM20 && mintStatus === 'completed'}
            // onClickNFTView={() => {
            //   onOpenNFTView()
            // }}
            collectionState={collectionState}
            list={[
              {
                title: `Mint`,
                completed: mintStatus,
                hasLink: !!mintedTx,
                enable: true,
                link: `${BLOCK_EXPLORER[chainId]}tx/${mintedTx}${
                  chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
                }`,
              },
            ]}
          />
        </LoadingScreen>
      )}

      <Text marginY={4} fontSize={'md'} fontWeight={'medium'}>
        Mint Stages
      </Text>
      {dynamicConfig.mints.map((stage, index) => (
        <Stage
          onClick={() => changeSelectedStage(index)}
          isSelected={selectedStage?.id === stage.id}
          {...stage}
          chainId={chainId}
        />
      ))}

      <Flex marginY={4} justify="center">
        <Checkbox isChecked={agreeTnc} onChange={() => setAgreeTnc(!agreeTnc)}>
          <Text fontSize={12}>
            I understand that I am interacting with a third party’s Smart Contract and accept the{' '}
            <a
              target="_blank"
              href="https://bandit.network/legal/termsOfUse.pdf"
              style={{ fontWeight: 600 }}
              rel="noreferrer"
            >
              Terms of Use
            </a>
          </Text>
        </Checkbox>
      </Flex>

      <Flex align="flex-start" justify="space-between">
        {!!counter && counter?.visibility && (
          <Counter
            initialState={1}
            maxState={counter.max}
            onChange={setCounterValue}
            onError={() => {}}
            value={counterValue}
          />
        )}

        <Box width="full" ml={2}>
          <ActionButton
            fullWidth={true}
            validators={[
              {
                should: !!account,
                fallbackProps: {
                  onClick: () => {
                    setFilterChains('EVM')
                    setShowWallets(true)
                  },
                  children: 'Connect Payable Wallet',
                },
              },
              {
                should: !isWrongNetwork,
                fallbackProps: {
                  onClick: requestNetworkSwitch,
                  children: 'Change network',
                  helperText: `Wrong Network! Please change the network to ${SUPPORTED_NETWORKS_NAMES[chainId]} network`,
                },
              },
              {
                should: agreeTnc,
                fallbackProps: {
                  disabled: true,
                },
              },
            ]}
            onClick={initiateMint}
          >
            Mint
          </ActionButton>
        </Box>
      </Flex>
    </div>
  )
}

export default DynamicMint
