import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useContract } from '../../../hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useToast } from '@chakra-ui/react'
import { updateMint, updateMintError } from '../../../state/collection/source'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from '../../../constants'
import { useConsumerContext } from '../../../hooks/useConsumerContext'
import useSignature from '../../../hooks/useSignature'

const useDynamicMint = ({ dynamicConfig, contractAddress, mintPrice, chainId, collectionId, mintPriceUnit }) => {
  const [counterValue, setCounterValue] = useState(1)
  const [selectedStage, setSelectedStage] = useState(null)
  const [stagesCompleted, setStagesCompleted] = useState(false)
  const [displayConfig, setDisplayConfig] = useState({
    counter: null,
  })

  const [loading, setLoading] = useState(false)
  const [mintStatus, setMintStatus] = useState('start')
  const [mintedTx, setMintedTx] = useState(null)

  const { account } = useWeb3React()
  const { accessKey } = useConsumerContext()
  const [signature, getSignature] = useSignature()

  const toast = useToast()

  const contract = useContract(contractAddress, !!dynamicConfig && !!dynamicConfig.abi ? dynamicConfig.abi : [])

  useEffect(() => {
    if (!!Object.keys(dynamicConfig).length) {
      const filterEnded = dynamicConfig.mints.filter((m) =>
        m.endless ? true : !dayjs.unix(m.endDate).isBefore(dayjs()),
      )
      if (!!filterEnded.length) {
        setSelectedStage(filterEnded[0])
      } else {
        setStagesCompleted(true)
      }
    }
  }, [dynamicConfig])

  useEffect(() => {
    if (selectedStage) {
      const hasCounter = selectedStage.inputs.find((input) => input.category.toLowerCase() === 'counter')

      setDisplayConfig({
        counter: hasCounter,
      })
    }
  }, [selectedStage])

  const changeSelectedStage = useCallback(
    (index) => {
      setSelectedStage(dynamicConfig.mints[index])
    },
    [dynamicConfig],
  )
  const initiateMint = useCallback(async () => {
    try {
      setLoading(true)
      setMintStatus('pending')

      let _signature = signature
      if (!_signature) {
        _signature = await getSignature()
      }

      const { method, inputs, payable } = selectedStage
      let params = inputs.map((input) => {
        if (input.category.toLowerCase() === 'input') {
          if (input.type.toLowerCase() === 'address' || input.type.toLowerCase() === 'text') {
            return input.defaultValue
          } else if (input.type.toLowerCase() === 'user_address') {
            return account
          }
        } else if (input.category.toLowerCase() === 'counter') {
          return counterValue
        }
      })

      if (payable) {
        params = [
          ...params,
          {
            value: new BigNumber(mintPrice).multipliedBy(counterValue).multipliedBy(DEFAULT_TOKEN_DECIMAL).toFixed(),
          },
        ]
      }

      const transaction = await contract[method](...params)
      setMintedTx(transaction.hash)

      const receipt = await transaction.wait()

      const filteredEvents = receipt.events.filter(
        (event) => event.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      )
      const tokens = filteredEvents.map((event) => parseInt(Number(event.topics[3])))

      await updateMint(collectionId, accessKey, {
        walletAddress: account,
        transactionHash: transaction.hash,
        chainId,
        counterValue,
        price: mintPrice,
        priceUnit: mintPriceUnit,
        tokens: tokens.length > 0 ? tokens : Array.from(Array(counterValue).keys()),
        signature: _signature,
      })
      setMintStatus('completed')
    } catch (e) {
      console.log(e)
      if (e.reason) {
        toast({
          title: `Failed to mint`,
          description: e.reason,
          status: 'error',
          duration: 5000,
        })
      } else {
        toast({
          title: `Failed to mint`,
          description: e.message,
          status: 'error',
          duration: 5000,
        })
      }

      const error = e?.reason ? e?.reason : e?.message

      const params = {
        errorLog: JSON.stringify({
          account,
          error,
        }),
      }

      if (!error.includes('user rejected transaction')) {
        setMintStatus('error')
        updateMintError(collectionId, accessKey, params)
      } else {
        setMintStatus('start')
      }
    } finally {
      setLoading(false)
    }
  }, [contract, account, counterValue, selectedStage, mintPrice, chainId, collectionId, accessKey])

  return {
    selectedStage,
    changeSelectedStage,
    displayConfig,
    counterValue,
    setCounterValue,
    initiateMint,
    loading,
    mintStatus,
    mintedTx,
    stagesCompleted,
  }
}

export default useDynamicMint
