import React from 'react'

import { Connect } from '@stacks/connect-react'
import useStacks from '../WalletModal/hooks/useStacks'

const StacksProvider = ({ children, clientConfig }) => {
  const { profile } = clientConfig
  const { userSession } = useStacks()
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: profile?.name,
          icon: profile?.profileImage,
        },
        redirectTo: '/',
        onFinish: () => {
          // window.location.reload()
        },
        userSession,
      }}
    >
      {children}
    </Connect>
  )
}

export default StacksProvider
