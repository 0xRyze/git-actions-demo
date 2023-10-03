import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from '../../../constants'
import { useContract } from '../../../hooks/useContract'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

const useDeployContractEvm = () => {
  const [contractFactory, setContractFactory] = useState({
    137: '0xFB1BD0E1acb649B043338B851C9f5D23507510A6',
    56: '0xFB1BD0E1acb649B043338B851C9f5D23507510A6',
    80001: '0xFB1BD0E1acb649B043338B851C9f5D23507510A6',
    8081: '0x45Acc156A08E02E188f1de17AeeF0303D7414da4',
    97: '0x0dc73c542F5C4896b2A11b1A48Ff64807cF489D1',
    40: '0x29E227d7Bc787FB9932C3549F5648a5cb590D76d',
    41: '0x29E227d7Bc787FB9932C3549F5648a5cb590D76d',
  })
  const { chainId } = useWeb3React()

  const accessKey = useSelector((state) => state.user.accessKey)

  // useEffect(() => {
  //   ;(async () => {
  //     if (!accessKey) return
  //     try {
  //       const res = await getContractFactoryAddresses(accessKey)
  //       setContractFactory(res)
  //     } catch (e) {}
  //   })()
  // }, [accessKey])

  // const contractAddress = "0xb72D334A46a459ad76a99aFf349150B74515c26d"

  const contractAddress = contractFactory ? contractFactory[chainId] : {}
  const contract = useContract(contractAddress, ERC721_ABI)

  const deployErc721Contract = useCallback(
    async (params) => {
      const { name, symbol, uri, price, maxSupply } = params
      const tx = await contract.deployNFTBase(
        name,
        symbol,
        uri,
        maxSupply,
        new BigNumber(price).multipliedBy(DEFAULT_TOKEN_DECIMAL).toFixed(),
      )

      const receipt = await tx.wait()

      return receipt.events[0]
    },
    [contract, BigNumber],
  )

  const deployOATContract = async (params) => {
    const { name, symbol, uri } = params

    const tx = await contract.deployNFTBaseWhitelisted(name, symbol, uri)

    const receipt = await tx.wait()

    return receipt.events[0]
  }
  const deployNFTBaseWhitelistedContract = async (params) => {
    const { name, symbol, uri, maxSupply, price, nftTransferBlocked } = params

    const tx = await contract.deployNFTBaseWhitelisted(
      name,
      symbol,
      uri,
      maxSupply,
      new BigNumber(price).multipliedBy(DEFAULT_TOKEN_DECIMAL).toFixed(),
      nftTransferBlocked,
    )

    const receipt = await tx.wait()

    return receipt.events[0]
  }

  return { deployErc721Contract, deployOATContract, deployNFTBaseWhitelistedContract }
}

export default useDeployContractEvm

const ERC721_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_URI',
        type: 'string',
      },
    ],
    name: 'deployAchievementToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_URI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_maxSupply',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'deployNFTBase',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_URI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_maxSupply',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_transfersBlocked',
        type: 'bool',
      },
    ],
    name: 'deployNFTBaseWhitelisted',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
