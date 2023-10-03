import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Input } from '../../components/ui/input'

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  height: 40px;
  border-radius: 12px;
`
const CounterButtons = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 32px;
  width: 32px;
  //border-radius: 12px;
  //border: none;
  //border: 1px solid ${(p) => p.theme.colors.border};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'unset')};
  opacity: ${(p) => (p.disabled ? '0.5' : '1')};

  &:active {
    border: 1px solid ${(p) => p.theme.colors.foreground};
  }

  svg {
    path {
      fill: ${(p) => p.theme.colors.foreground};
    }
  }
`

const View = styled(Input)`
  justify-content: center;
  font-size: 18px;
  min-width: 60px;
  user-select: none;
  border: none;
  box-shadow: none;
  max-width: 80px;
  text-align: center;
`

const Index = ({ initialState = 1, maxState, onChange, value, onError }) => {
  const [counter, setCounter] = useState(initialState)

  useEffect(() => {
    onChange(counter)
  }, [counter])

  useEffect(() => {
    setCounter(initialState)
  }, [initialState])

  useEffect(() => {
    if ((maxState > 0 && value > maxState) || counter < 1) {
      onError(true)
    } else {
      onError(false)
    }
  }, [maxState, value, counter])

  const onChangeInput = (e) => {
    const value = Number(e.target.value)
    setCounter(value)
  }

  const handleDecrement = () => {
    if (value > initialState) {
      setCounter((_value) => value - 1)
    }
  }
  const handleIncrement = () => {
    if (maxState) {
      if (value < maxState) {
        setCounter((_value) => value + 1)
      }
    } else {
      setCounter((_value) => value + 1)
    }
  }

  return (
    <Flex flexDirection="column" alignItems="flex-end">
      <Container>
        <CounterButtons variant="outline" onClick={handleDecrement} disabled={value === 1}>
          <MinusIcon />
        </CounterButtons>

        <View value={value} onChange={onChangeInput} />
        <CounterButtons variant="outline" onClick={handleIncrement} disabled={maxState === value || !maxState}>
          <AddIcon />
        </CounterButtons>
      </Container>
      {((maxState > 0 && value > maxState) || counter < 1) && (
        <Text fontSize={12} mt={10} color="#E11900">
          Enter quantity between 1 to {maxState}
        </Text>
      )}
    </Flex>
  )
}

export default Index
