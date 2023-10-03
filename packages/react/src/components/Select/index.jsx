import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import React from 'react'

const Select = ({ options, onChange, defaultValue, isOpen, onOpen, onClose }) => {
  return (
    <Popover isOpen={isOpen} onClose={onClose} isLazy>
      <PopoverTrigger>
        <Button
          fontWeight={'semibold'}
          textAlign={'left'}
          overflow={'hidden'}
          w="full"
          size={'sm'}
          rightIcon={<ChevronDownIcon />}
          variant={'outline'}
          onClick={onOpen}
        >
          <Text textAlign={'left'} w="full">
            {defaultValue?.label}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent p="0" minW="40" w="fit-content" maxH="72" overflowY={'auto'}>
        <PopoverBody p="0">
          {options.map((option, index) => (
            <Flex
              key={index}
              onClick={() => {
                onChange(option)
                onClose()
              }}
              bg={option?.value === defaultValue?.value ? 'muted' : 'initial'}
              p="1.5"
              cursor={'pointer'}
              _hover={{
                bg: 'muted',
              }}
            >
              <Box>{option?.icon}</Box>
              <Text fontSize="14px" ml={1}>
                {option.label}
              </Text>
            </Flex>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Select
