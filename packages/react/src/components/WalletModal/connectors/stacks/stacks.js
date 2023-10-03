import { AppConfig, showConnect, UserSession } from '@stacks/connect'

const appConfig = new AppConfig(['store_write', 'publish_data'])

class Stacks {
  constructor() {
    this.id = 'stacks'
    this.name = 'Stacks'
    this.supportedChain = 'STACKS'
    this.userSession = new UserSession({ appConfig })
  }

  activate(onFinish, onCancel) {
    showConnect({
      appDetails: {
        name: 'Bandit',
        icon: window.location.origin + '/logo512.png',
      },
      redirectTo: '/',
      onFinish,
      onCancel,
      userSession: this.userSession,
    })
  }

  setUserSession(userSession) {
    this.userSession = userSession
  }

  getUserSession() {
    return this.userSession
  }
}

export const stacksConnection = {
  connector: new Stacks(),
  hooks: null,
  name: 'Stacks',
  isInstalled: () => {
    return true
  },
  handleMobile() {
    return
  },
}

export default Stacks
