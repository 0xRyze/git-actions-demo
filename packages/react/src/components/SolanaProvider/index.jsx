import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import Phantom from '../WalletModal/connectors/solana/phantom'
import BraveSol from '../WalletModal/connectors/solana/brave-sol'
import { environment } from '../../context/BanditContext'

const SolanaProvider = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const endpoint =
    environment === 'production'
      ? 'https://hardworking-billowing-vineyard.solana-mainnet.quiknode.pro/ae90631560d354cd50a156c970ca5899b4cc2ab2/'
      : 'https://skilled-damp-glade.solana-devnet.discover.quiknode.pro/5eab58b431f2edb5c03a4a04e1cec02848871190/'

  const wallets = useMemo(
    () => [
      new Phantom(),
      new BraveSol(),
      // new SolanaMobileWalletAdapter({
      //   appIdentity: { name: 'Solana Wallet Adapter App' },
      //   authorizationResultCache: createDefaultAuthorizationResultCache(),
      // }),
    ],
    [network],
  )
  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'finalized' }}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  )
}

export default SolanaProvider
