import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Checkbox, Flex, Select, Text, useToast } from '@chakra-ui/react'
import { useConnect } from '@stacks/connect-react'
import { StacksMainnet, StacksTestnet } from '@stacks/network'
import { AnchorMode, createSTXPostCondition, FungibleConditionCode, PostConditionMode } from '@stacks/transactions'

import Counter from '../../../components/Counter'
import useMint from './hooks/useMint'
import useFetchAbi from './hooks/useFetchAbi'
import { DEFAULT_TOKEN_DECIMAL, NULL_ADDRESS } from '../../../constants'
import { BLOCK_EXPLORER, SupportedChainId } from '../../../constants/chains'
import { CHAIN_IDS_TO_NAMES, SUPPORTED_NETWORKS_NAMES } from '../../../constants/network'
import { useContract } from '../../../hooks/useContract'
import { MdOutlineLeaderboard } from 'react-icons/md'
import useMetaplex from '../../../hooks/useMetaplex'
import { useWallet } from '@solana/wallet-adapter-react'
import { updateMint, updateMintError } from '../../../state/collection/source'
import { useDispatch, useSelector } from 'react-redux'
import { Keypair, Transaction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import useToEvmSwap from '../Swap/useToEvmSwap'
import ActionButton from './ActionButton'
import MintingLoaderV2 from './comnponents/MintLoader'
import useStacks from '../../../components/WalletModal/hooks/useStacks'
import { capitalizeFirstLetter, numberToWords } from '../../../utils'
import ContestDetails from './comnponents/Contests/ContestDetails'
import useContest from './hooks/useContest'
import { getGaslessMintSignature, getMintSignature, updateContestClaim } from '../../../state/contest/source'
import useUser from './hooks/useUser'
import Participants from './comnponents/Participants'
import { useBalances } from '../Partners/hooks/useBalance'
import useSignature from '../../../hooks/useSignature'
import NFTView from '../components/NFTView'
import { useDisclosure } from '@chakra-ui/hooks'
import useWalletContext from '../../../components/WalletModal/hooks/useWalletContext'
import { updateSelectedSpaceId } from '../../../state/collection/reducer'
import useUmi from '../../../hooks/useUmi'
import useRelayer from '../../../hooks/useRelayer'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, some, transactionBuilder } from '@metaplex-foundation/umi'
import { toWeb3JsPublicKey, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters'
import MintConfirmation from './comnponents/MintConfirmation'
import { useConsumerContext } from '../../../hooks/useConsumerContext'

export const truncateAddress = (address) => {
  return address.slice(0, 4) + '..' + address.slice(-4)
}

function randomString(length) {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1)
}

