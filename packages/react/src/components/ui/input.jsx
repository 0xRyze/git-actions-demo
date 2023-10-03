import React from 'react'
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  FormControl,
  Input as ChakraInput,
  InputGroup,
  Text,
} from '@chakra-ui/react'
import { inputAnatomy } from '@chakra-ui/anatomy'

const Input = React.forwardRef(
  (
    { label, error, placeholder, helperText, isInvalid, as = ChakraInput, InputLeftAddon, InputRightAddon, ...rest },
    ref,
  ) => {
    const { disabled } = rest
    const InputComp = as
    return (
      <FormControl isInvalid={isInvalid} opacity={disabled ? 0.4 : 1}>
        {label && (
          <Text color={isInvalid ? 'destructive' : 'foreground'} fontWeight={'medium'} fontSize={'sm'} lineHeight={1}>
            {label}
          </Text>
        )}
        <InputGroup mt="2">
          {InputLeftAddon}
          <InputComp variant={''} placeholder={placeholder} {...rest} ref={ref} />
          {InputRightAddon}
        </InputGroup>
        {helperText && (
          <Text fontSize={'xs'} mt={2} color={'mutedForeground'}>
            {helperText}
          </Text>
        )}
        {isInvalid && error && (
          <Text fontSize={'xs'} mt={2} color="destructive">
            {error}
          </Text>
        )}
      </FormControl>
    )
  },
)

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    color: 'foreground',
    background: 'background',
    boxShadow: 'base',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'input',
    borderRadius: 'lg',
    _focusVisible: {
      borderColor: 'ring',
    },
    _hover: {},
    _disabled: {
      opacity: 1,
    },
    _placeholder: {
      color: 'mutedForeground',
    },
  },
})

const sm = defineStyle({
  borderRadius: 'md',
})

const sizes = {
  sm: definePartsStyle({ field: sm }),
}

const InputTheme = defineMultiStyleConfig({ baseStyle, sizes })

export { Input, InputTheme }
