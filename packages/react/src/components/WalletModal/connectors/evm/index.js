import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { Network } from '@web3-react/network'
import { NETWORK_URLS } from '../../../../constants/network'
import { isIOS } from '../../../../utils/detectBrowser'

export const ConnectionType = {
  METAMASK: 'Metamask',
  BRAVE: 'braveEvm',
  WALLET_CONNECT: 'WalletConnect',
  HAHA_WALLET: 'Haha',
  NETWORK: 'Network',
}

const postMessage = (message) => {
  // @ts-ignore
  window?.ReactNativeWebView?.postMessage(JSON.stringify(message))
}

const [metaMask, metaMaskHooks] = initializeConnector((actions) => new MetaMask({ actions }))

export const metaMaskConnection = {
  connector: metaMask,
  hooks: metaMaskHooks,
  name: ConnectionType.METAMASK,
  isInstalled: () => {
    return window?.ethereum?.isMetaMask
  },
  handleMobile: (uri, mobile) => {
    if (isIOS()) {
      window.open(`${mobile.native}?uri=${encodeURIComponent(uri ?? '')}`, '_self', 'noreferrer noopener')
    } else {
      window.open(`${mobile.universal}?uri=${encodeURIComponent(uri ?? '')}`, '_self', 'noreferrer noopener')
    }
  },
}

export const braveConnection = {
  connector: metaMask,
  hooks: metaMaskHooks,
  name: ConnectionType.BRAVE,
  isInstalled: () => {
    return window?.ethereum?.isBraveWallet
  },
  handleMobile: (uri, mobile) => {
    if (isIOS()) {
      window.open(`${mobile.native}?uri=${encodeURIComponent(uri ?? '')}`, '_self', 'noreferrer noopener')
    } else {
      window.open(`${mobile.universal}?uri=${encodeURIComponent(uri ?? '')}`, '_self', 'noreferrer noopener')
    }
  },
}

const [walletConnectV2, walletConnectHooks] = initializeConnector(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: '600da6aac724cb2c05d52087cb405879',
        chains: [1],
        optionalChains: [5, 137, 80001, 56, 97, 8081],
        showQrModal: false,
        qrModalOptions: {
          themeVariables: {
            '--wcm-z-index': '2147483647',
          },
        },
      },
      onError: (e) => {
        console.log(e)
      },
    }),
)
const [walletConnectV2Mobile, walletConnectHooksMobile] = initializeConnector(
  (actions) =>
    new WalletConnectV2({
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
      onError: (e) => {
        console.log(e)
      },
    }),
)

export const walletConnectConnection = {
  connector: walletConnectV2,
  mobileConnector: walletConnectV2Mobile,
  hooks: walletConnectHooks,
  name: ConnectionType.WALLET_CONNECT,
  isInstalled: () => {
    return false
  },
}
export const hahaWalletConnection = {
  ...walletConnectConnection,
  name: ConnectionType.HAHA_WALLET,
  handleMobile(uri) {
    if (window.sendWalletConnectQR !== undefined) {
      postMessage({
        type: 'walletconnect_haha',
        uri,
      })
    } else {
      const url = encodeURIComponent(window.location.toString())
      const ref = encodeURIComponent(window.location.origin)
      window.location.assign(`haha://opensea?link=${url}`)
    }
  },
}

export const [network, networkHooks] = initializeConnector((actions) => new Network({ actions, urlMap: NETWORK_URLS }))

export const networkConnection = {
  connector: network,
  hooks: networkHooks,
  name: ConnectionType.NETWORK,
  isInstalled: () => {
    return false
  },
}
