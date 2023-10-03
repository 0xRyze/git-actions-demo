import { CHAIN_INFO, SupportedChainId, SupportedEvmChains } from '../constants/chains'
import { networkConnection, walletConnectConnection } from '../connection'
import { FALLBACK_URLS, NETWORK_URLS_FOR_WALLET } from '../constants/network'

function getRpcUrl(chainId) {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.GOERLI:
    case SupportedChainId.BINANCE:
    case SupportedChainId.BINANCE_TESTNET:
    case SupportedChainId.SHARDEUM_SPHINX:
    case SupportedChainId.SHARDEUM20:
    case SupportedChainId.POLYGON_MAINNET:
    case SupportedChainId.POLYGON_MUMBAI:
    case SupportedChainId.BASE_MAINNET:
    case SupportedChainId.BASE_TESTNET:
    case SupportedChainId.CORE_MAINNET:
    case SupportedChainId.CORE_TESTNET:
    case SupportedChainId.TELOS_MAINNET:
    case SupportedChainId.TELOS_TESTNET:
    case SupportedChainId.OPTIMISM_MAINNET:
    case SupportedChainId.OPTIMISM_GOERLI:
    case SupportedChainId.ARBITRUM:
    case SupportedChainId.ARBITRUM_GOERLI:
    case SupportedChainId.AVALANCHE:
    case SupportedChainId.AVALANCHE_TESTNET:
    case SupportedChainId.ZORA_MAINNET:
    case SupportedChainId.ZORA_GOERLI:
      return NETWORK_URLS_FOR_WALLET[chainId]
    // Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
    // MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
    // See the definition of FALLBACK_URLS for more details.
    default:
      return FALLBACK_URLS[chainId][0]
  }
}

export function isSupportedChain(chainId) {
  return !!chainId && SupportedEvmChains.includes(chainId)
}

export const switchChain = async (connector, chainId) => {
  if (!isSupportedChain(chainId)) {
    throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`)
  } else if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
    await connector.activate(chainId)
  } else {
    const info = CHAIN_INFO[chainId]
    const addChainParameter = {
      chainId,
      chainName: info.label,
      rpcUrls: [getRpcUrl(chainId)],
      nativeCurrency: info.nativeCurrency,
      blockExplorerUrls: [info.explorer],
    }
    await connector.activate(addChainParameter)
  }
}
