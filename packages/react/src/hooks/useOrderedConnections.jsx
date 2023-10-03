import { ConnectionType } from '../connection'
import { useMemo } from 'react'
import { getConnection } from '../connection/utils'
import { useSelector } from 'react-redux'

export const SELECTABLE_WALLETS = [ConnectionType.INJECTED, ConnectionType.WALLET_CONNECT]

export default function useOrderedConnections() {
  const selectedWallet = useSelector((state) => state.user.selectedWallet)
  return useMemo(() => {
    const orderedConnectionTypes = []

    // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
    if (selectedWallet && SELECTABLE_WALLETS.includes(selectedWallet)) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet))

    // Add network connection last as it should be the fallback.
    orderedConnectionTypes.push(ConnectionType.NETWORK)

    return orderedConnectionTypes.map(getConnection)
  }, [selectedWallet])
}
