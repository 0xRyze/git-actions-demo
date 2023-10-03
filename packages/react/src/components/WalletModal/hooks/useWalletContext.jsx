import React, { useContext } from 'react'
import { WalletContext } from '../context/WalletContext'

const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (!context) throw Error('Component is not wrapper under wallet context provider')
  return context
}

export default useWalletContext
