import React, { useCallback, useEffect, useState } from 'react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSet,
  fetchCandyGuard,
  mplCandyMachine,
  safeFetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@chakra-ui/react'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { publicKey, Umi } from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey, toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { getAssociatedTokenAddressSync, getMint } from '@solana/spl-token'
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

export type CandyMachineState = {
  candyMachine: CandyMachine
  candyGuard: CandyGuard<DefaultGuardSet>
}

export const getUrls = (network: number | string, sig?: string, type?: 'address' | 'tx') => {
  if (network === 'devnet' || network === 9091) {
    return {
      rpc: 'https://skilled-damp-glade.solana-devnet.discover.quiknode.pro/5eab58b431f2edb5c03a4a04e1cec02848871190/',
      bundlrAddress: 'https://devnet.bundlr.network',
      bundlrProviderUrl:
        'https://skilled-damp-glade.solana-devnet.discover.quiknode.pro/5eab58b431f2edb5c03a4a04e1cec02848871190/',
      explorer: `https://solscan.io/${type}/${sig}?cluster=devnet`,
    }
  } else if (network === 'mainnet-beta' || network === 9090) {
    return {
      rpc: 'https://hardworking-billowing-vineyard.solana-mainnet.quiknode.pro/ae90631560d354cd50a156c970ca5899b4cc2ab2/',
      bundlrAddress: 'https://node1.bundlr.network',
      bundlrProviderUrl:
        'https://hardworking-billowing-vineyard.solana-mainnet.quiknode.pro/ae90631560d354cd50a156c970ca5899b4cc2ab2/',
      explorer: `https://solscan.io/${type}/${sig}`,
    }
  } else {
    return {
      rpc: 'http://127.0.0.1:8899',
      bundlrAddress: 'https://devnet.bundlr.network',
      bundlrProviderUrl: clusterApiUrl('devnet'),
      explorer: `https://solscan.io/${type}/${sig}?cluster=custom`,
    }
  }
}

const useUmi = (dbCollectionState: any) => {
  const walletAdapter = useWallet()
  const toast = useToast()
  const [connection, setConnection] = useState<Connection>()
  const [umi, setUmi] = useState<Umi>()
  const [isFetching, setIsFetching] = useState(false)
  const [candyMachineState, setCandyMachineState] = useState<CandyMachineState>()
  const [solanaMintPrice, setSolanaMintPrice] = useState<any>()
  const [solanaMintPriceUnit, setSolanaMintPriceUnit] = useState<string>()

  const {
    chainId,
    contract: { candyMachineId },
    mintPrice: preMintPrice,
    mintPriceUnit: preMintPriceUnit,
  } = dbCollectionState

  useEffect(() => {
    if (chainId && walletAdapter.publicKey) {
      if ([9090, 9091].includes(chainId)) {
        const _network = chainId === 9091 ? 'devnet' : 'mainnet-beta'
        const _connection = new Connection(getUrls(_network).rpc)
        // const _connection = new Connection('http://127.0.0.1:8899') // TODO: revert
        setConnection(_connection)
        setUmi(createUmi(getUrls(_network).rpc).use(mplCandyMachine()).use(walletAdapterIdentity(walletAdapter)))
        // setUmi(createUmi('http://127.0.0.1:8899').use(mplCandyMachine()).use(walletAdapterIdentity(walletAdapter)))
      }
    }
  }, [walletAdapter, chainId])

  const getCandyMachine = useCallback(
    async (cmId: string) => {
      try {
        if (!umi || !cmId || !walletAdapter.publicKey) return
        const candyMachinePublicKey = publicKey(fromWeb3JsPublicKey(new PublicKey(cmId)))
        const candyMachine = await safeFetchCandyMachine(umi, candyMachinePublicKey)
        const candyGuard = await fetchCandyGuard(umi, candyMachine?.mintAuthority)
        // console.log('CMV3:', candyMachine)
        // console.log('CGV3:', candyGuard)
        return { candyMachine, candyGuard }
      } catch (error) {
        toast({
          title: 'Invalid Candy Machine',
          description: 'Provided CMID is not CMv3.',
          status: 'error',
          duration: 6000,
        })
        throw error
      }
    },
    [umi, walletAdapter.publicKey],
  )

  useEffect(() => {
    const fetchCandyMachineState = async () => {
      const cmId = candyMachineId
      if (cmId) {
        try {
          setIsFetching(true)
          const _sm = await getCandyMachine(cmId)
          if (!_sm) return
          const { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance } =
            await getCmStates(_sm, connection, walletAdapter.publicKey, umi)
          setSolanaMintPriceUnit(ticker)
          setSolanaMintPrice(price)
          //   setCollectionState({
          //     mintPrice: price,
          //     mintPriceUnit: ticker,
          //     buttonTitle,
          //     isButtonDisabled,
          //     balance,
          //   })
          setCandyMachineState(_sm)
          setIsFetching(false)
        } catch (e) {
          console.log(e)
        } finally {
        }
      }
    }
    // @ts-ignore
    if (walletAdapter.publicKey && !dbCollectionState?.isCollectionContest) fetchCandyMachineState()

    if (dbCollectionState?.isCollectionContest) {
      setSolanaMintPriceUnit(preMintPriceUnit)
      setSolanaMintPrice(preMintPrice)
    }
  }, [candyMachineId, getCandyMachine, walletAdapter.publicKey])

  return {
    umi,
    getCandyMachine,
    getUrls,
    connection,
    candyMachineState,
    solanaMintPrice,
    solanaMintPriceUnit,
    isFetching,
  }
}

