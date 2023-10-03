import React from 'react'
import { useRootContext } from '../../../../context/RootContext'

const PortalsView = () => {
  const { rootRef } = useRootContext()
  return <div className="portals" ref={rootRef}></div>
}

export default PortalsView
