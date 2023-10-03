import React, { useEffect, useState } from 'react'
import { signMessage } from '../utils/web3React'
import { CONNECTOR_ID, SIGNATURE } from '../utils/storageKeys'
import { decodeUTF8 } from 'tweetnacl-util'
import { useWallet } from '@solana/wallet-adapter-react'
import * as bs58 from 'bs58'
import usePreviousValue from './usePreviousValue'
import { useWeb3React } from '@web3-react/core'
import { useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { getNonce } from '../state/user/source'
import { useConsumerContext } from './useConsumerContext'

const useSignature = () => {
  const wallet = useWallet()
  const toast = useToast()
  const [signature, setSignature] = useState(null)
  const [connectorId, setConnectorId] = useState(null)
  const { account, provider } = useWeb3React()

  const { accessKey } = useConsumerContext()

  const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const previousAccount = usePreviousValue(account)

  useEffect(() => {
    const _signature = localStorage.getItem(SIGNATURE)
    setSignature(_signature)
    setConnectorId(selectedWallet)
  }, [account, wallet.connected, selectedWallet])

  useEffect(() => {
    const selectedWallet = localStorage.getItem(CONNECTOR_ID)
    if (!account && !selectedWallet) {
      localStorage.removeItem(SIGNATURE)
      setSignature(null)
    }
  }, [account])

  useEffect(() => {
    if (account && account !== previousAccount) {
      localStorage.removeItem(SIGNATURE)
      setSignature(null)
    }
  }, [account])

  const getSolanaSignature = async () => {
    if (signature) return signature
    try {
      const { data: nounce } = await getNonce(wallet?.publicKey?.toBase58(), accessKey)
      const message = wallet && `Verify your account: ${wallet?.publicKey?.toBase58()}\nNonce: ${nounce}`
      const messageBytes = decodeUTF8(message)
      const _rawSignature = wallet && (await wallet?.signMessage(messageBytes))
      const _signature = bs58.encode(_rawSignature)
      localStorage.setItem(SIGNATURE, _signature)
      setSignature(_signature)
      return _signature
    } catch (e) {
      // toast({ title: '', description: 'You rejected or cancelled the transaction', status: 'error' })
      throw e
    }
  }

  const getEvmSignature = async () => {
    if (signature) return signature
    try {
      const { data: nonce } = await getNonce(account, accessKey)
      const _signature = await signMessage(provider, account, `Verify your account: ${account}\nNonce: ${nonce}`)
      localStorage.setItem(SIGNATURE, _signature)
      setSignature(_signature)

      return _signature
    } catch (e) {
      // toast({ title: '', description: 'You rejected or cancelled the transaction', status: 'error' })
      throw e
    }
  }

  const getSignature = connectorId === 'Phantom' ? getSolanaSignature : getEvmSignature
  return [signature, getSignature]
}

export default useSignature
