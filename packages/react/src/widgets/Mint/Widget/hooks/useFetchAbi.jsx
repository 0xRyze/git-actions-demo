import React, { useState } from 'react'
import { NFT_ABI, NFT_CONTEST_ABI } from '../../../../constants/abi'

const useFetchAbi = (isCollectionContest) => {
  const [abiState, setAbi] = useState(isCollectionContest ? JSON.stringify(NFT_CONTEST_ABI) : JSON.stringify(NFT_ABI))

  // useEffect(() => {
  //   async function fetchAbi() {
  //     try {
  //       const chainInfo = SUPPORTED_NETWORKS_INFO[chainId]
  //       const { data } = await axios.get(
  //         `${chainInfo.api}/?module=contract&action=getabi&address=${contractAddress}&apikey=${chainInfo.key}`,
  //       )
  //       if (data.status === '1') {
  //         setAbi(data.result)
  //       } else {
  //         setAbi(abi)
  //       }
  //     } catch (e) {
  //       console.log('failed to fetch contract abi')
  //     }
  //   }
  //   if (!!contractAddress && !!chainId) {
  //     fetchAbi()
  //   }
  // }, [contractAddress, chainId])

  return isCollectionContest ? JSON.stringify(NFT_CONTEST_ABI) : JSON.stringify(NFT_ABI)
}

export default useFetchAbi
