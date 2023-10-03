import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import useStacks from '../hooks/useStacks'
import { isSelectedWalletEvm, isSelectedWalletSolana, isSelectedWalletStacks } from '../../../utils/getWalletChain'
import { updateSelectedWallet } from '../../../state/user/reducer'
import { useDispatch } from 'react-redux'
import useWallets from '../hooks/useWallets'
import { normalizeWalletName } from '../utils/normaliseWalletName'

const WalletContext = createContext(undefined)

const WalletContextProvider = ({ children }) => {
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [showWallets, setShowWallets] = useState(null)
  const [filterChains, setFilterChains] = useState([])

  const { wallets } = useWallets(filterChains)

  const { publicKey, disconnect: disconnectSolana } = useWallet()
  const { account } = useWeb3React()
  const { stacksAddress, disconnectStacks } = useStacks()

  const dispatch = useDispatch()

  useEffect(() => {
    const lastUsed = localStorage.getItem('LAST_USED_WALLET')

    if (lastUsed) {
      setSelectedWallet(wallets.find((w) => normalizeWalletName(w.name) === normalizeWalletName(lastUsed)))
    }
  }, [])

  useEffect(() => {
    if (isSelectedWalletEvm(selectedWallet) && account) {
      setShowWallets(false)
    }
    if (isSelectedWalletSolana(selectedWallet) && publicKey) {
      setShowWallets(false)
    }
    if (isSelectedWalletStacks(selectedWallet) && stacksAddress) {
      setShowWallets(false)
    }
  }, [selectedWallet, account, publicKey, stacksAddress])

  const handleClose = useCallback(() => {
    setSelectedWallet(null)
    setFilterChains([])
    setShowWallets(null)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      if (isSelectedWalletEvm(selectedWallet)) {
        if (selectedWallet.connector.deactivate) {
          selectedWallet.connector.deactivate()
        } else {
          selectedWallet.connector.resetState()
        }
        localStorage.clear()
      } else if (isSelectedWalletSolana(selectedWallet)) {
        disconnectSolana()
      } else if (isSelectedWalletStacks(selectedWallet)) {
        disconnectStacks()
      }

      dispatch(updateSelectedWallet({ wallet: undefined }))
    } catch (e) {}
  }, [selectedWallet, disconnectSolana, disconnectStacks])

  const primaryAddress = isSelectedWalletStacks(selectedWallet)
    ? stacksAddress
    : isSelectedWalletSolana(selectedWallet)
    ? publicKey?.toBase58()
    : isSelectedWalletEvm(selectedWallet)
    ? account
    : ''
  const value = useMemo(() => {
    return {
      selectedWallet,
      setSelectedWallet,
      showWallets,
      setShowWallets,
      filterChains,
      setFilterChains,
      handleClose,
      primaryAddress,
      disconnect,
    }
  }, [
    selectedWallet,
    setSelectedWallet,
    showWallets,
    setShowWallets,
    filterChains,
    setFilterChains,
    handleClose,
    primaryAddress,
    disconnect,
  ])
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export { WalletContext, WalletContextProvider }
