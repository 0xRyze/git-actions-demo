import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { DigitalAsset, fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { generateSigner, publicKey, some, transactionBuilder } from '@metaplex-foundation/umi'
import {
  fromWeb3JsPublicKey,
  fromWeb3JsTransaction,
  toWeb3JsPublicKey,
  toWeb3JsTransaction,
} from '@metaplex-foundation/umi-web3js-adapters'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, VersionedTransaction } from '@solana/web3.js'
import React, { useCallback, useEffect, useState } from 'react'
import useUmi, { CandyMachineState } from '../../../../../hooks/useUmi'
import { useSelector } from 'react-redux'
import useWalletContext from '../../../../../components/WalletModal/hooks/useWalletContext'
import { BLOCK_EXPLORER, SupportedChainId } from '../../../../../constants/chains'
import { updateMint, updateMintError } from '../../../../../state/collection/source'
import MintingLoader from '../../MintingLoader'
import { LoadingScreen, StyledCloseIcon } from '../../styles'
import {
  ADAM_APE_FIRST_VERIFIED_CREATOR,
  ADAM_APE_UPDATE_AUTHORITY,
  SAGE_ADMIN_DEV,
  SAGE_ADMIN_PROD,
  SAGE_WHITELIST_TOKEN,
} from './data'
import { getSageTransactions } from './source'
import { environment } from '../../../../../context/BanditContext/BanditContext'

const images = {
  curious: {
    uri: 'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/e0081ea7-444d-4ac9-1ee0-d158bebf0000/medium',
    id: 0,
  },
  dabbler: {
    uri: 'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/ccd18ebc-bd52-47f0-5c4f-ff65e33e2700/medium',
    id: 1,
  },
  degen: { uri: 'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/141f7c99-6700-41b5-9e50-1eff78eb2b00/medium', id: 2 },
}

interface Props {
  collectionState: any
  onClickClose: any
  isCollectionFetching: boolean
  clientConfig: any
}

const isProd = environment === 'production'

