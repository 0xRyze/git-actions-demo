import React from 'react'
import { FormControl, FormLabel, Switch as ChakraSwitch } from '@chakra-ui/react'

const Switch = ({ label, id, ...rest }) => {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor={id} mb="0">
        {label}
      </FormLabel>
      <ChakraSwitch id={id} {...rest} />
    </FormControl>
  )
}

export default Switch
