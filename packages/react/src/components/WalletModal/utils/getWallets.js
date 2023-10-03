import { hahaWalletConnection, metaMaskConnection, networkConnection, walletConnectConnection } from '../connectors/evm'
import { normalizeWalletName } from './normaliseWalletName'
import { stacksConnection } from '../connectors/stacks/stacks'
import { phantomConnection } from '../connectors/solana/phantom'

const getAllEvmSupportedWallets = () => {
  return [
    metaMaskConnection, //
    // braveConnection,
    walletConnectConnection,
    hahaWalletConnection,
    networkConnection,
  ]
}
const getAllSolanaSupportedWallets = () => {
  return [
    phantomConnection, //
    // braveSolConnection,
  ]
}
const getAllStacksSupportedWallets = () => {
  return [stacksConnection]
}

const getAllSupportedWallets = () => {
  return [
    ...getAllEvmSupportedWallets().filter((w) => normalizeWalletName(w.name) !== normalizeWalletName('network')),
    ...getAllSolanaSupportedWallets(),
    ...getAllStacksSupportedWallets(),
  ]
}
const getWalletByName = (name) => {
  const wallets = getAllSupportedWallets()
  return wallets.find((w) => normalizeWalletName(w.name) === normalizeWalletName(name))
}

export { getAllEvmSupportedWallets, getAllSupportedWallets, getWalletByName }
