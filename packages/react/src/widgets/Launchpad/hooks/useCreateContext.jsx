import React, { useContext } from 'react'
import { CreateContext } from '../context/CreateContext'

const useCreateContext = () => {
  const context = useContext(CreateContext)
  return context
}

export { useCreateContext }
