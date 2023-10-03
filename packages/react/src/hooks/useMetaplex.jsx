import { useToast } from '@chakra-ui/react'
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'

export const getUrls = (network, sig, type) => {
  if (network === 'devnet' || network === 9091) {
    return {
      rpc: 'https://skilled-damp-glade.solana-devnet.discover.quiknode.pro/5eab58b431f2edb5c03a4a04e1cec02848871190/',
      bundlrAddress: 'https://devnet.bundlr.network',
      bundlrProviderUrl:
        'https://skilled-damp-glade.solana-devnet.discover.quiknode.pro/5eab58b431f2edb5c03a4a04e1cec02848871190/',
      explorer: `https://solscan.io/${type}/${sig}?cluster=devnet`,
    }
  } else if (network === 'mainnet-beta' || network === 9090) {
    return {
      rpc: 'https://hardworking-billowing-vineyard.solana-mainnet.quiknode.pro/ae90631560d354cd50a156c970ca5899b4cc2ab2/',
      bundlrAddress: 'https://node1.bundlr.network',
      bundlrProviderUrl:
        'https://hardworking-billowing-vineyard.solana-mainnet.quiknode.pro/ae90631560d354cd50a156c970ca5899b4cc2ab2/',
      explorer: `https://solscan.io/${type}/${sig}`,
    }
  } else {
    return {
      rpc: 'http://127.0.0.1:8899',
      bundlrAddress: 'https://devnet.bundlr.network',
      bundlrProviderUrl: clusterApiUrl('devnet'),
      explorer: `https://solscan.io/${type}/${sig}?cluster=custom`,
    }
  }
}

const useMetaplex = (chainId) => {
  const walletAdapter = useWallet()
  const toast = useToast()
  const [metaplex, setMetaplex] = useState(null)
  const [connection, setConnection] = useState()

  useEffect(() => {
    if ([9090, 9091].includes(chainId)) {
      const _network = chainId === 9091 ? 'devnet' : 'mainnet-beta'
      const _connection = new Connection(getUrls(_network).rpc)
      setConnection(_connection)
      setMetaplex(
        Metaplex.make(_connection).use(walletAdapterIdentity(walletAdapter)),
        // .use(
        //   bundlrStorage({
        //     // @ts-ignore
        //     address: getUrls(_network)?.bundlrAddress,
        //     // @ts-ignore
        //     providerUrl: getUrls(_network)?.rpc,
        //     timeout: 60000,
        //   }),
        // ),
      )
    }
  }, [walletAdapter])

  const isV3 = useCallback((model) => {
    return model === 'candyMachine' ? true : false
  }, [])

  const getCandyMachineV3 = useCallback(
    async (cmIdString) => {
      const cmId = new PublicKey(cmIdString)
      try {
        const _cm = await metaplex.candyMachines().findByAddress({ address: cmId })
        // toast({
        //   title: "candy machine v3",
        //   status: "success",
        //   duration: 6000,
        // });
        return _cm
      } catch (error) {
        console.log(error)
        toast({
          title: 'invalid cm',
          description: 'provided id is neither cm v2 or v3.',
          status: 'error',
          duration: 6000,
        })
        throw error
      }
    },
    [metaplex, toast],
  )

  const getCandyMachine = useCallback(
    async (cmIdString) => {
      const cmId = new PublicKey(cmIdString)
      try {
        const _cm = await metaplex.candyMachinesV2().findByAddress({ address: cmId })
        // toast({
        //   title: "candy machine v2",
        //   status: "success",
        //   duration: 6000,
        // });
        return _cm
      } catch (error) {
        return getCandyMachineV3(cmIdString)
      }
    },
    [getCandyMachineV3, metaplex],
  )

  // const getCandyMachine = useCallback(
  //   async (cmIdString) => {
  //     const cmId = new PublicKey(cmIdString)
  //     if (!metaplex) return null
  //     try {
  //       const _cm = await metaplex.candyMachines().findByAddress({ address: cmId })

  //       // toast({
  //       //   title: 'candy machine v3',
  //       //   status: 'success',
  //       //   duration: 6000,
  //       // })
  //       return _cm
  //     } catch (error) {
  //       try {
  //         const _cm = await metaplex.candyMachinesV2().findByAddress({ address: cmId })
  //         // toast({
  //         //   title: 'candy machine v2',
  //         //   status: 'success',
  //         //   duration: 6000,
  //         // })
  //         return _cm
  //       } catch (error) {
  //         toast({
  //           title: 'invalid cm',
  //           description: 'provided id is neither cm v2 or v3.',
  //           status: 'error',
  //           duration: 6000,
  //         })
  //         throw error
  //       }
  //     }
  //   },
  //   [metaplex, toast],
  // )

  return { metaplex, getCandyMachine, isV3, getUrls, connection }
}

export default useMetaplex
