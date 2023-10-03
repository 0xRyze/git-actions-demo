import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  button: {},
  list: {
    p: 1,
    borderRadius: 'md',
    borderColor: 'input',
    bg: 'background',
  },
  item: {
    color: 'foreground',
    bg: 'background',
    p: 1,
    borderRadius: 'md',
    fontWeight: 'medium',
    fontSize: 'sm',
    _hover: {
      bg: 'muted',
    },
    _focus: {
      bg: 'muted',
    },
  },
})
const MenuTheme = defineMultiStyleConfig({ baseStyle })

export { MenuTheme }
