import styled from '@emotion/styled'
import { Box, Flex } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

export const BG = styled.div`
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.72) 100%);
  width: 100%;
  height: 100%;
  z-index: 1401;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
`
export const Centered = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
export const StyledModal = styled(Box)`
  position: relative;
  width: 650px;
  min-height: 250px;
  max-height: 600px;
  overflow-y: auto;
  z-index: 10;
  border-radius: 10px;
  box-shadow: 0 0 30px -5px rgba(0, 0, 0, 0.3);
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 649px) {
    width: 500px;
  }

  @media (max-width: 499px) {
    width: 350px;
  }

  @media (max-width: 349px) {
    width: 100%;
  }
`
export const ModalFooter = styled(Flex)`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-top: 20px;
  margin-top: auto;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`
export const StyledCloseIcon = styled(CloseIcon)`
  //position: absolute;
  //right: 5%;
  //top: 27px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`
