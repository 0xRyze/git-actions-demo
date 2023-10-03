import React, { ReactNode, createContext, useMemo } from 'react'

interface DynamicContextProps {
  children: ReactNode
  settings: {
    accessKey: string
    sandbox: boolean
  }
}

const BanditContext = createContext(undefined)

export let environment = 'production'

const BanditContextProvider = ({ children, settings }: DynamicContextProps) => {
  environment = settings?.sandbox ? 'development' : 'production'
  const value = useMemo(
    () => ({
      settings,
    }),
    [settings],
  )

  return <BanditContext.Provider value={value}>{children}</BanditContext.Provider>
}

export { BanditContext, BanditContextProvider }
