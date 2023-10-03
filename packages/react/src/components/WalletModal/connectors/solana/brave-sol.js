import { BraveWalletAdapter } from '@solana/wallet-adapter-brave'
import { isMobile, isSamsungBrowser } from '../../../../utils/detectBrowser'

class BraveSol extends BraveWalletAdapter {
  constructor() {
    super()
    this.id = 'brave-sol'
    this.name = 'Brave'
  }
}

export const braveConnection = {
  connector: new BraveSol(),
  hooks: null,
  name: 'BraveSol',
  isInstalled: () => {
    return window?.braveSolana?.isBraveWallet
  },
  handleMobile() {
    const url = encodeURIComponent(window.location.toString())
    const ref = encodeURIComponent(window.location.origin)
    // samsung browser only supports native links, not universal links
    if (isMobile()) {
      if (isSamsungBrowser()) {
        window.location.assign(`phantom://browse/${url}?ref=${ref}`)
      } else {
        window.location.assign(`https://phantom.app/ul/browse/${url}?ref=${ref}`)
      }
    }
    return
  },
}

export default BraveSol
