import React, { createContext, useCallback, useEffect, useState } from 'react'
import { getConsumerDetails } from '../state/consumer/source'
import FallbackView from '../widgets/Aggregator/components/FallbackView'

const ConsumerContext = createContext(undefined)

const initialState = {
  profile: {
    name: '',
    email: '',
    profileImage: '',
  },
  type: 'BASIC',
  domain: '',
  externalCurrencyEnabled: false,
  config: {
    launchpadEnabled: false,
    allowedChains: [],
    allowedMarketPlaces: [],
    links: {
      support: '',
      whitelist: '',
      submit: '',
    },
    categoryFilterEnabled: true,
    typeFilterEnabled: true,
    zoraReferralAddress: '',
  },
}

const ConsumerContextProvider = ({ accessKey, children }) => {
  const [consumer, setConsumer] = useState(initialState)
  const [loading, setLoading] = useState(true)

  const fetchConsumerDetails = useCallback(async () => {
    setLoading(true)

    const data = await getConsumerDetails(accessKey)
    setConsumer(data)
    setLoading(false)
  }, [accessKey])

  useEffect(() => {
    if (accessKey) {
      fetchConsumerDetails()
    }
  }, [accessKey])

  if (loading) return <FallbackView />
  return (
    <ConsumerContext.Provider value={{ ...consumer, isConsumerLoading: loading, accessKey }}>
      {children}
    </ConsumerContext.Provider>
  )
}

export { ConsumerContext, ConsumerContextProvider }
