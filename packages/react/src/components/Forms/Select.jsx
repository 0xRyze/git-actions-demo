import React from 'react'
import { Select as ChakraSelect, Text } from '@chakra-ui/react'

const Select = ({ label, options, error, ...rest }, ref) => {
  return (
    <div>
      <Text>{label}</Text>
      <ChakraSelect placeholder="Select option" {...rest} ref={ref}>
        {options?.map(({ label, value }, index) => (
          <option key={`${value}_${index}`} value={value}>
            {label}
          </option>
        ))}
      </ChakraSelect>
      {error && <Text color="red.300">{error}</Text>}
    </div>
  )
}

export default React.forwardRef(Select)
