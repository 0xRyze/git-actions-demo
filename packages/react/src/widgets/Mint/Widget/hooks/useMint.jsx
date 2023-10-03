import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
// import dayjs from 'dayjs'
import { useWeb3React } from '@web3-react/core'
// import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'
// import { switchChain } from '../../../../utils/switchChain'
import { DEFAULT_TOKEN_DECIMAL } from '../../../../constants'
import { switchChain } from '../../../../utils/switchChain'
import useFetchAbi from './useFetchAbi'
import { getContract } from '../../../../utils/contracts'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { NETWORK_URLS } from '../../../../constants/network'

const estimateGasConfig = {
  [1]: {
    chainId: 1,
    address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
  },
  [4]: {
    chainId: 1,
    address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
  },
  [56]: {
    chainId: 56,
    address: '0xf977814e90da44bfa03b6295a0616a897441acec',
  },
  [97]: {
    chainId: 56,
    address: '0xf977814e90da44bfa03b6295a0616a897441acec',
  },
  [137]: {
    chainId: 137,
    address: '0x082489A616aB4D46d1947eE3F912e080815b08DA',
  },
}

const useMint = (props) => {
  const [quantity, setQuantity] = useState(1)

  const { account, chainId: connectedChainId, connector } = useWeb3React()
  const { chainId, mintPrice, startDate, minQuantity, collectionState } = props
  const balance = 0

  const internalAbi = useFetchAbi()

  const { abi, mintFunction, contractAddress } = collectionState

  useEffect(() => {
    if (minQuantity > 1) {
      setQuantity(minQuantity)
    }
  }, [minQuantity])
  const requestNetworkSwitch = async () => {
    try {
      // if (isSolana && ![SupportedChainId.SOLANA, SupportedChainId.SOLANA].includes(chainId)) {
      //   return onPresentConnectModal({
      //     onlyEvm: true,
      //     modalTitle: `Connect a wallet that supports ${
      //       [SupportedChainId.MAINNET, SupportedChainId.GOERLI].includes(chainId)
      //         ? 'Ethereum'
      //         : [SupportedChainId.BINANCE, SupportedChainId.BINANCE_TESTNET].includes(chainId)
      //         ? 'Binance'
      //         : 'Shardeum'
      //     }`,
      //   })
      // }

      await switchChain(connector, Number(chainId))
    } catch (e) {
      console.log(e)
    }
  }

  const setQty = (_quantity) => {
    setQuantity(_quantity)
  }

  const estimateGasPrice = async () => {
    try {
      const provider = new StaticJsonRpcProvider(NETWORK_URLS[estimateGasConfig[chainId].chainId])
      const contract = getContract(
        contractAddress,
        !!abi ? abi : internalAbi,
        provider,
        estimateGasConfig[chainId].address,
      )

      let needQuantity = true
      let needQuantityAndToAddress = false
      let args = []
      let gasLimit = null
      const parsedAbi = !!abi ? JSON.parse(abi) : JSON.parse(internalAbi)
      const _mintFunction = !!mintFunction ? mintFunction : 'mint'
      const abiFunction = parsedAbi.find(
        (item) => item.name === _mintFunction && item.type.toLowerCase() === 'function',
      )

      if (!!abiFunction) {
        if (abiFunction.inputs.length > 2) {
          throw new Error(`${_mintFunction} function is not supported`)
        }
        needQuantity = abiFunction.inputs.length === 1
        needQuantityAndToAddress = abiFunction.inputs.length === 2
        args = abiFunction.inputs.map((a) => (a.type === 'address' ? account : quantity))
      } else {
        throw new Error(`${_mintFunction} function is not available in contract`)
      }

      const priceInWei = new BigNumber(mintPrice).times(quantity).times(DEFAULT_TOKEN_DECIMAL).toString()

      if (needQuantityAndToAddress) {
        gasLimit = await contract.estimateGas[_mintFunction](...args, {
          value: priceInWei,
        })
      } else if (needQuantity) {
        gasLimit = await contract.estimateGas[_mintFunction](quantity, {
          value: priceInWei,
        })
      } else {
        gasLimit = await contract.estimateGas[_mintFunction]({
          value: priceInWei,
        })
      }

      const gasPrice = await provider.getGasPrice()

      const gasPriceInWei = new BigNumber(gasLimit.toNumber())
        .multipliedBy(gasPrice.toNumber())
        .dividedBy(DEFAULT_TOKEN_DECIMAL)
        .toNumber()
      return {
        gasLimit,
        gasPrice,
        gasPriceInWei,
      }
    } catch (e) {
      console.log(e)
    }
  }

  // const hasMintStarted = dayjs.unix(startDate).isBefore(dayjs())
  const isWrongNetwork = Number(chainId) !== Number(connectedChainId)
  const lowBalance =
    Number(new BigNumber(mintPrice).times(quantity).times(DEFAULT_TOKEN_DECIMAL).toString()) >=
    Number(balance.toString())
  const totalPrice = new BigNumber(mintPrice).times(quantity)

  const isSolana = [9090, 9091].includes(chainId)
  const isStacks = [6060, 6061].includes(chainId)

  return {
    isSolana,
    isStacks,
    isWrongNetwork,
    requestNetworkSwitch,
    lowBalance,
    setQuantity: setQty,
    // hasMintStarted,
    quantity,
    totalPrice,
    estimateGasPrice,
  }
}

export default useMint
