import styled from '@emotion/styled'
import { Box, Button } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

export const LoadingScreen = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--bad-colors-background);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 16px;
`

export const StyledLink = styled.a`
  // color: ${({ theme }) => theme.colors.primary} !important;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.primary} !important;
  margin-top: 10px;
  font-size: 14px;
`

export const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  right: 5%;
  top: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`

export const StyledButton = styled(Button)`
  &:hover {
    background-color: ${({ theme }) => theme.colors.foreground} !important;
    color: ${({ theme }) => theme.colors.background};
  }
`
