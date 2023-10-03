import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { NETWORK_URLS } from '../constants/network'

export const ConnectionType = {
  INJECTED: 'INJECTED',
  WALLET_CONNECT: 'WALLET_CONNECT',
  NETWORK: 'NETWORK',
}

function onError(error) {
  console.debug(`web3-react error: ${error}`)
}

function onMetamaskError(error) {
  onError(error)
  // metaMaskErrorHandler?.(error)
}

const [web3Network, web3NetworkHooks] = initializeConnector(
  (actions) => new Network({ actions, urlMap: NETWORK_URLS, defaultChainId: 1 }),
)
export const networkConnection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
}

const [web3Injected, web3InjectedHooks] = initializeConnector(
  (actions) => new MetaMask({ actions, onError: onMetamaskError }),
)
export const injectedConnection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
}

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector((actions) => {
  // Avoid testing for the best URL by only passing a single URL per chain.
  // Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
  const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(NETWORK_URLS).reduce(
    (map, [chainId, urls]) => ({
      ...map,
      [chainId]: urls[0],
    }),
    {},
  )
  return new WalletConnectV2({
    actions,
    options: {
      projectId: '600da6aac724cb2c05d52087cb405879',
      chains: [1],
      optionalChains: [5, 137, 80001, 56, 97, 8081],
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '2147483647',
        },
      },
    },
    onError,
  })
})
export const walletConnectConnection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
}
