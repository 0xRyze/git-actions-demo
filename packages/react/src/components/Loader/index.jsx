import React from 'react'
import { Spinner } from '@chakra-ui/react'

const Loader = ({ ...props }) => {
  return <Spinner thickness="4px" speed="1.5s" emptyColor="input" color="black" size="xl" {...props} />
}

export default Loader
