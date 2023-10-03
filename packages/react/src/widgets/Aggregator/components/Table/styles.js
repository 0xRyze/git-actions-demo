import { Box, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'

export const TContainer = styled(Box)``
export const THeader = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  padding: 0.5rem 0;
`
export const TBody = styled(Box)``
export const TRow = styled(Flex)`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  padding: 0.5rem 0;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`
export const ThCell = styled(Flex)`
  padding-right: 1rem;
`

export const TdCell = styled(Flex)`
  padding-right: 1rem;

  &:last-child {
    padding-right: 0;
  }
`

export const NoData = styled(Flex)`
  min-height: 20vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
