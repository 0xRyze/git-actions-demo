import { progressAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(progressAnatomy.keys)

const baseStyle = definePartsStyle({
  label: {},
  filledTrack: {
    background: 'foreground',
  },
  track: {},
})
const ProgressTheme = defineMultiStyleConfig({ baseStyle })

export { ProgressTheme }
