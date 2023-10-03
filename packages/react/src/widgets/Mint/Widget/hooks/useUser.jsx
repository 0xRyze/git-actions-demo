import React from 'react'
import { getUser } from '../../../../state/user/source'
import { useDispatch, useSelector } from 'react-redux'
import useStacks from '../../../../components/WalletModal/hooks/useStacks'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { updateUserDetails } from '../../../../state/user/reducer'

const useUser = () => {
  const { selectedWallet, accessKey, details = {} } = useSelector((state) => state.user)
  const { stacksAddress } = useStacks()
  const { account } = useWeb3React()
  const { publicKey: solanaAccount, disconnect } = useWallet()

  const dispatch = useDispatch()

  const refreshUser = async () => {
    try {
      if (!details.walletAddress) return
      const user = await getUser(details.walletAddress, accessKey)
      dispatch(updateUserDetails({ details: user }))
    } catch (e) {
      console.log(e)
    }
  }

  const fetchUser = async () => {
    try {
      const solanaAccountStr = !!solanaAccount ? solanaAccount.toBase58() : ''
      const userAccount =
        selectedWallet === 'stacks' ? stacksAddress : selectedWallet === 'Phantom' ? solanaAccountStr : account
      if (details?.walletAddress?.toLowerCase() === userAccount?.toLowerCase()) return

      const user = await getUser(userAccount, accessKey)
      dispatch(updateUserDetails({ details: user }))
    } catch (e) {
      console.log(e)
    }
  }

  return { user: details, fetchUser, refreshUser }
}

export default useUser
