import React, { useEffect, useState } from 'react'
import { AppConfig, UserSession } from '@stacks/connect'

const useStacks = () => {
  const [stacksAddress, setStacksAddress] = useState('')
  const appConfig = new AppConfig(['store_write', 'publish_data'])

  const userSession = new UserSession({ appConfig })

  const disconnectStacks = () => {
    userSession.signUserOut()
    setStacksAddress('')
  }

  useEffect(() => {
    if (userSession) {
      try {
        const res = userSession.loadUserData()
        setStacksAddress(res.profile.stxAddress.testnet)
      } catch (e) {
        // console.log(e)
      }
    }
  }, [userSession])

  return {
    stacksAddress,
    userSession,
    disconnectStacks,
  }
}

export default useStacks