const Sage: React.FC<Props> = ({ collectionState, onClickClose, isCollectionFetching, clientConfig }) => {
  const [agreeTnc, setAgreeTnc] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adamApes, setAdamApes] = useState(null)
  const [gas, setGas] = useState('sol')
  const [requiredBat, setRequiredBat] = useState(0)
  const [selectedType, setSelectedType] = useState<'curious' | 'dabbler' | 'degen'>()
  const [selectedAdamApes, setSelectedAdamApes] = useState<{
    curious: DigitalAsset
    dabbler: DigitalAsset
    degen: DigitalAsset
  }>({
    curious: null,
    dabbler: null,
    degen: null,
  })
  const [holdsWhitelistToken, setHoldsWhitelistToken] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [mintStatus, setMintStatus] = useState('start')
  const [prepare, setPrepare] = useState('start')
  const [mintedTx, setMintedTx] = useState(null)
  const [mintAddress, setMintAddress] = useState(null)
  const [isEnoughBalance, setIsEnoughBalance] = useState(false)
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()

  const { showWallets, setShowWallets, setFilterChains, selectedWallet } = useWalletContext()

  const { umi, connection, candyMachineState, isFetching: isCandyMachineLoading } = useUmi(collectionState)
  // @ts-ignore
  const { collectionId, chainId, mintPrice, mintPriceUnit } = collectionState

  const toast = useToast()
  const walletAdapter = useWallet()
  const accessKey = useSelector((state: any) => state.user.accessKey)

  const fetchAdamApeNfts = useCallback(async () => {
    try {
      if (!walletAdapter.connected || !walletAdapter.publicKey || !umi || !candyMachineState) {
        throw new Error('')
      }
      setIsFetching(true)
      setLoadingText('Fetching Assets')

      // if (gas === 'bat') {
      //   setLoadingText('Fetching BAT Balance')
      //   const batPriceObj = await getBatPrice()
      //   // console.log('batPrice', batPriceObj)
      //   const BAT = new PublicKey(BAT_TOKEN)

      //   const batTokenAccountAddress = getAssociatedTokenAddressSync(BAT, walletAdapter.publicKey)

      //   const batTokenAccount = await connection.getTokenAccountsByOwner(walletAdapter.publicKey, { mint: BAT })

      //   if (batTokenAccount.value.length !== 0) {
      //     const batBal = parseInt((await connection.getTokenAccountBalance(batTokenAccountAddress)).value.amount)
      //     // console.log('BAT BALANCE:', batBal)
      //     // TODO: CHANGE TO RIGHT AMOUNT
      //     const _requiredBat = 0.000025 * parseInt(batPriceObj.rate) * 10 ** 8
      //     // console.log(batBal, 0.000025 * parseInt(batPriceObj.rate) * 10 ** 8)
      //     setRequiredBat(_requiredBat)
      //     if (batBal > 0.000025 * parseInt(batPriceObj.rate) * 10 ** 8) {
      //       setIsEnoughBalance(true)
      //     } else {
      //       setIsEnoughBalance(false)
      //     }
      //   }
      // } else if (gas === 'sol') {
      //   setLoadingText('Fetching SOL Balance')
      //   const solBal = await connection.getBalance(walletAdapter.publicKey)
      //   if (solBal > 20000) {
      //     setIsEnoughBalance(true)
      //   } else {
      //     setIsEnoughBalance(false)
      //   }
      // }

      const allAssets = await fetchAllDigitalAssetByOwner(umi, fromWeb3JsPublicKey(walletAdapter.publicKey))

      // TODO: Change update auth and first creator
      const adamApeNfts = allAssets.filter((asset) => {
        if (
          toWeb3JsPublicKey(asset.metadata.updateAuthority).toBase58() === ADAM_APE_UPDATE_AUTHORITY &&
          asset.metadata.creators.__option === 'Some' &&
          toWeb3JsPublicKey(asset.metadata.creators.value[0].address).toBase58() === ADAM_APE_FIRST_VERIFIED_CREATOR &&
          asset.metadata.creators.value[0].verified
        ) {
          return asset
        }
      })

      if (adamApeNfts.length > 0) {
        const curious = adamApeNfts.filter((nft) => nft.metadata.name.includes('The Curious'))

        const dabbler = adamApeNfts.filter((nft) => nft.metadata.name.includes('The Dabbler'))

        const degen = adamApeNfts.filter((nft) => nft.metadata.name.includes('The Degen'))
        setAdamApes({ curious, dabbler, degen })
      } else {
        throw new Error('')
      }

      // TODO: Need to change
      const whitelistMint = new PublicKey(SAGE_WHITELIST_TOKEN)
      const whitelistTokenAccount = getAssociatedTokenAddressSync(whitelistMint, walletAdapter.publicKey)

      const whitelistTokenAcc = await connection.getParsedTokenAccountsByOwner(walletAdapter.publicKey, {
        mint: whitelistMint,
      })

      if (whitelistTokenAcc.value.length !== 0) {
        const tokenAccountBalance = await connection.getTokenAccountBalance(whitelistTokenAccount)

        //   console.log(tokenAccountBalance.value.amount)
        if (Number(tokenAccountBalance.value.amount) > 0) {
          setHoldsWhitelistToken(true)
        }
      }
    } catch (error) {
      // console.log(error)
      setHoldsWhitelistToken(false)
      setAdamApes(null)
      setSelectedAdamApes({
        curious: null,
        dabbler: null,
        degen: null,
      })
    } finally {
      setIsFetching(false)
    }
  }, [umi, walletAdapter.connected, walletAdapter.publicKey, candyMachineState, gas])

  useEffect(() => {
    fetchAdamApeNfts()
  }, [fetchAdamApeNfts])

  useEffect(() => {
    if (walletAdapter.publicKey && showWallets) {
      setShowWallets(false)
    }
  }, [walletAdapter.publicKey])

  const getMintTransaction = useCallback(
    async (blockhash: string, candyMachineState: CandyMachineState) => {
      try {
        if (!umi) {
          throw new Error('')
        }
        // TODO: MINT SAGE
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
          blockhash,
          instructions: mintInx,
          payer: isProd ? publicKey(SAGE_ADMIN_PROD) : publicKey(SAGE_ADMIN_DEV),
        })
        // const mintSignerSignedTransaction = await nftMint.signTransaction(mintTransaction)

        const serializedMintTransaction = Array.from(toWeb3JsTransaction(mintTransaction).serialize())
        return {
          nftMint,
          serializedMintTransaction,
        }
      } catch (error) {
        throw error
      }
    },
    [umi],
  )

  const mint = useCallback(async () => {
    try {
      if (!umi || !candyMachineState || !walletAdapter.connected || !agreeTnc) return
      onConfirmClose()
      setLoading(true)
      setMintedTx(null)
      setMintAddress(null)
      setMintStatus('pending')
      setPrepare('pending')

      const blockhash = (await umi.rpc.getLatestBlockhash()).blockhash

      let isBurnTransaction = false

      if (selectedAdamApes.curious && selectedAdamApes.dabbler && selectedAdamApes.degen && !holdsWhitelistToken) {
        setLoadingText('Transferring BAT')
        isBurnTransaction = true
      }

      const { nftMint, serializedMintTransaction } = await getMintTransaction(blockhash, candyMachineState)

      const transactions = await getSageTransactions(
        walletAdapter.publicKey.toBase58(),
        toWeb3JsPublicKey(selectedAdamApes.curious.publicKey).toBase58(),
        toWeb3JsPublicKey(selectedAdamApes.dabbler.publicKey).toBase58(),
        toWeb3JsPublicKey(selectedAdamApes.degen.publicKey).toBase58(),
        serializedMintTransaction,
        gas === 'sol' ? true : false,
      )

      const { serializedUnifiedTransaction } = transactions
      setPrepare('completed')

      const unifiedTransaction = VersionedTransaction.deserialize(Buffer.from(serializedUnifiedTransaction, 'base64'))

      const mintSignedUnifiedTransaction = toWeb3JsTransaction(
        await nftMint.signTransaction(fromWeb3JsTransaction(unifiedTransaction)),
      )

      // console.log(mintSignedUnifiedTransaction)
      const signedTransaction = await walletAdapter.signTransaction(mintSignedUnifiedTransaction)
      // console.log(signedTransaction)

      setLoadingText('Minting Sage')
      console.log('Mint:', toWeb3JsPublicKey(nftMint.publicKey).toBase58())
      const mintSignature = await umi.rpc.sendTransaction(fromWeb3JsTransaction(signedTransaction), {
        skipPreflight: false, // TODO: change
      })
      //   setLoadingText('Waiting for Mint Confirmations')
      await umi.rpc.confirmTransaction(mintSignature, {
        strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
        commitment: 'finalized',
      })
      const [mintSig] = base58.deserialize(mintSignature)
      console.log(mintSig)

      setMintedTx(mintSig)
      setMintStatus('completed')

      setMintAddress(toWeb3JsPublicKey(nftMint.publicKey).toBase58())

      await updateMint(collectionId, accessKey, {
        walletAddress: walletAdapter.publicKey.toBase58(),
        transactionHash: mintSig,
        chainId,
        quantity: 1,
        price: mintPrice,
        priceUnit: mintPriceUnit,
        tokens: [toWeb3JsPublicKey(nftMint.publicKey).toBase58()],
      })
    } catch (e) {
      console.log(e)
      toast({
        title: 'Something went wrong.',
        description: e.message,
        status: 'error',
      })

      const error = e?.reason ? e?.reason : e?.message

      const params = {
        errorLog: JSON.stringify({
          account: walletAdapter.publicKey.toBase58(),
          error,
        }),
      }

      if (!error.includes('User rejected the request')) {
        updateMintError(collectionId, accessKey, params)
        setMintStatus('error')
        setPrepare('error')
      } else {
        setMintStatus('start')
        setPrepare('start')
      }
    } finally {
      setLoading(false)
      setSelectedAdamApes({ curious: null, dabbler: null, degen: null })
      setAgreeTnc(false)
      setLoadingText('')
    }
  }, [candyMachineState, walletAdapter.connected, umi, toast, agreeTnc, selectedAdamApes, getMintTransaction, gas])

  const connectWallet = () => {
    setFilterChains('SOL')
    setShowWallets(true)
  }

  const isEnabled = useCallback(() => {
    if (
      walletAdapter.connected &&
      walletAdapter.publicKey &&
      isEnoughBalance &&
      selectedAdamApes?.curious &&
      selectedAdamApes?.dabbler &&
      selectedAdamApes?.degen &&
      agreeTnc
    ) {
      return true
    } else {
      false
    }
  }, [
    walletAdapter.connected,
    walletAdapter.publicKey,
    isEnoughBalance,
    selectedAdamApes?.curious,
    selectedAdamApes?.dabbler,
    selectedAdamApes?.degen,
    agreeTnc,
  ])

  const mintButton = useCallback(() => {
    if (!walletAdapter.publicKey || !walletAdapter.connected) {
      return 'Connect Payable Wallet'
    }
    // if (!isEnoughBalance) {
    //   return `Insufficient ${gas === 'sol' ? 'SOL' : 'BAT'} Balance`
    // }
    if (holdsWhitelistToken) {
      if (!agreeTnc) {
        return 'Agree Terms of Use'
      }
      return 'Claim'
    }
    if (!selectedAdamApes?.curious) {
      return 'Select Curious'
    }
    if (!selectedAdamApes?.dabbler) {
      return 'Select Dabbler'
    }
    if (!selectedAdamApes?.degen) {
      return 'Select Degen'
    }
    if (!agreeTnc) {
      return 'Agree Terms of Use'
    }
    return 'Claim'
  }, [holdsWhitelistToken, agreeTnc, selectedAdamApes, walletAdapter, isEnoughBalance, gas])

  const isMintDisabled = useCallback(() => {
    if (!walletAdapter.publicKey || !walletAdapter.connected) {
      return false
    }
    // if (!isEnoughBalance) {
    //   return true
    // }
    if (isCandyMachineLoading || loading || !agreeTnc) {
      return true
    }
    if (holdsWhitelistToken) {
      return false
    }
    if (!selectedAdamApes?.curious || !selectedAdamApes?.dabbler || !selectedAdamApes?.degen) {
      return true
    }
  }, [loading, agreeTnc, holdsWhitelistToken, selectedAdamApes, walletAdapter, isCandyMachineLoading, isEnoughBalance])

  const selectApe = (type: string, ape: any) => {
    setSelectedAdamApes({ ...selectedAdamApes, [type]: ape })
  }

  const mintHandler = () => {
    onConfirmOpen()
  }

  return (
    <Box flexDir={'column'}>
      {(loading || mintStatus !== 'start') && (
        <LoadingScreen>
          {mintStatus !== 'pending' && prepare !== 'pending' && <StyledCloseIcon onClick={onClickClose} />}
          <MintingLoader
            completed={mintStatus}
            price={mintPrice}
            viewNFT={false}
            collectionState={collectionState}
            // @ts-ignore
            sage={{ mintAddress, chainId }}
            list={[
              {
                title: `Preparing Transaction`,
                completed: prepare,
                hasLink: false,
                enable: true,
                isTransaction: false,
              },
              {
                title: `Minting Sage`,
                completed: mintStatus,
                hasLink: !!mintedTx,
                enable: true,
                link: `${BLOCK_EXPLORER[chainId]}tx/${mintedTx}${
                  chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
                }`,
                isTransaction: false,
              },
            ]}
          />
        </LoadingScreen>
      )}
      {/* <CollectionMintDetails collectionState={collectionState} /> */}
      {!isFetching || !isCollectionFetching ? (
        <Flex
          my="4"
          borderColor={'black'}
          borderWidth={'1px'}
          borderStyle={'solid'}
          borderRadius={'12'}
          minH={['32', '48', '56']}
          pos="relative"
          //   overflow={'hidden'}
        >
          {selectedType && (
            <Icon
              as={ArrowBackIcon}
              w="5"
              h="5"
              pos="absolute"
              top="2"
              left="2"
              cursor={'pointer'}
              onClick={() => setSelectedType(undefined)}
            />
          )}
          <Flex
            justifyContent={'space-around'}
            w="full"
            py="10"
            display={selectedType === undefined ? 'flex' : 'none'}
            opacity={holdsWhitelistToken ? 0.4 : 1}
          >
            {selectedType === undefined && (
              <>
                <Flex
                  flexDir={'column'}
                  alignItems={'center'}
                  borderWidth={'1px'}
                  borderColor={'mutedForeground'}
                  borderStyle={'solid'}
                  borderRadius={'8'}
                  cursor={holdsWhitelistToken ? 'not-allowed' : 'pointer'}
                  onClick={holdsWhitelistToken ? () => {} : () => setSelectedType('curious')}
                  pos={'relative'}
                  h={['fit-content']}
                  w={['80px', '28', 'fit-content']}
                  p="2"
                >
                  {selectedAdamApes?.curious && (
                    <Icon pos="absolute" right="-2" top="-2" as={CheckCircleIcon} w="5" h="5" color="green" />
                  )}
                  <Image
                    src={images.curious.uri}
                    w={['14', '20', '32', '36']}
                    h={['14', '20', '32', '36']}
                    borderRadius={'8'}
                  />
                  <Text mt="2" fontSize={['10', '12', '14']} textAlign={'center'}>
                    {selectedAdamApes?.curious ? selectedAdamApes?.curious?.metadata?.name : `Select Curious`}
                  </Text>
                </Flex>
                <Flex
                  flexDir={'column'}
                  alignItems={'center'}
                  borderWidth={'1px'}
                  borderColor={'mutedForeground'}
                  borderStyle={'solid'}
                  borderRadius={'8'}
                  cursor={holdsWhitelistToken ? 'not-allowed' : 'pointer'}
                  onClick={holdsWhitelistToken ? () => {} : () => setSelectedType('dabbler')}
                  pos={'relative'}
                  h={['fit-content']}
                  w={['80px', '28', 'fit-content']}
                  p="2"
                >
                  {selectedAdamApes?.dabbler && (
                    <Icon pos="absolute" right="-2" top="-2" as={CheckCircleIcon} w="5" h="5" color="green" />
                  )}
                  <Image
                    src={images.dabbler.uri}
                    w={['14', '20', '32', '36']}
                    h={['14', '20', '32', '36']}
                    borderRadius={'8'}
                  />
                  <Text mt="2" fontSize={['10', '12', '14']} textAlign={'center'}>
                    {selectedAdamApes?.dabbler ? selectedAdamApes?.dabbler?.metadata?.name : `Select Dabbler`}
                  </Text>
                </Flex>
                <Flex
                  flexDir={'column'}
                  alignItems={'center'}
                  borderWidth={'1px'}
                  borderColor={'mutedForeground'}
                  borderStyle={'solid'}
                  borderRadius={'8'}
                  cursor={holdsWhitelistToken ? 'not-allowed' : 'pointer'}
                  onClick={holdsWhitelistToken ? () => {} : () => setSelectedType('degen')}
                  pos={'relative'}
                  h={['fit-content']}
                  w={['80px', '28', 'fit-content']}
                  p="2"
                >
                  {selectedAdamApes?.degen && (
                    <Icon pos="absolute" right="-2" top="-2" as={CheckCircleIcon} w="5" h="5" color="green" />
                  )}
                  <Image
                    src={images.degen.uri}
                    w={['14', '20', '32', '36']}
                    h={['14', '20', '32', '36']}
                    borderRadius={'8'}
                  />
                  <Text mt="2" fontSize={['10', '12', '14']} textAlign={'center'}>
                    {selectedAdamApes?.degen ? selectedAdamApes?.degen?.metadata?.name : `Select Degen`}
                  </Text>
                </Flex>
              </>
            )}
          </Flex>
          <Flex w="full" overflowX={'scroll'} p="4" py={['8', '10']} display={selectedType ? 'flex' : 'none'}>
            {adamApes && adamApes?.[selectedType]?.length > 0
              ? adamApes?.[selectedType]?.map((ape: DigitalAsset, index: number) => (
                  <Flex
                    key={index}
                    flexDir={'column'}
                    alignItems={'center'}
                    borderWidth={'1px'}
                    borderColor={'mutedForeground'}
                    borderStyle={'solid'}
                    borderRadius={'8'}
                    cursor={'pointer'}
                    p="2"
                    minW={['24', '36', '40']}
                    minH={['24', '36', '40']}
                    mx="2"
                    pos={'relative'}
                    onClick={() => {
                      if (
                        adamApes?.[selectedType]?.[index]?.publicKey === selectedAdamApes?.[selectedType]?.publicKey
                      ) {
                        return setSelectedAdamApes({ ...selectedAdamApes, [selectedType]: undefined })
                      }
                      setSelectedType(undefined)
                      selectApe(selectedType, ape)
                      const _apes = [
                        ape,
                        ...adamApes?.[selectedType]?.slice(0, index),
                        ...adamApes?.[selectedType]?.slice(index + 1, adamApes?.[selectedType]?.length),
                      ]
                      setAdamApes({ ...adamApes, [selectedType]: _apes })
                    }}
                  >
                    {adamApes?.[selectedType]?.[index]?.publicKey === selectedAdamApes?.[selectedType]?.publicKey && (
                      <Icon pos="absolute" right="-2" top="-2" as={CheckCircleIcon} w="5" h="5" color="green" />
                    )}
                    <Image
                      src={images[selectedType].uri}
                      w={['14', '20', '32', '36']}
                      h={['14', '20', '32', '36']}
                      borderRadius={'8'}
                    />
                    <Text mt="2" fontSize={['10', '12', '14']} textAlign={'center'}>
                      {ape?.metadata?.name}
                    </Text>
                  </Flex>
                ))
              : selectedType && (
                  <Flex
                    color="brand.400"
                    w="full"
                    justifyContent={'center'}
                    alignItems={'center'}
                    p={['14', '16', '20']}
                  >
                    <Text p={['0', '2.5', '1']}>{`No ${selectedType} found`}</Text>
                  </Flex>
                )}
          </Flex>
        </Flex>
      ) : (
        <Skeleton
          my="4"
          borderColor={'black'}
          borderWidth={'1px'}
          borderStyle={'solid'}
          borderRadius={'12'}
          minH={['40', '46', '64']}
          pos="relative"
        />
      )}

      <Text mt="-3" fontSize={'12'} textAlign={'center'}>
        To obtain a SAGE NFT, you must select one NFT from each category: Curious, Dabbler & Degen.
      </Text>
      <Flex mt={4} justify="center">
        <Checkbox colorScheme="gray" borderColor={'black'} isChecked={agreeTnc} onChange={() => setAgreeTnc(!agreeTnc)}>
          <Text fontSize={12}>
            I understand that I am interacting with a Bandit’s Smart Contract and accept the{' '}
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
      {holdsWhitelistToken && (
        <Text textAlign={'center'} fontSize={'12'} mt="4">
          You are eligible to claim
        </Text>
      )}
      {/* <Flex mb="1" mt="4">
        <Text fontSize={'12'}>Pay gas using</Text>
      </Flex> */}
      <Flex justifyContent={'center'}>
        {/* <Flex
          px="1"
          bg="muted"
          w="fit-content"
          borderRadius={'6'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Button
            bg={gas === 'sol' ? 'background' : 'initial'}
            size={'sm'}
            color="foreground"
            mx="1"
            px="3"
            onClick={() => setGas('sol')}
            _hover={{ backgroundColor: gas === 'sol' ? 'background' : 'initial', color: 'foreground' }}
            variant={'ghost'}
            fontWeight={'medium'}
          >
            SOL
          </Button>
          <Button
            bg={gas === 'bat' ? 'background' : 'initial'}
            size={'sm'}
            color="foreground"
            mx="1"
            px="3"
            onClick={() => setGas('bat')}
            _hover={{ backgroundColor: gas === 'bat' ? 'background' : 'initial', color: 'foreground' }}
            variant={'ghost'}
            fontWeight={'medium'}
          >
            BAT
          </Button>
        </Flex> */}
        <Button
          mt="4"
          // w="full"
          isDisabled={isMintDisabled()}
          onClick={!walletAdapter?.connected ? connectWallet : mintHandler}
          isLoading={loading || isCandyMachineLoading || isFetching}
          loadingText={isCandyMachineLoading ? 'Fetching Candy Machine' : loadingText}
        >
          {/* {isEnabled() && (
            <Flex flexDir={'column'} mr="4">
              <Text fontSize={'12'}>
                {gas === 'sol' ? '0.00002 SOL' : `${(requiredBat / 10 ** 8).toPrecision(4)} BAT`}
              </Text>
              <Text fontSize={'8'} color="gray.200">
                Total Gas
              </Text>
            </Flex>
          )} */}
          {mintButton()}
        </Button>
      </Flex>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered closeOnOverlayClick={false} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            <Flex justifyContent="center" w="full" flexDir={'column'}>
              <Text fontSize={'14'}>
                Are you sure you want to proceed and burn the selected NFTs in exchange for Sage? Please note that this
                transaction is irreversible.
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant="outline" onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button onClick={mint}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Sage
