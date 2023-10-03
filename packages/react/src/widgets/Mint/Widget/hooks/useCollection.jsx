import { useEffect, useState } from 'react'
import { getCollectionById } from '../../../../state/collection/source'

const useCollection = (collectionId, accessKey) => {
  const [collectionState, setCollectionState] = useState({})
  const [candyMachineId, setCandyMachineId] = useState(null)
  // const [cm, setCm] = useState(null)
  // const [isFetching, setIsFetching] = useState(true)
  // const walletAdapter = useWallet()

  const [isLoading, setLoading] = useState(true)

  // const { getCandyMachine, metaplex, isV3, connection } = useMetaplex(collectionState.chainId)

  useEffect(() => {
    async function fetchCollection() {
      try {
        setLoading(true)
        const collection = await getCollectionById(accessKey, collectionId)

        setCollectionState({
          collectionId,
          contractAddress: collection?.contract?.contractAddress,
          chainId: collection?.contract?.chainId,
          mintPrice: collection.stats.price.value,
          mintPriceUnit: collection.stats.price.unit,
          mintFunction: collection.contract.mintFunction,
          abi: collection.contract.abi,
          profile: collection.profile,
          contract: collection?.contract,
          stats: collection?.stats,
          ...collection,
        })
        setCandyMachineId(collection?.contract?.candyMachineId)
      } catch (e) {
        console.log(`Failed to fetch collection details from collection ID: ${collectionId}`)
      } finally {
        setLoading(false)
      }
    }

    if (collectionId) {
      fetchCollection()
    }
  }, [collectionId, accessKey])

  // useEffect(() => {
  //   async function fetchCandyMachineState() {
  //     const cmId = candyMachineId
  //     if (cmId && metaplex) {
  //       try {
  //         setIsFetching(true)
  //         const _sm = await getCandyMachine(cmId)
  //         const { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance } =
  //           await getCmStates(_sm, connection, isV3, walletAdapter.publicKey, metaplex)
  //         setCollectionState((state) => ({
  //           ...state,
  //           mintPrice: price,
  //           mintPriceUnit: ticker,
  //           buttonTitle,
  //           isButtonDisabled,
  //           balance,
  //         }))
  //         setCm(_sm)
  //       } catch (e) {
  //         console.log(e)
  //       } finally {
  //         setIsFetching(false)
  //       }
  //     }
  //   }
  //   if (walletAdapter.publicKey && !collectionState?.isCollectionContest) fetchCandyMachineState()
  // }, [candyMachineId, getCandyMachine, metaplex, walletAdapter.publicKey, collectionState])

  return { collectionState, isLoading, candyMachineId }
}

// const getCmStates = async (_cm, connection, isV3, publicKey, metaplex) => {
//   let ticker = 'SOL',
//     price,
//     buttonTitle,
//     isButtonDisabled,
//     tokenMint,
//     tokenMintMetadata,
//     balance
//   // console.log(_cm);
//   if (isV3(_cm.model)) {
//     const {
//       buttonTitle: buttonTitleV3,
//       isButtonDisabled: isButtonDisabledV3,
//       price: priceV3,
//       ticker: tickerV3,
//       tokenMint: tokenMintV3,
//       tokenMintMetadata: tokenMintMetadataV3,
//       balance: balanceV3,
//     } = await cmV3(_cm, connection, publicKey, metaplex)
//     buttonTitle = buttonTitleV3
//     isButtonDisabled = isButtonDisabledV3
//     price = priceV3
//     ticker = tickerV3
//     tokenMint = tokenMintV3
//     tokenMintMetadata = tokenMintMetadataV3
//     balance = balanceV3
//   } else {
//     const {
//       buttonTitle: buttonTitleV3,
//       isButtonDisabled: isButtonDisabledV3,
//       price: priceV3,
//       ticker: tickerV3,
//       tokenMint: tokenMintV3,
//       tokenMintMetadata: tokenMintMetadataV3,
//       balance: balanceV2,
//     } = await cmV2(_cm, connection, publicKey, metaplex)
//     buttonTitle = buttonTitleV3
//     isButtonDisabled = isButtonDisabledV3
//     price = priceV3
//     ticker = tickerV3
//     tokenMint = tokenMintV3
//     tokenMintMetadata = tokenMintMetadataV3
//     balance = balanceV2
//   }
//   return { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance }
// }

// const cmV3 = async (_cm, connection, publicKey, metaplex) => {
//   try {
//     let ticker = 'SOL',
//       price,
//       buttonTitle,
//       isButtonDisabled,
//       tokenMint,
//       tokenMintMetadata,
//       balance

//     // TODO: Groups
//     if (!_cm?.candyGuard?.guards?.solPayment && !_cm?.candyGuard?.guards?.tokenPayment) {
//       const guards = _cm?.candyGuard?.groups.find((group) => group?.label === 'Public').guards
//       if (guards?.solPayment) {
//         // TODO: V3 SOL Payment
//         price = guards.solPayment.amount.basisPoints.toNumber() / LAMPORTS_PER_SOL

//         const _balance = await connection.getBalance(publicKey)
//         balance = _balance / LAMPORTS_PER_SOL
//         if (_balance <= guards.solPayment.amount.basisPoints.toNumber()) {
//           // TODO: V3 No SOL Balance
//           buttonTitle = 'Insufficient Balance'
//           isButtonDisabled = true
//         } else {
//           // TODO: V3 ALL OKAY
//           buttonTitle = 'Mint'
//           isButtonDisabled = false
//         }
//       }
//     }

//     // TODO: V3
//     if (_cm?.candyGuard?.guards?.solPayment) {
//       // TODO: V3 SOL Payment
//       price = _cm.candyGuard.guards.solPayment.amount.basisPoints.toNumber() / LAMPORTS_PER_SOL

//       const _balance = await connection.getBalance(publicKey)
//       balance = _balance / LAMPORTS_PER_SOL
//       if (_balance <= _cm.candyGuard.guards.solPayment.amount.basisPoints.toNumber()) {
//         // TODO: V3 No SOL Balance
//         buttonTitle = 'Insufficient Balance'
//         isButtonDisabled = true
//       } else {
//         // TODO: V3 ALL OKAY
//         buttonTitle = 'Mint'
//         isButtonDisabled = false
//       }
//     }

//     if (_cm?.candyGuard?.guards?.tokenPayment) {
//       // TODO: V3 Token Payment
//       const token = await metaplex?.tokens().findMintByAddress({
//         // @ts-ignore
//         address: _cm.candyGuard.guards.tokenPayment.mint,
//       })
//       const decimals = token?.currency.decimals
//       price = _cm.candyGuard.guards.tokenPayment.amount.basisPoints.toNumber() / 10 ** decimals
//       const mint = _cm.candyGuard.guards.tokenPayment.mint
//       tokenMint = mint
//       const nft = await metaplex?.nfts().findByMint({
//         mintAddress: mint,
//       })
//       tokenMintMetadata = nft
//       ticker = nft.symbol
//       const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: mint })
//       if (tokenAccounts.value.length === 0) {
//         // TODO: V3 No ${ticker} Account
//         buttonTitle = `No ${ticker} Account`
//         isButtonDisabled = true
//       } else {
//         const tokenAccount = await getAssociatedTokenAddress(mint, publicKey)
//         const tokenBalance = await connection.getTokenAccountBalance(tokenAccount)
//         balance = tokenBalance.value.uiAmount / 10 ** decimals
//         if (
//           tokenBalance.value.uiAmount <
//           _cm.candyGuard.guards.tokenPayment.amount.basisPoints.toNumber() / 10 ** decimals
//         ) {
//           // TODO: V3 No ${ticker} Balance
//           buttonTitle = `Insufficient ${ticker} Balance`
//           isButtonDisabled = true
//         } else {
//           // TODO: V3 ALL OKAY
//           buttonTitle = `Mint`
//           isButtonDisabled = false
//         }
//       }
//     }
//     return { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance }
//   } catch (error) {
//     throw error
//   }
// }

// const cmV2 = async (_cm, connection, publicKey, metaplex) => {
//   try {
//     let ticker = 'SOL',
//       price,
//       buttonTitle,
//       isButtonDisabled,
//       tokenMint,
//       tokenMintMetadata,
//       balance
//     // TODO: V2
//     if (_cm.tokenMintAddress) {
//       // TODO: V2 Token Payment
//       tokenMint = _cm.tokenMintAddress

//       // console.log(_cm.tokenMintAddress);
//       const nft = await metaplex?.nfts().findByMint({ mintAddress: _cm.tokenMintAddress })
//       tokenMintMetadata = nft
//       // console.log(nft);
//       ticker = nft.symbol
//       const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
//         publicKey,

//         { mint: _cm.tokenMintAddress },
//       )
//       price = _cm?.price.basisPoints.toNumber() / 10 ** _cm?.price.currency.decimals
//       if (tokenAccounts.value.length === 0) {
//         // TODO: V2 No ${ticker} Account
//         buttonTitle = `No ${ticker} Account`
//         isButtonDisabled = true
//       } else {
//         const tokenAccount = await getAssociatedTokenAddress(_cm.tokenMintAddress, publicKey)
//         const tokenBalance = await connection.getTokenAccountBalance(tokenAccount)
//         balance = tokenBalance.value.uiAmount / 10 ** _cm?.price.currency.decimals
//         if (tokenBalance.value.uiAmount < _cm?.price?.basisPoints.toNumber() / 10 ** _cm?.price.currency.decimals) {
//           // TODO: V2 No ${ticker} Balance
//           buttonTitle = `Insufficient ${ticker} Balance`
//           isButtonDisabled = true
//         } else {
//           // TODO: V2 ALL OKAY
//           buttonTitle = 'Mint'
//           isButtonDisabled = false
//         }
//       }
//     } else {
//       // TODO: V2 SOL Payment
//       price = _cm?.price.basisPoints.toNumber() / LAMPORTS_PER_SOL
//       const _balance = await connection.getBalance(publicKey)
//       balance = _balance / LAMPORTS_PER_SOL
//       if (_balance <= _cm?.price.basisPoints.toNumber()) {
//         // TODO: V2 No SOL Balance
//         buttonTitle = 'Insufficient Balance'
//         isButtonDisabled = true
//       } else {
//         // TODO: V2 ALL OKAY
//         buttonTitle = 'Mint'
//         isButtonDisabled = false
//       }
//     }
//     return { ticker, price, buttonTitle, isButtonDisabled, tokenMint, tokenMintMetadata, balance }
//   } catch (error) {
//     throw error
//   }
// }

export default useCollection
