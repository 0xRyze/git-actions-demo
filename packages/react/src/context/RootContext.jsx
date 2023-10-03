import React, { createContext, useContext, useRef } from 'react'

const RootContext = createContext(undefined)

const RootContextProvider = ({ children }) => {
  const rootRef = useRef()

  return <RootContext.Provider value={{ rootRef }}>{children}</RootContext.Provider>
}

const useRootContext = () => {
  const context = useContext(RootContext)
  return context
}

export { RootContext, RootContextProvider, useRootContext }
