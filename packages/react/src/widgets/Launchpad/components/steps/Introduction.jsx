import React, { useCallback, useMemo } from 'react'
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { CHAIN_INFO } from '../../../../constants/chains'
import { CheckIcon } from '@chakra-ui/icons'
import { useCreateContext } from '../../hooks/useCreateContext'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { switchChain } from '../../../../utils/switchChain'
import { environment } from '../../../../context/BanditContext'

// const Schema = yup.object().shape({
//   chainId: yup.number(),
// })

const solanChainId = environment === 'production' ? 9090 : 9091

const Introduction = () => {
  const { supportedChains, createState, setCreateState, goToNext, isContest, setIsContest, isSolana } =
    useCreateContext()

  const { account, connector, chainId: connectedChainId } = useWeb3React()
  const dispatch = useDispatch()

  const { chainId } = createState.contract

  const _supportedChains = isSolana
    ? supportedChains.filter((chain) => chain === solanChainId)
    : supportedChains.filter((chain) => chain !== solanChainId)

  //
  // const { register, handleSubmit, watch, formState, reset, control, setValue, setError } = useForm({
  //   resolver: yupResolver(Schema),
  //   defaultValues: {
  //     chainId: 1,
  //   },
  // })

  const selectChain = (chainId) => {
    setCreateState((state) => ({
      ...state,
      contract: {
        ...state.contract,
        chainId,
      },
    }))
  }

  // const onConnectSuccess = useCallback(() => {
  //   setShowEvmWallet(false)
  // }, [setShowEvmWallet])
  //
  // const disconnectEvmWallet = () => {
  //   try {
  //     if (connector.deactivate) {
  //       connector.deactivate()
  //     } else {
  //       connector.resetState()
  //     }
  //     dispatch(updateSelectedWallet({ wallet: undefined }))
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const changeNetwork = useCallback(() => {
    try {
      switchChain(connector, chainId)
    } catch (e) {
      console.log(e)
    }
  }, [switchChain, chainId, connector])

  const wrongNetwork = useMemo(() => (isSolana ? false : connectedChainId !== chainId), [connectedChainId, chainId])
  // const disableProceed = useMemo(() => !account || wrongNetwork, [account, wrongNetwork])

  return (
    <>
      <Box>
        <Text fontWeight={'semibold'} fontSize={20} mb={4}>
          Let's launch your Collection / Contest!
        </Text>
        <Text fontWeight={'normal'} mb={2}>
          Which blockchain do you want to create your collection on?
        </Text>
        <Flex flexDir={'column'} w="full">
          {_supportedChains.map((supportedChain, index) => (
            <IconButton
              key={index}
              mt={index === 0 ? 0 : 4}
              w={['full', 'full', '50%', '50%', '50%']}
              variant="outline"
              colorScheme={chainId === supportedChain ? 'blue' : ''}
              icon={
                <Flex alignItems={'center'} justifyContent="space-between" w="full" mx="4">
                  <Text fontSize={['10', '16', '16', '16', '16']} mr="2" fontWeight={'normal'}>
                    {CHAIN_INFO[supportedChain]?.label}
                  </Text>
                  {chainId === supportedChain && <CheckIcon w="4" h="4" />}
                </Flex>
              }
              onClick={() => selectChain(supportedChain)}
            />
          ))}
        </Flex>
      </Box>
      {/*<Box mt={4}>*/}
      {/*  <Text fontWeight={500} mb={2}>*/}
      {/*    Which blockchain do you want to create your collection on?*/}
      {/*  </Text>*/}
      {/*  <Flex flexDir={'column'} w="full">*/}
      {/*    <IconButton*/}
      {/*      mt={0}*/}
      {/*      w="50%"*/}
      {/*      variant="outline"*/}
      {/*      colorScheme={isContest ? 'blue' : ''}*/}
      {/*      icon={*/}
      {/*        <Flex alignItems={'center'} justifyContent="space-between" w="full" mx="4">*/}
      {/*          <Text fontSize={['10', '16', '16', '16', '16']} mr="2">*/}
      {/*            NFT Contest*/}
      {/*          </Text>*/}
      {/*          {isContest && <CheckIcon w="4" h="4" />}*/}
      {/*        </Flex>*/}
      {/*      }*/}
      {/*      onClick={() => setIsContest(true)}*/}
      {/*    />*/}
      {/*    <IconButton*/}
      {/*      mt={4}*/}
      {/*      w="50%"*/}
      {/*      variant="outline"*/}
      {/*      colorScheme={!isContest ? 'blue' : ''}*/}
      {/*      icon={*/}
      {/*        <Flex alignItems={'center'} justifyContent="space-between" w="full" mx="4">*/}
      {/*          <Text fontSize={['10', '16', '16', '16', '16']} mr="2">*/}
      {/*            NFT Collection*/}
      {/*          </Text>*/}
      {/*          {!isContest && <CheckIcon w="4" h="4" />}*/}
      {/*        </Flex>*/}
      {/*      }*/}
      {/*      onClick={() => setIsContest(false)}*/}
      {/*    />*/}
      {/*  </Flex>*/}
      {/*</Box>*/}

      <Flex justifyContent="flex-end" mt="auto">
        {wrongNetwork ? (
          <Button size={'md'} variant={'primary'} onClick={changeNetwork}>
            Change Network
          </Button>
        ) : (
          <Button size={'md'} variant={'primary'} onClick={goToNext}>
            Proceed
          </Button>
        )}
      </Flex>
    </>
  )
}

export default Introduction
