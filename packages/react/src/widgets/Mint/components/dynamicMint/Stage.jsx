import dayjs from 'dayjs'
import { Box, Flex, Text } from '@chakra-ui/layout'
import TokenIcon from '../../../../components/Svgs/tokenIcons'
import Countdown from 'react-countdown'
import React from 'react'
import { Tag } from '@chakra-ui/react'

const Stage = ({ isSelected, onClick, stageName, startDate, endDate, chainId, price, endless }) => {
  const hasStarted = dayjs.unix(startDate).isBefore(dayjs())
  const hasEnded = endless ? false : dayjs.unix(endDate).isBefore(dayjs())
  return (
    <Box
      paddingX={4}
      paddingY={4}
      onClick={hasEnded ? null : onClick}
      cursor={'pointer'}
      borderRadius={'lg'}
      border={isSelected ? '2px solid' : '2px solid'}
      borderColor={isSelected ? 'primary' : 'muted'}
      mb={4}
      pointerEvents={hasEnded ? 'none' : 'unset'}
    >
      <Flex justify="space-between" mb={2}>
        <Tag variant={'subtle'}>{stageName.toUpperCase()}</Tag>
        <Text>
          {hasStarted ? (
            endless ? (
              ''
            ) : hasEnded ? (
              'Ended'
            ) : (
              <TimeCounter name="Ends in" date={endDate} />
            )
          ) : (
            <TimeCounter name="Starts in" date={startDate} />
          )}
        </Text>
      </Flex>
      <Flex align="center">
        <Text>Price:</Text>
        <TokenIcon width={14} height={14} chainId={chainId} />
        <Text>{price}</Text>
      </Flex>
    </Box>
  )
}

const TimeCounter = ({ date, name }) => {
  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // TODO
      return 'Ended'
    } else {
      return (
        <span>
          {name} {hours}h:{minutes}m:{seconds}s
        </span>
      )
    }
  }
  return <Countdown date={new Date(dayjs.unix(date))} renderer={renderer} />
}

export default Stage
