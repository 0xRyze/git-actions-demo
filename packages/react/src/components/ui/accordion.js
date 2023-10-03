import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)

const baseStyle = definePartsStyle({
  root: {},
  container: {
    mb: 1,
    borderRadius: 'lg',
    borderColor: 'input',
    border: '1px solid',
  },
  button: {},
  panel: {},
  icon: {},
})

const AccordionTheme = defineMultiStyleConfig({ baseStyle })

export { AccordionTheme }
