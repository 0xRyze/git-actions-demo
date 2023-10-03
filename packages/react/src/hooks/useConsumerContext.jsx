import React, { useContext } from 'react'
import { ConsumerContext } from '../context/ConsumerContext'

const useConsumerContext = () => {
  const context = useContext(ConsumerContext)
  return context
}

export { useConsumerContext }