const Widget = ({ collectionState, onClickClose, isCollectionFetching, clientConfig }) => {
  // const selectedWallet = useSelector((state) => state.user.selectedWallet)

  // const [showSolanaWallet, setShowSolanaWallet] = useState(false)
  // const [showStacksWallet, setShowStacksWallet] = useState(false)
  // const [showEvmWallet, setShowEvmWallet] = useState(false)
  const [loading, setLoading] = useState(false)

  const [agreeTnc, setAgreeTnc] = useState(false)
  const [swapStatus, setSwapStatus] = useState('start')
  const [mintStatus, setMintStatus] = useState('start')
  const [mintedTx, setMintedTx] = useState(null)
  const [swapTx, setSwapTx] = useState(null)
  const [payUsing, setPayUsing] = useState('default')
  const [mintedTokens, setMintedTokens] = useState([])
  const [mintPrice, setMintPrice] = useState(null)
  const [mintPriceUnit, setMintPriceUnit] = useState(null)
  const [refresh, setRefresh] = useState(false)

  const { account, provider } = useWeb3React()
  const {
    connected: solanaWalletConnected,
    publicKey,
    signAllTransactions,
    sendTransaction,
    signTransaction,
    signMessage,
  } = useWallet()
  const { stacksAddress } = useStacks()

  const { showWallets, setShowWallets, setFilterChains } = useWalletContext()
  const { config } = useConsumerContext()

  const { isOpen: isNFTViewOpen, onOpen: onOpenNFTView, onClose: onCloseNFTView } = useDisclosure()

  const { doContractCall, doSTXTransfer } = useConnect()

  const accessKey = useSelector((state) => state.user.accessKey)
  const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const toast = useToast()
  const dispatch = useDispatch()

  const { umi, candyMachineState, connection, solanaMintPrice, solanaMintPriceUnit, isFetching } =
    useUmi(collectionState)

  const {
    collectionId,
    contractAddress,
    chainId,
    mintPrice: preMintPrice,
    mintPriceUnit: preMintPriceUnit,
    mintFunction,
    abi,
    isButtonDisabled,
    buttonTitle,
    contract: collectionContract,
    isCollectionContest = false,
    contestMetaData,
    offChain = false,
    stats,
    isGasLessMint,
    spaceId,
  } = collectionState

  useEffect(() => {
    setMintPrice([9090, 9091].includes(chainId) ? solanaMintPrice : preMintPrice)
    setMintPriceUnit([9090, 9091].includes(chainId) ? solanaMintPriceUnit : preMintPriceUnit)
  }, [chainId, solanaMintPrice, solanaMintPriceUnit, preMintPrice, preMintPriceUnit])

  const { externalCurrencyEnabled } = clientConfig

  const { fetchUser } = useUser()

  const [signature, getSignature] = useSignature()

  const collectionContest = useContest({ collectionId, chainId, contestMetaData, isCollectionContest, refresh })
  const { user, eligibleModules } = collectionContest

  const internalAbi = useFetchAbi(isCollectionContest)
  const contract = useContract(contractAddress, !!abi ? abi : internalAbi)
  // const contract = null
  const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure()

  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure()

  const {
    isSolana,
    isStacks,
    isWrongNetwork,
    requestNetworkSwitch,
    setQuantity,
    quantity,
    totalPrice,
    estimateGasPrice,
  } = useMint({
    mintPrice,
    chainId,
    minQuantity: 1,
    collectionState,
  })

  const { initSwap, verifySwapComplete, renderEvmSwapDetails, requiredCustomAmountForEvm, isEvmSwapDetailsLoading } =
    useToEvmSwap({
      multiplier: quantity,
      chainId,
      amountIn: mintPrice,
      fromCurrency: payUsing,
      toCurrency: mintPriceUnit,
      estimateGasPrice,
      enabled: !isCollectionContest || !isCollectionFetching,
    })

  useEffect(() => {
    if (account || stacksAddress || publicKey) {
      fetchUser()
    }
  }, [account, stacksAddress, publicKey])

  useEffect(() => {
    if (publicKey && showWallets) {
      setShowWallets(false)
    }
  }, [publicKey])

  useEffect(() => {
    if (account && showWallets) {
      setShowWallets(false)
    }
  }, [account])

  const onClickCustomPay = (e) => {
    setPayUsing(e.target.value)
  }

  const onQuantityChange = (qty) => {
    setQuantity(qty)
  }
  const onQuantityError = () => {}

  const claimEvmModuleGasToken = async () => {
    try {
      setLoading(true)
      setMintStatus('pending')

      let _signature = signature
      if (!_signature) _signature = await getSignature()

      const {
        signature: txSignature,
        referenceId,
        totalQuantity,
      } = await getMintSignature(collectionId, account, eligibleModules, accessKey, _signature)

      if (chainId === SupportedChainId.SHARDEUM_SPHINX) {
        await updateContestClaim(collectionId, referenceId, 'receipt.transactionHash', accessKey, account, _signature)
        await updateMint(collectionId, accessKey, {
          walletAddress: account,
          transactionHash: '0x' + randomString(64),
          chainId,
          quantity: totalQuantity,
          price: 0,
          priceUnit: '',
          tokens: ['0'],
          signature: _signature,
        })
        setMintStatus('completed')

        setMintedTx(null)
      } else {
        const params = [
          '0x88471d036bd0ed558f7999ca1679c2cd21562987',
          '0x4750c7ddc7abe83f64a888fc6322ff522d359209',
        ].includes(contractAddress.toLowerCase())
          ? [txSignature, 5]
          : [txSignature, referenceId, totalQuantity]
        const transaction = await contract.claim(...params, {
          value: new BigNumber(mintPrice).multipliedBy(totalQuantity).multipliedBy(DEFAULT_TOKEN_DECIMAL).toFixed(),
        })
        const receipt = await transaction.wait()
        const events = receipt.events
        const filteredEvents = events.filter(
          (event) => event.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        )
        const tokens = filteredEvents.map((event) => parseInt(Number(event.topics[3])))
        setMintedTokens(tokens)
        await updateContestClaim(collectionId, referenceId, receipt.transactionHash, accessKey, account, _signature)
        await updateMint(collectionId, accessKey, {
          walletAddress: account,
          transactionHash: transaction.hash,
          chainId,
          quantity: totalQuantity,
          price: 0,
          priceUnit: '',
          tokens: tokens.length > 0 ? tokens : Array.from(Array(quantity).keys()),
          signature: _signature,
        })
        setMintStatus('completed')

        setMintedTx(transaction.hash)
      }
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

      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        setMintStatus('error')
      } else {
        setMintStatus('ignore')
      }
    } finally {
      setLoading(false)
    }
  }

  const claimEvmModuleGaslessToken = async () => {
    try {
      setLoading(true)
      setMintStatus('pending')

      let _signature = signature
      if (!_signature) {
        _signature = await getSignature()
      }

      const result = await getGaslessMintSignature(collectionId, account, eligibleModules, accessKey, _signature)
      if (!result) {
        return await claimEvmModuleGasToken()
      }
      const { referenceId, totalQuantity, transactionHash } = result

      if (chainId === SupportedChainId.SHARDEUM_SPHINX) {
        await updateContestClaim(collectionId, referenceId, 'receipt.transactionHash', accessKey, account, _signature)
        await updateMint(collectionId, accessKey, {
          walletAddress: account,
          transactionHash: '0x' + randomString(64),
          chainId,
          quantity: totalQuantity,
          price: 0,
          priceUnit: '',
          tokens: ['0'],
          signature: _signature,
        })
        setMintStatus('completed')

        setMintedTx(null)
      } else {
        await updateContestClaim(collectionId, referenceId, transactionHash, accessKey, account, _signature)
        await updateMint(collectionId, accessKey, {
          walletAddress: account,
          transactionHash,
          chainId,
          quantity: totalQuantity,
          price: 0,
          priceUnit: '',
          tokens: Array.from(Array(totalQuantity).keys()),
          signature: _signature,
        })
        setMintStatus('completed')

        setMintedTx(transactionHash)
      }
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

      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        setMintStatus('error')
      } else {
        setMintStatus('ignore')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const claimEvmModuleToken = async () => {
    try {
      if (!isGasLessMint) {
        return await claimEvmModuleGasToken()
      }
      await claimEvmModuleGaslessToken()
    } catch (error) {
      console.log(error)
    }
  }

  const claimSolanaModuleToken = async () => {
    try {
      setLoading(true)
      setMintStatus('pending')

      let _signature = signature
      if (!_signature) _signature = await getSignature()

      const { referenceId, totalQuantity, transactions } = await getMintSignature(
        collectionId,
        publicKey?.toBase58(),
        eligibleModules,
        accessKey,
        _signature,
      )

      let _signatures = []
      const txs = transactions?.map(async (tx, i) => {
        try {
          const mintTx = Transaction.from(Buffer.from(tx))
          const sig = await connection.sendRawTransaction(mintTx.serialize())
          console.log(`sig ${i}:`, sig)
          _signatures.push(sig)
        } catch (error) {
          console.log(error)
          throw new Error('Mint failed.')
        }
      })
      try {
        await Promise.all(txs)
      } catch (error) {
        console.log(error)
        throw new Error('Mint failed (Promise)')
      }
      // for (let i = 0; i < transactions?.length; i++) {
      // }

      await updateContestClaim(collectionId, referenceId, _signatures[0], accessKey, publicKey?.toBase58(), _signature)
      await updateMint(collectionId, accessKey, {
        walletAddress: publicKey?.toBase58(),
        transactionHash: _signatures[0],
        chainId,
        quantity: totalQuantity,
        price: 0,
        priceUnit: '',
        tokens: _signatures,
        signature: _signature,
      })

      setMintStatus('completed')

      setMintedTx(_signatures[0])
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

      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        setMintStatus('error')
      } else {
        setMintStatus('ignore')
      }
    } finally {
      setLoading(false)
    }
  }

  const claimModuleToken = async () => {
    if (isSolana) {
      await claimSolanaModuleToken()
    } else {
      await claimEvmModuleToken()
    }
  }

  const offChainMint = async () => {
    try {
      setLoading(true)
      let _signature = signature

      if (!_signature) {
        _signature = await getSignature()
      }
      await updateMint(
        collectionId,
        accessKey,
        {
          walletAddress: account,
          transactionHash: '0x' + randomString(64),
          chainId,
          quantity,
          price: mintPrice,
          priceUnit: mintPriceUnit,
          tokens: ['0'],
          signature: _signature,
        },
        true,
      )
      setMinted(true)
    } catch (e) {
      toast({
        title: `Failed to mint`,
        description: e.reason,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const prepareEvmMint = async () => {
    let needQuantity = true
    let needQuantityAndToAddress = false
    let isERC1155 = false
    let args = []

    const priceInWei = totalPrice.times(DEFAULT_TOKEN_DECIMAL).toString()
    const parsedAbi = !!abi ? JSON.parse(abi) : JSON.parse(internalAbi)
    const _mintFunction = !!mintFunction ? mintFunction : 'mint'
    const abiFunction = parsedAbi.find((item) => item.name === _mintFunction && item.type.toLowerCase() === 'function')

    if (!!abiFunction) {
      if (collectionContract.contractType === 'ERC1155') {
        if (abiFunction.inputs.length !== 2) {
          throw new Error(`${_mintFunction} function is not supported`)
        } else {
          isERC1155 = true
          args = [1, quantity]
        }
      } else {
        // ERC721
        if (abiFunction.inputs.length > 2 && _mintFunction !== 'mintWithRewards') {
          throw new Error(`${_mintFunction} function is not supported`)
        }
        needQuantity = abiFunction.inputs.length === 1
        needQuantityAndToAddress = abiFunction.inputs.length === 2
        args = abiFunction.inputs.map((a) => (a.type === 'address' ? account : quantity))
      }
    } else {
      throw new Error(`${_mintFunction} function is not available in contract`)
    }
    return {
      needQuantity,
      needQuantityAndToAddress,
      isERC1155,
      _mintFunction,
      priceInWei,
      args,
      account,
      contractAddress,
      chainId,
      abiFunction,
      abi: !!abi ? abi : internalAbi,
      quantity,
    }
  }

  const mint = async () => {
    if (offChain) return offChainMint()
    let isSwapComplete = false
    let isMintComplete = false
    try {
      setLoading(true)
      setSwapStatus('pending')
      // callBeforeMintWebhook(contractAddress, chainId, accessKey)
      let transaction = null

      let _signature = signature
      if (!_signature) {
        _signature = await getSignature()
      }

      // await new Promise((resolve) => {
      //   setTimeout(resolve, 3000)
      // })
      // // throw new Error('')

      // setSwapStatus('completed')
      // setSwapTx('a')
      // isSwapComplete = true

      // setMintStatus('pending')
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 3000)
      // })

      // setMintStatus('completed')
      // setMintedTx('a')
      // isMintComplete = true
      // return

      if (isSwapPaySupported && payUsing !== 'default') {
        const swapTrx = await initSwap(requiredCustomAmountForEvm)
        setSwapTx(swapTrx)
        const swapDetails = await verifySwapComplete(swapTrx, 100)
        if (swapDetails) {
          setSwapStatus('completed')
          isSwapComplete = true
        }
      }

      setMintStatus('pending')

      const { needQuantity, needQuantityAndToAddress, isERC1155, _mintFunction, args, priceInWei, quantity, account } =
        await prepareEvmMint()

      if (_mintFunction === 'mintWithRewards') {
        const referralAddress = config?.zoraReferralAddress?.length > 0 ? config?.zoraReferralAddress : NULL_ADDRESS
        transaction = await contract[_mintFunction](account, quantity, '', referralAddress, {
          value: priceInWei,
        })
      } else if (isERC1155) {
        transaction = await contract[_mintFunction](...args, {
          value: priceInWei,
        })
      } else if (needQuantityAndToAddress) {
        transaction = await contract[_mintFunction](...args, {
          value: priceInWei,
        })
      } else if (needQuantity) {
        transaction = await contract[_mintFunction](quantity, {
          value: priceInWei,
        })
      } else {
        transaction = await contract[_mintFunction]({
          value: priceInWei,
        })
      }

      setMintedTx(transaction.hash)
      const receipt = await transaction.wait()
      // const events = receipt.events.filter(({ event }) => event === 'Transfer')
      // const tokens = events.map(({ args }) => args[2]?.toString())

      const filteredEvents = receipt.events.filter(
        (event) => event.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      )
      const tokens = filteredEvents.map((event) => parseInt(Number(event.topics[3])))
      setMintedTokens(tokens)

      await updateMint(collectionId, accessKey, {
        walletAddress: account,
        transactionHash: transaction.hash,
        chainId,
        quantity,
        price: mintPrice,
        priceUnit: mintPriceUnit,
        tokens: tokens.length > 0 ? tokens : Array.from(Array(quantity).keys()),
        signature: _signature,
      })
      console.log('SETTING STATUS : COMPLETE')
      setMintStatus('completed')
      isMintComplete = true
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

      // "ser rejected" common between phantom & metamask
      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        if (!isSwapComplete) setSwapStatus('error')
        if (!isMintComplete) setMintStatus('error')
      } else {
        setMintStatus('ignore')
        setSwapStatus('ignore')
      }

      // throw new Error(e)
    } finally {
      setLoading(false)
    }
  }

  const transferAmountAndMint = async () => {
    try {
      setLoading(true)
      setMintStatus('pending')
      setSwapStatus('pending')
      const swapTrx = await initSwap(requiredCustomAmountForEvm)
      setSwapTx(swapTrx)
      const swapDetails = await verifySwapComplete(swapTrx, 100)
      if (swapDetails) {
        setSwapStatus('completed')
        await mint()
      }
    } catch (e) {
      setLoading(false)
      console.log(e)
      toast({
        title: 'something went wrong.',
        description: e.message,
        status: 'error',
      })

      const error = e?.reason ? e?.reason : e?.message

      const params = {
        errorLog: JSON.stringify({
          account: publicKey.toBase58(),
          error,
        }),
      }

      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        if (!mintedTx) setMintStatus('error')
        if (!swapTx) setSwapStatus('error')
      } else {
        setMintStatus('ignore')
        setSwapStatus('ignore')
      }
    } finally {
      setLoading(false)
    }
  }

  const mintStacks = async () => {
    try {
      setLoading(true)
      setMintStatus('pending')
      const totalPrice = new BigNumber(mintPrice).multipliedBy(quantity).multipliedBy(1000000).toNumber()
      const stxPostCondition = createSTXPostCondition(stacksAddress, FungibleConditionCode.Equal, totalPrice)
      const [contractAddressStr, contractName] = contractAddress.split('.')
      let functionName = 'claim'
      if (quantity > 1) {
        functionName = 'claim' + '-' + numberToWords(quantity)
      }

      const network = chainId === 6060 ? new StacksMainnet() : new StacksTestnet()

      doContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress: contractAddressStr.toUpperCase(),
        contractName,
        functionName,
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [stxPostCondition],
        onFinish: async (data) => {
          console.log(data)
          setLoading(false)
          setMintedTx(data.txId)
          setMintStatus('completed')

          updateMint(collectionId, accessKey, {
            walletAddress: stacksAddress,
            transactionHash: data.txId,
            chainId,
            quantity,
            price: mintPrice,
            priceUnit: mintPriceUnit,
            // tokens: [mint.nft.address.toBase58()],
          })
        },
        onCancel: (e) => {
          setLoading(false)
          toast({
            title: 'Transaction was canceled',
            description: '',
            status: 'error',
          })
        },
      })
    } catch (e) {
      setLoading(false)
      setMintStatus('error')
      const error = e?.reason ? e?.reason : e?.message

      const params = {
        errorLog: JSON.stringify({
          stacksAddress,
          error,
        }),
      }

      updateMintError(collectionId, accessKey, params)

      console.log(e)
      toast({
        title: 'Something went wrong!',
        description: e.message,
        status: 'error',
      })
    }
  }

  const mintSolana = useCallback(async () => {
    let isSwapComplete = false
    let isMintComplete = false
    try {
      if (!solanaWalletConnected || !candyMachineState) return

      setLoading(true)

      let _signature = signature
      if (!_signature) {
        _signature = await getSignature()
      }

      const recentBlockhash = await connection.getLatestBlockhash()

      let swapTx = null
      // let mintTx = new Transaction({
      //   recentBlockhash: recentBlockhash?.blockhash,
      // })

      const mintKeypair = Keypair.generate()

      if (payUsing !== 'default' && isSwapPaySupported && mintPriceUnit === 'SOL') {
        setSwapStatus('pending')
        const swapTrx = await initSwap(requiredCustomAmountForEvm)
        setSwapTx(swapTrx)
        const swapDetails = await verifySwapComplete(swapTrx, 100)
        if (swapDetails) {
          setSwapStatus('completed')
          isSwapComplete = true
        }
        //
        //
        //
        // const _mintPrice = new BigNumber(requiredCustomAmountForEvm)
        // const { transaction, signers } = await getSwapTx(_mintPrice)
        // swapTx = transaction
        // swapTx.feePayer = publicKey
        // swapTx.recentBlockhash = recentBlockhash?.blockhash
        // swapTx.partialSign(...signers)
        // swapTx.verifySignatures(false)
      }
      setMintStatus('pending')

      const nftMint = generateSigner(umi)
      const mintInx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachineState?.candyMachine?.publicKey,
            nftMint,
            candyGuard: candyMachineState?.candyGuard.publicKey,
            collectionMint: candyMachineState?.candyMachine?.collectionMint,
            collectionUpdateAuthority: candyMachineState?.candyMachine?.authority,
            mintArgs: {
              addressGate:
                candyMachineState?.candyGuard.guards.addressGate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.addressGate.value,
                    })
                  : null,
              allocation:
                candyMachineState?.candyGuard.guards.allocation.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.allocation.value,
                    })
                  : null,
              allowList:
                candyMachineState?.candyGuard.guards.allowList.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.allowList.value,
                    })
                  : null,
              botTax:
                candyMachineState?.candyGuard.guards.botTax.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.botTax.value,
                    })
                  : null,
              endDate:
                candyMachineState?.candyGuard.guards.endDate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.endDate.value,
                    })
                  : null,
              freezeSolPayment:
                candyMachineState?.candyGuard.guards.freezeSolPayment.__option === 'Some'
                  ? some({ ...candyMachineState?.candyGuard.guards.freezeSolPayment.value })
                  : null,
              freezeTokenPayment:
                candyMachineState?.candyGuard.guards.freezeTokenPayment.__option === 'Some'
                  ? some({ ...candyMachineState?.candyGuard.guards.freezeTokenPayment.value })
                  : null,
              gatekeeper:
                candyMachineState?.candyGuard.guards.gatekeeper.__option === 'Some'
                  ? some({
                      // TODO: tokenAccount missing
                      ...candyMachineState?.candyGuard.guards.gatekeeper.value,
                    })
                  : null,
              mintLimit:
                candyMachineState?.candyGuard.guards.mintLimit.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.mintLimit.value,
                    })
                  : null,

              // @ts-ignore TODO: mint, tokenStandard & tokenAccount missing
              nftBurn:
                candyMachineState?.candyGuard.guards.nftBurn.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.nftBurn.value,
                    })
                  : null,
              // @ts-ignore TODO: mint & tokenAccount missing
              nftGate:
                candyMachineState?.candyGuard.guards.nftGate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.nftGate.value,
                    })
                  : null,
              // @ts-ignore TODO: mint, tokenStandard, ruleSet & tokenAccount missing
              nftPayment:
                candyMachineState?.candyGuard.guards.nftPayment.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.nftPayment.value,
                    })
                  : null,
              programGate:
                candyMachineState?.candyGuard.guards.programGate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.programGate.value,
                    })
                  : null,
              redeemedAmount:
                candyMachineState?.candyGuard.guards.redeemedAmount.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.redeemedAmount.value,
                    })
                  : null,
              solPayment:
                candyMachineState?.candyGuard.guards.solPayment.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.solPayment.value,
                    })
                  : null,
              startDate:
                candyMachineState?.candyGuard.guards.startDate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.startDate.value,
                    })
                  : null,
              // @ts-ignore TODO: signer missing
              thirdPartySigner:
                candyMachineState?.candyGuard.guards.thirdPartySigner.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.thirdPartySigner.value,
                    })
                  : null,
              token2022Payment:
                candyMachineState?.candyGuard.guards.token2022Payment.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.token2022Payment.value,
                    })
                  : null,
              tokenBurn:
                candyMachineState?.candyGuard.guards.tokenBurn.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.tokenBurn.value,
                    })
                  : null,
              tokenGate:
                candyMachineState?.candyGuard.guards.tokenGate.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.tokenGate.value,
                    })
                  : null,
              tokenPayment:
                candyMachineState?.candyGuard.guards.tokenPayment.__option === 'Some'
                  ? some({
                      ...candyMachineState?.candyGuard.guards.tokenPayment.value,
                    })
                  : null,
            },
          }),
        )
        .getInstructions()
      const mintTransaction = umi.transactions.create({
        blockhash: recentBlockhash?.blockhash,
        instructions: mintInx,
        payer: publicKey,
      })
      const mintSignerSignedTransaction = await nftMint.signTransaction(mintTransaction)

      // const metaplexVersionMethod = cm && isV3(cm?.model) ? 'candyMachines' : 'candyMachinesV2'
      // const mintMethod = cm && isV3(cm?.model) ? 'mint' : 'newMint'
      // const isGroup = cm?.candyGuard?.groups?.length > 0
      // debugger
      // let mint = await metaplex[metaplexVersionMethod]()
      //   .builders()
      //   .mint({
      //     [mintMethod]: mintKeypair,
      //     candyMachine: cm,
      //     collectionUpdateAuthority: cm?.authorityAddress,
      //     group: isGroup ? 'Public' : undefined,
      //   })

      // mintTx.add(
      //   mint.toTransaction({
      //     blockhash: recentBlockhash.blockhash,
      //     lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
      //   }),
      // )

      // mintTx.feePayer = publicKey
      // mintTx.partialSign(mintKeypair)
      // mintTx.verifySignatures(false)

      let mintTx = toWeb3JsTransaction(mintSignerSignedTransaction)

      const txs = swapTx ? [swapTx, mintTx] : [mintTx]
      const signedTransactions = await signAllTransactions(txs)
      if (swapTx) {
        swapTx.verifySignatures(true)
      }

      let swapSignature = null
      if (swapTx) {
        swapSignature = await connection.sendRawTransaction(signedTransactions[0].serialize())
        setSwapTx(swapSignature)
      }
      const mintSignature = await connection.sendRawTransaction(signedTransactions[!!swapTx ? 1 : 0].serialize())

      setMintedTx(mintSignature)
      setMintStatus('completed')
      isMintComplete = true

      await updateMint(collectionId, accessKey, {
        walletAddress: publicKey.toBase58(),
        transactionHash: mintSignature,
        chainId,
        quantity,
        price: mintPrice,
        priceUnit: mintPriceUnit,
        tokens: [toWeb3JsPublicKey(nftMint.publicKey).toBase58()],
        signature: _signature,
      })

      // getCandyMachine(new PublicKey(cmId))
      //     .then((_cm) => {
      //       setCm(_cm);
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });
    } catch (e) {
      setLoading(false)
      console.log(e)
      toast({
        title: 'Something went wrong.',
        description: e.message,
        status: 'error',
      })

      const error = e?.reason ? e?.reason : e?.message

      const params = {
        errorLog: JSON.stringify({
          account: publicKey.toBase58(),
          error,
        }),
      }

      // "ser rejected" common between phantom & metamask
      if (!error.includes('ser rejected')) {
        updateMintError(collectionId, accessKey, params)
        if (!isSwapComplete) setSwapStatus('error')
        if (!isMintComplete) setMintStatus('error')
      } else {
        setMintStatus('ignore')
        setSwapStatus('ignore')
      }
    } finally {
      setLoading(false)
    }
  }, [candyMachineState, umi, toast, solanaWalletConnected, payUsing, signature])

  const resetStatus = () => {
    setSwapStatus('start')
    setSwapTx(null)
    setMintStatus('start')
    setMintedTx(null)
  }

  const isSwapPaySupported =
    [1, 56, 137, 5, 9090].includes(Number(chainId)) &&
    ['ETH', 'BNB', 'MATIC', 'SOL'].includes(mintPriceUnit) &&
    externalCurrencyEnabled &&
    !isCollectionContest

  const getPayableWallet = (onlyName = false) => {
    const wallet = isStacks ? 'stacks' : isSolana || (isSwapPaySupported && payUsing === 'BONK') ? 'Phantom' : 'evm'
    if (onlyName) {
      return wallet
    }
    return wallet === 'stacks' ? stacksAddress : wallet === 'Phantom' ? publicKey?.toBase58() : account
  }

  const getReceiverWallet = (onlyName = false) => {
    const wallet = isStacks ? 'stacks' : isSolana ? 'Phantom' : 'evm'
    if (onlyName) {
      return wallet
    }
    return wallet === 'stacks' ? stacksAddress : wallet === 'Phantom' ? publicKey?.toBase58() : account
  }

  const { balances } = useBalances({
    currency: isSwapPaySupported ? (payUsing === 'default' ? mintPriceUnit : payUsing) : mintPriceUnit,
    address: payUsing === 'BONK' ? 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' : null,
    tokenDecimals: payUsing === 'BONK' ? 5 : null,
    refresh,
  })

  const hasEnoughBalance = useCallback(() => {
    const currency = isSwapPaySupported ? (payUsing === 'default' ? mintPriceUnit : payUsing) : mintPriceUnit
    return new BigNumber(balances[currency]).gte(new BigNumber(mintPrice).toNumber())
  }, [isSwapPaySupported, payUsing, balances, mintPrice, refresh])

  const isFetchingCandyMachine = useCallback(() => {
    if (publicKey && !candyMachineState) {
      return !isFetching
    }
    return true
  }, [publicKey, isFetching])

  const seekConfirmation = () => {
    onOpenConfirmation()
  }

  const onMint = () => {
    onLoaderOpen()
    if (isCollectionContest) {
      claimModuleToken()
    } else if (isStacks) {
      mintStacks()
    } else if (isSolana) {
      mintSolana()
    } else {
      mint()
    }
  }

  return (
    <Box bg="background">
      {/* {(loading || mintStatus !== 'start') && (
        <MintingLoader
          isOpen={true}
          onClose={onLoaderClose}
          completed={mintStatus}
          price={mintPrice}
          viewNFT={chainId === SupportedChainId.SHARDEUM20 && mintStatus === 'completed'}
          // onClickNFTView={() => {
          //   onOpenNFTView()
          // }}
          collectionState={collectionState}
          list={[
            {
              title: `Swap`,
              completed: swapped,
              hasLink: !!swapTx,
              enable: isSwapPaySupported && payUsing !== 'default',
              link: isSwapPaySupported
                ? `https://explorer.mayan.finance/swap/${swapTx}/progress`
                : `${BLOCK_EXPLORER[9090]}tx/${swapTx}`,
            },
            {
              title: `Mint`,
              completed: mintStatus,
              hasLink: !!mintedTx,
              enable: true,
              link: isStacks
                ? `${BLOCK_EXPLORER[chainId]}txid/${mintedTx}${
                    chainId === SupportedChainId.STACKS_TESTNET ? '?chain=testnet' : ''
                  }`
                : `${BLOCK_EXPLORER[chainId]}tx/${mintedTx}${
                    chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
                  }`,
            },
          ]}
        />
      )} */}
      {/*<Flex>*/}
      {/*<CollectionMintDetails collectionState={collectionState} />*/}
      {isCollectionContest && (
        <Flex align="end" marginY={2} ml={1}>
          {spaceId && (
            <>
              <MdOutlineLeaderboard />
              <Text
                ml={1}
                fontSize="sm"
                cursor="pointer"
                onClick={() => {
                  dispatch(updateSelectedSpaceId({ id: spaceId }))
                }}
              >
                Leaderboard
              </Text>
            </>
          )}

          <Box ml="auto">
            <Participants accessKey={accessKey} collectionId={collectionId} />
          </Box>
        </Flex>
      )}

      {isCollectionContest && <ContestDetails collectionContest={collectionContest} modules={contestMetaData} />}
      {isSwapPaySupported && (
        <Flex justifyContent="space-between" mt={15}>
          <Text color="foreground" fontWeight={400} fontSize={14}>
            Pay using
          </Text>
          <Flex justifyContent="center" align="center">
            <Select
              borderColor="input"
              borderWidth="1.5px"
              borderRadius="lg"
              value={payUsing}
              size="sm"
              onChange={onClickCustomPay}
              _hover={{}}
            >
              <option value={'BONK'}>BONK (Solana)</option>
              <option value={'default'}>
                {' '}
                {mintPriceUnit ?? 'default'} ({capitalizeFirstLetter(CHAIN_IDS_TO_NAMES[chainId])})
              </option>
            </Select>
          </Flex>
        </Flex>
      )}
      {!isCollectionContest && !isSolana && !isStacks && (
        <Flex justifyContent="space-between" mt={15} alignItems="center">
          <Text color="foreground" fontWeight={400} fontSize={14}>
            Quantity
          </Text>
          <Counter
            initialState={1}
            maxState={100}
            onChange={onQuantityChange}
            onError={onQuantityError}
            value={quantity}
          />
        </Flex>
      )}
      {isStacks && (
        <Flex justifyContent="space-between" mt={15} alignItems="center">
          <Text color="foreground" fontWeight={400} fontSize={14}>
            Quantity
          </Text>
          <Box minWidth={100}>
            <Select size="sm" onChange={(e) => onQuantityChange(Number(e.target.value))} _hover={{}}>
              {(collectionContract?.allowedQuantities.split(',') || [1]).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      )}
      {/*<Flex justifyContent="space-between" mt={15} alignItems="center">*/}
      {/*  <Box>*/}
      {/*    <Text color="foreground" fontWeight={400} fontSize={14}>*/}
      {/*      Payment Wallet*/}
      {/*    </Text>*/}
      {/*    <Account selectedWallet={isSolana || payUsing === 'BONK' ? 'Phantom' : 'evm'} />*/}
      {/*  </Box>*/}
      {/*  <Box mt={'20px'}>*/}
      {/*    <ArrowForwardIcon boxSize={'24px'} />*/}
      {/*  </Box>*/}
      {/*  <Box>*/}
      {/*    <Text color="foreground" fontWeight={400} fontSize={14}>*/}
      {/*      Receivable Wallet*/}
      {/*    </Text>*/}
      {/*    <Account selectedWallet={isSolana ? 'Phantom' : 'evm'} />*/}
      {/*  </Box>*/}
      {/*</Flex>*/}
      {isSwapPaySupported && payUsing !== 'default' && <Box>{renderEvmSwapDetails()}</Box>}
      <Flex mt={4} justify="center">
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
      {/*{
          1) check payment and recievable wallets connected
          2) if recievable wallet on wrong chain
          3) initiate swap and mint for solana collection OR initiate swap and initiate transfer on evm
      }*/}
      <Box mt={'15px'}>
        <ActionButton
          validators={[
            {
              should: !!getPayableWallet(),
              fallbackProps: {
                onClick: () => {
                  getPayableWallet(true) === 'stacks'
                    ? setFilterChains('STACKS')
                    : getPayableWallet(true) === 'Phantom'
                    ? setFilterChains('SOL')
                    : setFilterChains('EVM')
                  setShowWallets(true)
                },
                children: 'Connect Payable Wallet',
              },
            },
            {
              should: isFetchingCandyMachine(),
              fallbackProps: {
                onClick: () => {},
                children: 'Fetching Candy Machine',
                disabled: true,
                isLoading: true,
              },
            },
            {
              should: !!getReceiverWallet(),
              fallbackProps: {
                onClick: () => {
                  getReceiverWallet(true) === 'stacks'
                    ? setFilterChains('STACKS')
                    : getReceiverWallet(true) === 'Phantom'
                    ? setFilterChains('SOL')
                    : setFilterChains('EVM')
                  setShowWallets(true)
                },
                children: 'Connect Receiver Wallet',
              },
            },
            {
              should: !(!isSolana && !isStacks && isWrongNetwork),
              fallbackProps: {
                onClick: requestNetworkSwitch,
                children: 'Change network',
                helperText: `Wrong Network! Please change the network to ${SUPPORTED_NETWORKS_NAMES[chainId]} network`,
              },
            },
            {
              should: hasEnoughBalance(),
              fallbackProps: {
                onClick: () => {},
                children: 'Insufficient balance',
                disabled: true,
              },
            },
            {
              should: !isEvmSwapDetailsLoading,
              fallbackProps: {
                children: 'Fetching best price',
                disabled: true,
                isLoading: true,
              },
            },
            {
              should: isCollectionContest ? !collectionContest.contestCompleted : true,
              fallbackProps: {
                children: 'Completed',
                disabled: true,
              },
            },
            {
              should: isCollectionContest ? collectionContest.isEligibleToMint : true,
              fallbackProps: {
                children: 'Perform Tasks',
                disabled: true,
              },
            },
            {
              should: stats?.maxSupply > 0 ? stats?.maxSupply > stats?.totalSupply : true,
              fallbackProps: {
                children: 'Sold out',
                disabled: true,
              },
            },

            {
              should: agreeTnc,
              fallbackProps: {
                disabled: true,
              },
            },
          ]}
          onClick={
            [1, 5, 137, 80001, 56, 97, 42161, 10, 420].includes(chainId) &&
            !isCollectionContest &&
            payUsing === 'default'
              ? seekConfirmation
              : onMint
          }
        >
          {!isCollectionContest && (
            <Box mr={'20px'}>
              <Text color="background" fontSize={12}>
                {isSwapPaySupported && payUsing !== 'default'
                  ? `${requiredCustomAmountForEvm} ${payUsing}`
                  : `${totalPrice.toString()} ${mintPriceUnit}`}
              </Text>
              <Text color="background" textAlign="left" fontSize={'8px'} mt={'2px'}>
                Total amount
              </Text>
            </Box>
          )}
          <Text color="background">
            {isCollectionContest ? `Claim ${collectionContest.tokensEligibleToClaim} NFT` : 'Mint'}
          </Text>
        </ActionButton>
      </Box>
      <NFTView
        isOpen={isNFTViewOpen}
        onClose={onCloseNFTView}
        onOpen={onOpenNFTView}
        mintedTokens={mintedTokens}
        contractAddress={contractAddress}
      />
      <MintingLoaderV2
        tag={collectionState?.collectionTag}
        resetStatus={resetStatus}
        isOpen={isLoaderOpen}
        onClose={() => {
          onLoaderClose()
          setRefresh(true)
          setTimeout(() => {
            setRefresh(false)
          }, 500)
        }}
        list={[
          {
            title: `Swap`,
            completed: swapStatus,
            hasLink: !!swapTx,
            enable: isSwapPaySupported && payUsing !== 'default',
            link: isSwapPaySupported
              ? `https://explorer.mayan.finance/swap/${swapTx}/progress`
              : `${BLOCK_EXPLORER[9090]}tx/${swapTx}`,
          },
          {
            title: `Mint`,
            completed: mintStatus,
            hasLink: !!mintedTx,
            enable: true,
            link: isStacks
              ? `${BLOCK_EXPLORER[chainId]}txid/${mintedTx}${
                  chainId === SupportedChainId.STACKS_TESTNET ? '?chain=testnet' : ''
                }`
              : `${BLOCK_EXPLORER[chainId]}tx/${mintedTx}${
                  chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
                }`,
          },
        ]}
      />
      {isConfirmationOpen && (
        <MintConfirmation
          isOpen={isConfirmationOpen}
          onClose={onCloseConfirmation}
          onMint={onMint}
          collectionState={collectionState}
          getTransactionDetails={prepareEvmMint}
        />
      )}
    </Box>
  )
}

export default Widget
