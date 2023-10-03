import React, { useEffect } from 'react'
import { UAParser } from 'ua-parser-js'

const useUserAgent = () => {
  let parser = new UAParser()

  useEffect(() => {
    parser = new UAParser(typeof window !== 'undefined' ? window.navigator.userAgent : {})
  }, [])

  const { type } = parser.getDevice()

  const isMobile = type === 'mobile' || type === 'tablet'
  return isMobile
}

export default useUserAgent
