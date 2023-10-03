import React, { useRef } from 'react'
import { ChakraProvider } from '@chakra-ui/provider'
import { ToastProvider } from '@chakra-ui/toast'
import { Box, extendTheme } from '@chakra-ui/react'

import { getColors } from './styles'

import { InputTheme } from './components/ui/input'
import { ButtonTheme } from './components/ui/button'
import { MenuTheme } from './components/ui/menu'
import { ModalTheme } from './components/ui/modal'
import { TabsTheme } from './components/ui/tabs'
import { CheckboxTheme } from './components/ui/checkbox'
import { TooltipTheme } from './components/ui/tooltip'
import { DrawerTheme } from './components/ui/drawer'
import { useThemeDetector } from './hooks/useThemeDetector'
import { useConsumerContext } from './hooks/useConsumerContext'
import { ProgressTheme } from './components/ui/progress'
import { SelectTheme } from './components/ui/select'
import { AccordionTheme } from './components/ui/accordion'
import { TagTheme } from './components/ui/tag'

const breakpoints = {
  sm: '576px',
  md: '852px',
  lg: '968px',
  xl: '1080px',
  '2xl': '1200px',
}

const getTheme = (isDark, { design }) => {
  return extendTheme({
    styles: {
      global: {
        'html, body': {
          fontFamily: 'DM Sans, sans-serif',
          background: 'background',
          color: 'foreground',
        },
        '*': {
          borderColor: '#e5e7eb',
        },
        '.bandit-widget': {
          width: '100%',
        },
        '.chakra-collapse': {
          opacity: `${1} !important`,
        },
        '.aggregator-table': {
          fontFamily: 'DM Sans, sans-serif',
          background: 'background',
          color: 'foreground',
          padding: '20px 0',
        },
        '.portals': {
          position: 'relative',
          zIndex: 2147483645,
        },
      },
    },
    colors: getColors(isDark, design),
    breakpoints,
    shadows: {
      base: '0 1px 2px 0 rgba(0,0,0,.05)',
      ring: 'rgba(255,255,255) 0px 0px 0px 0px, var(--bad-colors-ring)  0px 0px 0px 1px, 0 1px 2px 0 rgba(0,0,0,.05)',
      lg: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 5px 10px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
    },
    components: {
      Input: InputTheme,
      Button: ButtonTheme,
      Menu: MenuTheme,
      Modal: ModalTheme,
      Tabs: TabsTheme,
      Checkbox: CheckboxTheme,
      Tooltip: TooltipTheme,
      Drawer: DrawerTheme,
      Progress: ProgressTheme,
      Select: SelectTheme,
      Accordion: AccordionTheme,
      Tag: TagTheme,
    },
    config: {
      initialColorMode: 'dark',
      cssVarPrefix: 'bad',
      useSystemColorMode: true,
    },
  })
}

export const ThemeProvider = ({ children }) => {
  const ref = useRef(null)

  const { config } = useConsumerContext()

  const { design } = config || {}

  const { theme = 'light' } = design || {}

  const isDarkTheme = useThemeDetector()

  return (
    <ChakraProvider
      theme={getTheme(theme === 'system' ? isDarkTheme : theme === 'dark', config)}
      // theme={getTheme(true)}
      portalZIndex={2147483645}
      toastOptions={{
        portalProps: {
          containerRef: ref,
        },
      }}
    >
      <ToastProvider portalProps={{ containerRef: ref }} />
      {children}
      {
        // Allow toast to be in front of modal
        <Box pos="relative" zIndex={2147483646} ref={ref} />
      }
    </ChakraProvider>
  )
}
