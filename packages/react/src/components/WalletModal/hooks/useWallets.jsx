import React, { useMemo } from 'react'
import { getAllSupportedWallets } from '../utils/getWallets'
import { walletBook } from '../walletBook'
import { normalizeWalletName } from '../utils/normaliseWalletName'

const allWallets = getAllSupportedWallets()

const useWallets = (filterChains) => {
  const wallets = useMemo(() => {
    const aw = allWallets.map((wallet) => ({
      ...wallet,
      ...walletBook.wallets[normalizeWalletName(wallet.name)],
      isInstalled: wallet.isInstalled(),
    }))
    if (!!filterChains.length) {
      return aw.filter((wallet) => wallet.chains.some((item) => filterChains.includes(item)))
    }
    return aw
  }, [allWallets, filterChains])

  return {
    wallets,
  }
}

export default useWallets
