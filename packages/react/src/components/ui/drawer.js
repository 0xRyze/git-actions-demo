import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'brand.900',
    opacity: '0.6 !important',
    // backdropFilter: 'blur(4px)',
  },
  dialogContainer: {},
  dialog: {
    marginBottom: ['0', 'auto'],
    boxShadow: 'lg',
    borderWidth: '1px',
    // borderRadius: 'xl',
    borderTopLeftRadius: 'xl',
    borderTopRightRadius: 'xl',
    borderBottom: 'none',
    bg: 'background',
  },
  body: {},
})

export const DrawerTheme = defineMultiStyleConfig({
  baseStyle,
})
