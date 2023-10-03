import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle({
  control: {
    borderColor: 'primary',
    borderRadius: '4px',
    _checked: {
      color: 'background',
      background: 'primary',
      borderColor: 'primary',
      _hover: {
        background: 'primary',
        borderColor: 'primary',
      },
      _disabled: {
        background: 'input',
        borderColor: 'input',
        color: 'background',
      },
    },
  },
})

export const CheckboxTheme = defineMultiStyleConfig({ baseStyle })
