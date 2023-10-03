import { Image, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import React from 'react'

const FeaturedCollectionPopover = () => {
  return (
    <Popover autoFocus={false} trigger="hover" placement="right">
      <PopoverTrigger>
        <Image mt="-0.5" src={'https://i.ibb.co/7VX9zk4/Rectangle-1.png'} width="3" h={'3'} />
      </PopoverTrigger>
      <PopoverContent width={'fit-content'}>
        <PopoverArrow />
        {/*<PopoverCloseButton />*/}
        <PopoverBody>
          <Text fontSize={14} fontWeight={500}>
            Featured Collection
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default FeaturedCollectionPopover
