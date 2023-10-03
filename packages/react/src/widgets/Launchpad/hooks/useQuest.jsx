import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import useMetaplex from '../../../hooks/useMetaplex'
import { createSolanaCollectionTx } from '../../../state/launchpad/source'
import { environment } from '../../../context/BanditContext'

export const BUBBLEGUM_PROGRAM_ID = 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY'

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

const BANDIT_QUEST_PROGRAM_ID =
  environment === 'development'
    ? 'BQ4SikUBkWmyN7avqXZ3sbdAjgsb1zV92ga1BPQbFjfC'
    : 'BQPpmVty9r1sBK63bCf4vSWex1pcKipBrAbptirELft7'

const useQuest = (chainId = 9090) => {
  const { publicKey, connected, signAllTransactions } = useWallet()
  const { metaplex, connection } = useMetaplex(chainId)

  const init = async ({ accessKey, collection, maxDepth, maxBufferSize, questDetails, canopyDepth = 0 }) => {
    try {
      if (!publicKey || !connected || !connection || !metaplex || !signAllTransactions) return
      const authority = publicKey
      const collectionMint = Keypair.generate()

      const quest = PublicKey.findProgramAddressSync(
        [Buffer.from('quest', 'utf-8'), authority.toBuffer(), collectionMint.publicKey.toBuffer()],
        new PublicKey(BANDIT_QUEST_PROGRAM_ID),
      )[0]

      console.log('QUEST:', quest.toBase58())
      console.log('COLLECTION:', collectionMint.publicKey.toBase58())

      const latestBlockhash = await connection.getLatestBlockhash()

      const createCollection = await metaplex.nfts().builders().create({
        name: collection.name,
        symbol: collection.symbol,
        uri: collection.uri,
        sellerFeeBasisPoints: 0,
        useNewMint: collectionMint,
        collectionIsSized: true,
        isCollection: true,
      })

      const createCollectionTx = createCollection.toTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      })

      createCollectionTx.feePayer = authority
      createCollectionTx.recentBlockhash = latestBlockhash.blockhash
      createCollectionTx.partialSign(collectionMint)
      createCollectionTx.verifySignatures(false)

      const maxDepthSizePair = {
        maxDepth: maxDepth,
        maxBufferSize: maxBufferSize,
      }
      const { serializedTransaction } = await createSolanaCollectionTx(
        {
          authority: authority.toBase58(),
          collection: collectionMint.publicKey.toBase58(),
          maxDepth: maxDepthSizePair.maxDepth,
          maxBufferSize: maxDepthSizePair.maxBufferSize,
          canopyDepth,
          quest: {
            name: questDetails.name,
            symbol: questDetails.symbol,
            uri: questDetails.uri,
            sellerFeeBasisPoints: questDetails.sellerFeeBasisPoints,
          },
        },
        accessKey,
      )
      const initTx = Transaction.from(Buffer.from(serializedTransaction))

      const signedTxs = await signAllTransactions([createCollectionTx, initTx])
      createCollectionTx.verifySignatures(true)
      initTx.verifySignatures(true)

      const createCollectionSig = await connection.sendRawTransaction(
        signedTxs[0].serialize({
          requireAllSignatures: true,
          verifySignatures: true,
        }),
      )

      console.log('Collection:', createCollectionSig)
      await sleep(3)

      const initSig = await connection.sendRawTransaction(
        signedTxs[1].serialize({
          requireAllSignatures: true,
          verifySignatures: true,
        }),
        { skipPreflight: true },
      )
      console.log('Init:', initSig)

      const txResult = connection.getTransaction(initSig, { commitment: 'confirmed' })

      if (txResult?.meta?.err) {
        throw new Error('Transaction Failed')
      }

      console.log('Quest:', quest.toBase58())
      console.log('Collection Mint:', collectionMint.publicKey.toBase58())
      return { quest, collectionMint: collectionMint.publicKey }
    } catch (error) {
      console.log(error)
      console.log(error?.logs)
      throw error
    }
  }

  return { init }
}

export default useQuest
