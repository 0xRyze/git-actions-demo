import { BanditContext } from './BanditContext'
import { useContext } from 'react'

const useBanditContext = () => {
  const context = useContext(BanditContext)
  if (context === undefined) {
    throw new Error('useBanditContext must be used within a BanditContextProvider')
  }
  return context
}

export default useBanditContext
