import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

const useGasPrice = () => {
  const [gasPrice, setGasPrice] = useState(0)
  const { provider } = useWeb3React()

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const _gasPrice = await provider.getGasPrice()

        setGasPrice(_gasPrice.div(1000000000).toNumber())
      } catch (e) {
        console.log(e)
      }
    }
    if (provider) {
      fetchGasPrice()
    }
  }, [provider])

  return gasPrice
}

export default useGasPrice
