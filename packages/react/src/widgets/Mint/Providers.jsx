import React from 'react'

import Web3Provider from '../../components/Web3Provider'
import SolanaProvider from '../../components/SolanaProvider'
import StacksProvider from '../../components/StacksProvider'
import { WalletContextProvider } from '../../components/WalletModal/context/WalletContext'
import { WalletModal } from '../../components/WalletModal/WalletModal'

const Providers = ({ children, clientConfig }) => {
  return (
    <StacksProvider clientConfig={clientConfig}>
      <SolanaProvider>
        <Web3Provider>
          <WalletContextProvider>
            {children}

            <WalletModal />
          </WalletContextProvider>
        </Web3Provider>
      </SolanaProvider>
    </StacksProvider>
  )
}

export default Providers
