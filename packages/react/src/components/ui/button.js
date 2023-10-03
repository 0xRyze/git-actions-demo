import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const primary = defineStyle({
  background: 'primary',
  color: 'secondary',
  fontWeight: 'medium',
  boxShadow: 'base',

  _disabled: {
    opacity: '0.5',
  },

  _hover: {
    background: 'primary',
    opacity: 0.9,
    _disabled: {
      background: 'primary',
      opacity: '0.5',
    },
  },
  _active: {
    background: 'primary',
  },
  _focusVisible: {
    boxShadow: 'ring',
    _disabled: {
      boxShadow: 'ring',
    },
  },
})

const secondary = defineStyle({
  background: 'secondary',
  color: 'primary',
  boxShadow: 'base',
  border: 'none',

  _disabled: {
    opacity: '0.5',
  },

  _hover: {
    background: 'secondary',
    opacity: 0.8,
    _disabled: {
      background: 'secondary',
      opacity: '0.5',
    },
  },
  _active: {
    background: 'secondary',
  },
  _focusVisible: {
    boxShadow: 'ring',
    _disabled: {
      boxShadow: 'ring',
    },
  },
})

const outline = defineStyle({
  background: 'background',
  color: 'foreground',

  borderColor: 'input',
  boxShadow: 'base',

  _disabled: {
    opacity: '0.5',
  },

  _active: {
    background: 'background',
  },

  _hover: {
    background: 'secondary',
    color: 'primary',
    boxShadow: 'base',
    _disabled: {
      background: 'secondary',
      opacity: '0.5',
    },
  },
  _focusVisible: {
    boxShadow: 'ring',
    _disabled: {
      boxShadow: 'ring',
    },
  },
})

const ghost = defineStyle({
  color: 'foreground',

  _disabled: {
    opacity: '0.5',
  },
  _hover: {
    background: 'secondary',
    color: 'primary',
    _disabled: {
      background: 'secondary',
      opacity: '0.5',
    },
  },

  _active: {
    background: 'secondary',
  },

  _focusVisible: {
    boxShadow: 'ring',
    _disabled: {
      boxShadow: 'ring',
    },
  },
})

const link = defineStyle({
  color: 'foreground',

  _disabled: {
    opacity: '0.5',
  },

  _focusVisible: {
    boxShadow: 'none',
  },
})

const ButtonTheme = defineStyleConfig({
  defaultProps: {
    variant: 'primary',
  },
  variants: { primary, secondary, outline, ghost, link },
})

export { ButtonTheme }
