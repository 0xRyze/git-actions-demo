// import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'
//
// export async function sendTransactionV0(connection, instructions, publicKey) {
//   let blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash)
//
//   const messageV0 = new TransactionMessage({
//     payerKey: publicKey,
//     recentBlockhash: blockhash,
//     instructions,
//   }).compileToV0Message()
//
//   const tx = new VersionedTransaction(messageV0)
//   tx.sign([payer])
//   const sx = await connection.sendTransaction(tx)
//
//   console.log(`** -- Signature: ${sx}`)
// }
