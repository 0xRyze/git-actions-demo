import React from 'react'
import { FormControl, Input as ChakraInput, InputGroup, Text } from '@chakra-ui/react'

const Input = (
  { label, error, placeholder, helperText, isInvalid, as = ChakraInput, InputLeftAddon, ...rest },
  ref,
) => {
  const InputComp = as
  return (
    <FormControl isInvalid={isInvalid}>
      <Text>{label}</Text>
      <InputGroup mt="2">
        {InputLeftAddon}
        <InputComp placeholder={placeholder} {...rest} ref={ref} />
      </InputGroup>
      {helperText && <Text fontSize={'12'}>{helperText}</Text>}
      {error && (
        <Text fontSize={'12'} color="red.300">
          {error}
        </Text>
      )}
    </FormControl>
  )
}

export default React.forwardRef(Input)
