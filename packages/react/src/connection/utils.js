import { ConnectionType, injectedConnection, networkConnection, walletConnectConnection } from '../connection'

export function getIsInjected() {
  if (typeof window !== 'undefined') {
    return Boolean(window.ethereum)
  }

  return false
}

export function getHasMetaMaskExtensionInstalled() {
  if (typeof window !== 'undefined') {
    return window.ethereum?.isMetaMask ?? false
  }
  return false
}

export function getHasCoinbaseExtensionInstalled() {
  if (typeof window !== 'undefined') {
    return window.ethereum?.isCoinbaseWallet ?? false
  }
  return false
}

export function getIsMetaMask(connectionType) {
  return connectionType === ConnectionType.INJECTED && getHasMetaMaskExtensionInstalled()
}

export function getIsSolanaInjected() {
  if (typeof window !== 'undefined') {
    return Boolean(window.solana?.isPhantom)
  }

  return false
}

export function getHasPhantomExtensionInstalled() {
  if (typeof window !== 'undefined') {
    return Boolean(window?.solana?.isPhantom)
  }

  return false
}

const CONNECTIONS = [injectedConnection, walletConnectConnection, networkConnection]

export function getConnection(c) {
  if (!c) return
  if (c && typeof c !== 'string') {
    const connection = CONNECTIONS.find((connection) => connection.connector === c)
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection
      case ConnectionType.NETWORK:
        return networkConnection
    }
  }
}

export function getConnectionName(connectionType, hasMetaMaskExtension = getHasMetaMaskExtensionInstalled()) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return hasMetaMaskExtension ? 'MetaMask' : 'Browser Wallet'
    case ConnectionType.COINBASE_WALLET:
      return 'Coinbase Wallet'
    case ConnectionType.WALLET_CONNECT:
      return 'WalletConnect'
    case ConnectionType.NETWORK:
      return 'Network'
    case ConnectionType.GNOSIS_SAFE:
      return 'Gnosis Safe'
  }
}
