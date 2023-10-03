import { defineStyleConfig } from '@chakra-ui/react'

const baseStyle = {
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'input',
  fontWeight: 'normal',
  color: 'background',
  background: 'foreground',
  fontSize: 'xs',
}

export const TooltipTheme = defineStyleConfig({ baseStyle })
