import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys)

const baseStyle = definePartsStyle({
  tab: {
    background: 'muted',
    color: 'foreground',
    borderRadius: 'md',
    _selected: {
      background: 'background',
      boxShadow: 'base',
    },
  },
  tablist: {
    background: 'muted',
    color: 'mutedForeground',
    padding: '5px',
    borderRadius: 'md',
  },
  tabpanel: {
    padding: 0,
  },
  tabpanels: {},
  indicator: {
    background: 'foreground',
  },
})

export const TabsTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    variant: 'unstyled',
    size: 'md',
  },
})
