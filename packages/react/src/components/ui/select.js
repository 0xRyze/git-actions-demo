import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys)

const baseStyle = definePartsStyle({
  // field: {
  //   // borderColor: 'red !important',
  //   // border: '1px solid !important',
  // },
  // icon: {
  //   color: 'red',
  // },
})

const SelectTheme = defineMultiStyleConfig({ baseStyle })

export { SelectTheme }
