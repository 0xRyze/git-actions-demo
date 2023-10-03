import React from 'react'

const CheckCircle = (props) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M21.5 13L14.1625 20L10.5 16.5"
        stroke={props.iconcolor ?? '#49536E'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
        stroke={props.iconcolor ?? '#49536E'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckCircle
