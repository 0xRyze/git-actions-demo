import React from 'react'
import StateProvider from '../../state/stateProvider'
import { ThemeProvider } from '../../theme'
import Providers from '../Mint/Providers'
import CreatorStudioDashboard from './CreatorStudioDashboard'
import { useConsumerContext } from '../../hooks/useConsumerContext'

const CreatorStudio = (props) => {
  const clientConfig = useConsumerContext()
  return (
    <div className="creator-studio">
      <ThemeProvider>
        <StateProvider>
          <Providers clientConfig={clientConfig}>
            <CreatorStudioDashboard clientConfig={clientConfig} {...props} />
          </Providers>
        </StateProvider>
      </ThemeProvider>
    </div>
  )
}

export default CreatorStudio
