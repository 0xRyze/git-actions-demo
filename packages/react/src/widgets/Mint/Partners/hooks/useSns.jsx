import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useCallback } from 'react'
import { claimSnsDomain, registerSnsDomain } from '../../../../state/partners/source'

const useSns = () => {
  const walletAdapter = useWallet()
  const { connection } = useConnection()

  const registerSns = useCallback(
    async (accessKey, payableAmount, payUsing, selectedDomain, userWalletAddress, size) => {
      if (!walletAdapter.connected || !walletAdapter.publicKey || !connection) return
      try {
        const price = payableAmount
        // console.log('payUsing.value', price.toString(), payUsing.value)
        const rawTx = await registerSnsDomain(
          accessKey,
          selectedDomain.name,
          userWalletAddress,
          price.toString(),
          payUsing.value,
          size * 1000,
        )
        const recentBlockhash = await connection.getLatestBlockhash()
        const recoveredTransaction = Transaction.from(Buffer.from(rawTx))
        // // TODO: SNS
        // const tx = new Transaction()
        // const buyer = walletAdapter.publicKey

        // let mint
        // let buyerTokenAccount

        // if (payUsing.value === 'SOL') {
        //   // TODO: SOL
        //   buyerTokenAccount = getAssociatedTokenAddressSync(
        //     NATIVE_MINT,
        //     buyer,
        //     false,
        //     TOKEN_PROGRAM_ID,
        //     ASSOCIATED_TOKEN_PROGRAM_ID,
        //   )
        //   mint = NATIVE_MINT
        // } else if (payUsing.value === 'SOL_USDT') {
        //   // TODO: SOL_USDT
        //   const SOL_USDT = new PublicKey(SOL_CURRENCIES[2].address)
        //   buyerTokenAccount = getAssociatedTokenAddressSync(SOL_USDT, buyer)
        //   mint = SOL_USDT
        // } else if (payUsing.value === 'BONK') {
        //   // TODO: BONK
        //   const BONK = new PublicKey(SOL_CURRENCIES[0].address)
        //   buyerTokenAccount = getAssociatedTokenAddressSync(BONK, buyer)
        //   mint = BONK
        // }
        // const [, ix] = await registerDomainName(
        //   connection,
        //   selectedDomain.name,
        //   1 * 1000,
        //   buyer,
        //   buyerTokenAccount,
        //   mint,
        // )

        // if (payUsing.value === 'SOL') {
        //   tx.add(
        //     createAssociatedTokenAccountInstruction(
        //       buyer,
        //       buyerTokenAccount,
        //       buyer,
        //       NATIVE_MINT,
        //       TOKEN_PROGRAM_ID,
        //       ASSOCIATED_TOKEN_PROGRAM_ID,
        //     ),
        //     SystemProgram.transfer({
        //       fromPubkey: buyer,
        //       toPubkey: buyerTokenAccount,
        //       lamports: LAMPORTS_PER_SOL,
        //     }),
        //     createSyncNativeInstruction(buyerTokenAccount, TOKEN_PROGRAM_ID),
        //   )
        // }
        // tx.add(...ix)
        // tx.feePayer = buyer
        recoveredTransaction.recentBlockhash = recentBlockhash.blockhash
        const sig = await walletAdapter.sendTransaction(recoveredTransaction, connection)
        console.log(sig)
        await claimSnsDomain(accessKey, selectedDomain.name, sig)
      } catch (error) {
        throw error
      }
    },
    [walletAdapter, connection],
  )

  return { registerSns }
}

export default useSns
