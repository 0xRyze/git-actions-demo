import { useMemo } from 'react'
import { Web3ReactProvider } from '@web3-react/core'

import useEagerlyConnect from '../../hooks/useEagerlyConnect'
import { getAllEvmSupportedWallets } from '../WalletModal/utils/getWallets'

export default function Web3Provider({ children }) {
  useEagerlyConnect()
  const connections = getAllEvmSupportedWallets()
  const connectors = useMemo(() => connections.map(({ hooks, connector }) => [connector, hooks]), [connections])

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}
