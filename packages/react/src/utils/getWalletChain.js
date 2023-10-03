const isSelectedWalletSolana = (wallet) => {
  if (!wallet) return false
  return wallet?.chains?.includes('SOL')
}

const isSelectedWalletEvm = (wallet) => {
  if (!wallet) return false
  return wallet?.chains?.includes('EVM')
}
const isSelectedWalletStacks = (wallet) => {
  if (!wallet) return false
  return wallet?.chains?.includes('STACKS')
}

export { isSelectedWalletStacks, isSelectedWalletSolana, isSelectedWalletEvm }
