import React, { useCallback } from 'react'
import { claimDomain, lockDomain, preLockDomain } from '../../../../../state/partners/source'
import { useToast } from '@chakra-ui/react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js'
import { PublicKey, toBigNumber } from '@metaplex-foundation/js'
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import BigNumber from 'bignumber.js'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from '@ethersproject/units'
import { environment } from '../../../../..'
import { useContract } from '../../../../../hooks/useContract'
import { ERC20ABI } from '../../constants'

const isProd = environment === 'production'

const SOL_DESTINATION_WALLET = isProd
  ? 'HGZmW9bWZZhVvfGbBBU1dvYHsXwi7BqPX5vG39v87iXW'
  : '5bPVXMADTeJCbZ1dMfn6GRm8Zm1mSbwR84UsyRT4eVAT'
const EVM_DESTINATION_WALLET = isProd
  ? '0x4D535c34DD050B0Bc0e7dC6A988a1443Dfb520ac'
  : '0x663Bae08ad96BC7D0f5F895dAb6daA84F9F6De0C'

const useUd = (payUsing) => {
  const toast = useToast()
  const { connection } = useConnection()
  const walletAdapter = useWallet()

  const usdtContract = useContract(isAddress(payUsing.address) ? payUsing.address : null, ERC20ABI)
  const { account, provider } = useWeb3React()

  const transferToken = useCallback(
    async (price, payUsing) => {
      try {
        const recentBlockhash = await connection.getLatestBlockhash()
        const tx = new Transaction()

        if (payUsing.value === 'BONK' || payUsing.value === 'SOL_USDT') {
          const paymentMintAddress = payUsing.address
          const destinationWalletAddress = new PublicKey(SOL_DESTINATION_WALLET)
          const mintAddress = new PublicKey(paymentMintAddress)

          const senderTokenAccount = getAssociatedTokenAddressSync(mintAddress, walletAdapter.publicKey)

          const destinationAccountInfo = await connection.getTokenAccountsByOwner(destinationWalletAddress, {
            mint: mintAddress,
            programId: TOKEN_PROGRAM_ID,
          })

          const destinationAccountKey = getAssociatedTokenAddressSync(mintAddress, destinationWalletAddress)

          if (!destinationAccountInfo.value?.length) {
            tx.add(
              createAssociatedTokenAccountInstruction(
                walletAdapter.publicKey,
                destinationAccountKey,
                destinationWalletAddress,
                mintAddress,
              ),
            )
          }

          tx.add(
            createTransferCheckedInstruction(
              senderTokenAccount,
              mintAddress,
              destinationAccountKey,
              walletAdapter.publicKey,
              toBigNumber(price * 10 ** payUsing.decimals),
              payUsing.decimals,
            ),
          )
        } else {
          tx.add(
            SystemProgram.transfer({
              fromPubkey: walletAdapter.publicKey,
              toPubkey: new PublicKey(SOL_DESTINATION_WALLET),
              lamports: new BigNumber(price).multipliedBy(LAMPORTS_PER_SOL).toNumber(),
            }),
          )
        }

        tx.feePayer = walletAdapter.publicKey
        tx.recentBlockhash = recentBlockhash.blockhash

        const signature = await walletAdapter.sendTransaction(tx, connection, {
          signers: [],
          preflightCommitment: 'max',
        })

        return signature
      } catch (e) {
        throw e
      }
    },
    [walletAdapter.connected],
  )

  const registerUd = useCallback(
    async (
      accessKey,
      selectedDomain,
      payUsing,
      userWalletAddress,
      address,
      selectedWallet,
      domainInterval,
      getSuggestions,
    ) => {
      try {
        let transactionHash = null
        const { token, discountedValue, value } = await preLockDomain(
          accessKey,
          selectedDomain.name,
          payUsing.value,
          userWalletAddress,
        )
        if (payUsing.ticker !== 'USDT' && discountedValue !== selectedDomain.discountedRate[payUsing.value]) {
          toast({
            title: `Price changed`,
            // description:  ,
            status: 'warning',
            duration: 2000,
          })
          getSuggestions()
          return
        }

        await lockDomain(accessKey, {
          name: selectedDomain.name,
          claimWallet: address,
          raw: token,
          discountedPrice: discountedValue,
          price: value,
          currency: payUsing.value,
        })

        if (!!domainInterval.current) {
          clearInterval(domainInterval.current)
        }

        if (payUsing.value === 'BONK' || payUsing.value === 'SOL_USDT' || payUsing.value === 'SOL') {
          transactionHash = await transferToken(discountedValue, payUsing)
        } else if (payUsing.value === 'ETH_USDT' || payUsing.value === 'MATIC_USDT') {
          const requiredAmount = new BigNumber(discountedValue).multipliedBy(BIG_TEN.pow(6).toNumber()).toString()
          const tx = await usdtContract.transfer(EVM_DESTINATION_WALLET, requiredAmount)
          const receipt = await tx.wait()
          transactionHash = receipt.transactionHash
        } else if (payUsing.value === 'ETH' || payUsing.value === 'MATIC') {
          // const requiredAmount = hexlify(new BigNumber(getPayableAmount()).toString())

          const signer = provider.getSigner()

          const tx = await signer.sendTransaction({
            from: account,
            to: EVM_DESTINATION_WALLET,
            value: parseUnits(discountedValue, 'ether').toHexString(),
          })

          const receipt = await tx.wait()

          transactionHash = receipt.transactionHash
        }

        console.log(transactionHash)

        await claimDomain(accessKey, {
          name: selectedDomain.name,
          transactionHash,
          transferWallet: selectedWallet?.chains?.includes('SOL') ? walletAdapter.publicKey.toBase58() : account,
          claimWallet: address,
        })
      } catch (error) {
        throw error
      }
    },
    [provider, transferToken],
  )

  return { registerUd }
}

export default useUd
