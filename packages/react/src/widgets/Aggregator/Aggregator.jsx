import React from 'react'
import { default as root } from 'react-shadow/emotion'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import { ThemeProvider } from '../../theme'
import AggregatorTable from './AggregatorTable'
import StateProvider from '../../state/stateProvider'
import { ConsumerContextProvider } from '../../context/ConsumerContext'
import { RootContextProvider } from '../../context/RootContext'
import PortalsView from './components/PortalsView/portalsView'
import useBanditContext from '../../context/BanditContext/useBanditContext'

const Aggregator = (props) => {
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
                <AggregatorTable {...props} accessKey={accessKey} />
              </StateProvider>
            </ThemeProvider>
          </ConsumerContextProvider>
          <PortalsView />
        </div>
      </Root.div>
    </RootContextProvider>
  )
}

export { Aggregator }
