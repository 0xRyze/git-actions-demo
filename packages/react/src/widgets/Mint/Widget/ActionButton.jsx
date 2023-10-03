import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

const ActionButton = ({ validators, fullWidth = false, ...restProps }) => {
  const failedValidator = validators.find((e) => !e.should)

  const mergedProps = {
    ...restProps,
    ...failedValidator?.fallbackProps,
  }
  const { children, onClick, disabled, helperText, isLoading = false } = mergedProps

  return (
    <Box style={{ textAlign: 'center' }}>
      <Button
        w={fullWidth ? 'full' : ''}
        variant="primary"
        onClick={onClick}
        isDisabled={disabled}
        isLoading={isLoading}
        loadingText={children}
      >
        {children}
      </Button>
      {helperText && (
        <Text color="foreground" fontSize="12px" textAlign="center" mb={'10px'} lineHeight={1} mt={2}>
          {helperText}
        </Text>
      )}
    </Box>
  )
}

export default ActionButton
