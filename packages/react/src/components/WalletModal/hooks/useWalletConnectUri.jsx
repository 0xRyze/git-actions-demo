import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { walletConnectConnection } from '../connectors/evm'

export function useWalletConnectUri() {
  const log = console.log

  const [uri, setUri] = useState(undefined)

  const { isActive } = useWeb3React()
  //
  // const [connector] = initializeConnector(
  //   (actions) =>
  //     new WalletConnectV2({
  //       actions,
  //       options: {
  //         projectId: '600da6aac724cb2c05d52087cb405879',
  //         chains: [1],
  //         optionalChains: [5, 137, 80001, 56, 97, 8081],
  //         showQrModal: false,
  //       },
  //       onError: (e) => {
  //         console.log(e)
  //       },
  //     }),
  // )

  const connector = walletConnectConnection.connector

  useEffect(() => {
    connector.events.on('URI_AVAILABLE', (uri) => {
      setUri(uri)
    })
  }, [connector])

  useEffect(() => {
    // if (!connector || uri) return

    if (connector) {
      connector.activate().catch((error) => {
        console.debug('Failed to connect eagerly to walletconnect', error)
      })
    }
  }, [])

  return {
    uri,
    walletConnectConnector: connector,
  }
}
