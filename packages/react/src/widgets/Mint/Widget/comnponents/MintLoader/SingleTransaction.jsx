import React from 'react'
import { Link, Spinner, Text } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'

const SingleTransaction = ({ transaction }) => {
  return (
    <Flex direction="column" align="center">
      {transaction?.completed === 'pending' ? (
        <Loading />
      ) : transaction?.completed === 'error' ? (
        <Error />
      ) : transaction?.completed === 'completed' ? (
        <Completed />
      ) : (
        <Loading />
      )}
      <Flex h="10">
        {transaction?.completed === 'completed' && (
          <Link fontSize="xs" fontWeight={'semibold'} mt={8} onClick={() => window.open(transaction?.link)}>
            View on Explorer
          </Link>
        )}
      </Flex>
    </Flex>
  )
}

const Loading = () => {
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        <Spinner size="md" />
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Transaction Pending
      </Text>
    </Flex>
  )
}

const Completed = () => {
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        🎉
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Mint Successful
      </Text>
    </Flex>
  )
}

const Error = () => {
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        ❌
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Mint Failed
      </Text>
    </Flex>
  )
}

export default SingleTransaction