const getCmStates = async (_cm: CandyMachineState, connection: Connection, publicKey: PublicKey, umi: Umi) => {
  let ticker = 'SOL',
    price,
    buttonTitle,
    isButtonDisabled,
    tokenMint,
    tokenMintMetadata,
    balance
  // console.log(_cm);
  const {
    buttonTitle: buttonTitleV3,
    isButtonDisabled: isButtonDisabledV3,
    price: priceV3,
    ticker: tickerV3,
    tokenMint: tokenMintV3,
    tokenMintMetadata: tokenMintMetadataV3,
    balance: balanceV3,
  } = await getCandyMachineState(_cm, connection, publicKey, umi)
  buttonTitle = buttonTitleV3
  isButtonDisabled = isButtonDisabledV3
  price = priceV3
  ticker = tickerV3
  tokenMint = tokenMintV3
  tokenMintMetadata = tokenMintMetadataV3
  balance = balanceV3

  return { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance }
}

const getCandyMachineState = async (_cm: CandyMachineState, connection: Connection, publicKey: PublicKey, umi: Umi) => {
  try {
    let ticker = 'SOL',
      price = 0,
      buttonTitle,
      isButtonDisabled,
      tokenMint,
      tokenMintMetadata,
      balance
    const { candyMachine, candyGuard } = _cm

    if (candyMachine && candyGuard) {
      // TODO: SOL PAYMENT
      if (candyGuard.guards.solPayment.__option === 'Some') {
        const solBasisPointsPrice = parseInt(candyGuard.guards.solPayment.value.lamports.basisPoints.toString())
        price = solBasisPointsPrice / LAMPORTS_PER_SOL
        const _solBalance = await connection.getBalance(publicKey)
        balance = _solBalance / LAMPORTS_PER_SOL
        if (_solBalance < solBasisPointsPrice) {
          buttonTitle = 'Insufficient Balance'
          isButtonDisabled = true
        } else {
          buttonTitle = 'Mint'
          isButtonDisabled = false
        }
      }

      // TODO: TOKEN PAYMENT
      if (candyGuard.guards.tokenPayment.__option === 'Some') {
        const tokenPayment = candyGuard.guards.tokenPayment.value
        const mint = toWeb3JsPublicKey(tokenPayment.mint)
        const amount = tokenPayment.amount
        const tokenBasisPointsPrice = parseInt(amount.toString())
        tokenMint = mint
        const mintDetails = await getMint(connection, mint)
        price = tokenBasisPointsPrice / 10 ** mintDetails.decimals
        try {
          const asset = await fetchDigitalAsset(umi, fromWeb3JsPublicKey(mint))
          tokenMintMetadata = asset.metadata
          ticker = asset.metadata.symbol.toLowerCase()
        } catch (error) {
          ticker = 'unknown'
        }
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: mint })
        if (tokenAccounts.value.length === 0) {
          buttonTitle = 'No Token Account'
          isButtonDisabled = true
        } else {
          const ata = getAssociatedTokenAddressSync(mint, publicKey)
          const _tokenPaymentBalance = await connection.getTokenAccountBalance(ata)
          balance = _tokenPaymentBalance.value.uiAmount
          if (_tokenPaymentBalance.value.uiAmount < tokenBasisPointsPrice) {
            buttonTitle = 'Insufficient Balance'
            isButtonDisabled = true
          } else {
            buttonTitle = 'Mint'
            isButtonDisabled = false
          }
        }
      }

      // TODO: TOKEN BURN
      if (candyGuard.guards.tokenBurn.__option === 'Some') {
        const tokenBurn = candyGuard.guards.tokenBurn.value
        const mint = toWeb3JsPublicKey(tokenBurn.mint)
        const expectedAmount = parseInt(tokenBurn.amount.toString())
        tokenMint = mint
        const mintDetails = await getMint(connection, mint)
        price = expectedAmount / 10 ** mintDetails.decimals
        try {
          const asset = await fetchDigitalAsset(umi, fromWeb3JsPublicKey(mint))
          tokenMintMetadata = asset.metadata
          ticker = asset.metadata.symbol.toLowerCase()
        } catch (error) {
          ticker = 'unknown'
        }
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint })
        if (tokenAccounts.value.length === 0) {
          buttonTitle = 'No Token Account'
          isButtonDisabled = true
        } else {
          const ata = getAssociatedTokenAddressSync(mint, publicKey)
          const _tokenBurnBalance = await connection.getTokenAccountBalance(ata)
          balance = _tokenBurnBalance.value.uiAmount
          if (_tokenBurnBalance.value.uiAmount < expectedAmount) {
            buttonTitle = 'Insufficient Balance'
            isButtonDisabled = true
          } else {
            buttonTitle = 'Mint'
            isButtonDisabled = false
          }
        }
      }
    }
    return { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance }
  } catch (error) {
    throw error
  }
}

export default useUmi
