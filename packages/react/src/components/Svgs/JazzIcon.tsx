import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { default as root } from 'react-shadow/emotion'

interface Props {
  address: string
}

const JazzIcon: React.FC<Props> = ({ address }) => {
  // @ts-ignore
  const JazziconComponent = !!Object.keys(root).length ? Jazzicon.default : Jazzicon
  return (
    <JazziconComponent
      diameter="24"
      seed={jsNumberForAddress(address)}
      svgStyles={{
        display: 'block',
        verticalAlign: 'middle',
      }}
      paperStyles={{
        border: '1px solid #ffffff',
      }}
    />
  )
}

export default JazzIcon
