import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { networkConnection } from '../connection'
import { updateSelectedWallet } from '../state/user/reducer'
import { getWalletByName } from '../components/WalletModal/utils/getWallets'

async function connect(connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useDispatch()

  const selectedWallet = useSelector((state) => state.user.selectedWallet)

  let selectedConnection
  if (selectedWallet) {
    try {
      selectedConnection = getWalletByName(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }
  }

  useEffect(() => {
    connect(networkConnection.connector)

    if (selectedConnection) {
      connect(selectedConnection.connector)
    } // The dependency list is empty so this is only run once on mount
  }, [selectedConnection])
}
