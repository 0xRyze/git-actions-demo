import React from 'react'
import { Box, Flex, Link, Spinner, Text } from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon, WarningIcon } from '@chakra-ui/icons'

const LoadingItem = ({ failed, completed, inProgress, title, isLast, hasLink, link }) => {
  return (
    <Flex align="center" h={10}>
      <Box
        h={1}
        w={1}
        bg="foreground"
        borderRadius="50%"
        position="relative"
        _after={
          !isLast && {
            content: '""',
            position: 'absolute',
            top: '1',
            left: '50%',
            border: '1px solid',
            borderColor: completed ? 'mutedForeground' : 'muted',
            height: '9',
            transform: 'translateX(-50%)',
          }
        }
      />
      <Flex alignItems={'center'}>
        <Text ml={4}>{title}</Text>
        {hasLink && (
          <Link href={link} isExternal>
            <ExternalLinkIcon ml={'10px'} cursor="pointer" />
          </Link>
        )}
      </Flex>
      <Flex ml="auto">
        {failed ? (
          <Flex align="center">
            <Text fontSize="sm" color="destructive" mr={1}>
              Failed
            </Text>
            <WarningIcon color="destructive" />
          </Flex>
        ) : completed ? (
          <CheckCircleIcon />
        ) : inProgress ? (
          <Flex align="center">
            <Text fontSize="sm" color="mutedForeground" mr={1}>
              In progress
            </Text>
            <Spinner color="mutedForeground" size="sm" />
          </Flex>
        ) : (
          <Box h={4} w={4} borderRadius="50%" color="mutedForeground" border="2px solid" />
        )}
      </Flex>
    </Flex>
  )
}

export default LoadingItem
