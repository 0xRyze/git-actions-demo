import React from 'react'
import LoadingItem from './LoadingItem'
import { Flex, Text } from '@chakra-ui/react'

interface Props {
  list: any[]
}

const LoadingStepper: React.FC<Props> = ({ list }) => {
  return (
    <Flex flexDir={'column'}>
      <Text fontSize="lg">Processing</Text>
      {list?.map((transaction, index) => (
        <LoadingItem
          key={index}
          inProgress={transaction?.completed === 'pending'}
          failed={transaction?.completed === 'error'}
          completed={transaction?.completed === 'completed'}
          title={transaction?.title}
          isLast={list?.length === index + 1}
          hasLink={transaction?.hasLink}
          link={transaction?.link}
        />
      ))}
    </Flex>
  )
}

export default LoadingStepper
