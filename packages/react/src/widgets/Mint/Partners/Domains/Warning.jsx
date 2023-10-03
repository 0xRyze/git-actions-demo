import React from 'react'
import { Box, Flex, ListItem, OrderedList, Text } from '@chakra-ui/react'

const Warning = () => {
  return (
    <Box paddingX={3} position="relative" paddingY={2} mb={3} zIndex="1" border="1px solid #cccccc" borderRadius={10}>
      <Text fontSize={12} fontWeight={500}>
        Note: Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit
        amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
      </Text>
    </Box>
  )
  return (
    <Flex
      direction="column"
      position="absolute"
      bg="rgba(255,255,255,0.5)"
      zIndex={2}
      top={0}
      left={0}
      w="full"
      h="full"
    >
      <Text>Note:</Text>
      <OrderedList>
        <ListItem>Lorem ipsum dolor sit amet</ListItem>
        <ListItem>Consectetur adipiscing elit</ListItem>
        <ListItem>Integer molestie lorem at massa</ListItem>
        <ListItem>Facilisis in pretium nisl aliquet</ListItem>
      </OrderedList>
    </Flex>
  )
}

export default Warning
