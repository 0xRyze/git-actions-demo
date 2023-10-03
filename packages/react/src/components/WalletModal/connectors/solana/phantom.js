import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { isMobile, isSamsungBrowser } from '../../../../utils/detectBrowser'

class Phantom extends PhantomWalletAdapter {
  constructor() {
    super()
    this.id = 'phantom'
    this.name = 'Phantom'
  }
}

export const phantomConnection = {
  connector: new PhantomWalletAdapter(),
  hooks: null,
  name: 'Phantom',
  isInstalled: () => {
    return window?.solana?.isPhantom
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

export default Phantom
