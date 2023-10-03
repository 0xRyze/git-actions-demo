import React, { Suspense } from 'react'
import FallbackView from '../Aggregator/components/FallbackView'
import { useConsumerContext } from '../../hooks/useConsumerContext'
import PortalsView from '../Aggregator/components/PortalsView/portalsView'
import { RootContextProvider } from '../../context/RootContext'
import { default as root } from 'react-shadow/emotion'
import { ConsumerContextProvider } from '../../context/ConsumerContext'
import { ThemeProvider } from '../../theme'
import StateProvider from '../../state/stateProvider'
import useBanditContext from '../../context/BanditContext/useBanditContext'

const CreatorStudio = React.lazy(() => import('./CreatorStudio'))

const LaunchpadWithoutDrawer = (props) => {
  const { settings } = useBanditContext()
  const { accessKey } = settings || {}
  const Root = !!Object.keys(root).length ? root.default : root
  return (
    <RootContextProvider>
      <Root.div className="bandit-widget">
        <div className="aggregator-table">
          <ConsumerContextProvider accessKey={accessKey}>
            <ThemeProvider>
              <StateProvider>
                <Suspense fallback={<FallbackView />}>
                  <CreatorStudio {...props} accessKey={accessKey} />
                </Suspense>
              </StateProvider>
            </ThemeProvider>
          </ConsumerContextProvider>
          <PortalsView />
        </div>
      </Root.div>
    </RootContextProvider>
  )
}

export default LaunchpadWithoutDrawer
