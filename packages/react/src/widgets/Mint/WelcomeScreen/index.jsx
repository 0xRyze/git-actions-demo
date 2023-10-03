import React from 'react'
import styled from '@emotion/styled'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { banditBRound } from '../../../assets/images'

const Brand = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const BrandWrapper = styled(Box)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
`

const WelcomeScreen = ({ onClickConnectWallet, clientConfig }) => {
  const { profile } = clientConfig
  const clientPicture = profile?.profileImage

  return (
    <Box bg="background">
      <Flex justifyContent="center">
        <BrandWrapper zIndex={1}>
          <Brand src={clientPicture || banditBRound} alt="brand" />
        </BrandWrapper>
        <BrandWrapper marginLeft={'-10px'}>
          <Brand src={banditBRound} />
        </BrandWrapper>
      </Flex>

      <Box style={{ textAlign: 'center' }}>
        <Text textAlign="center" fontWeight={500} fontSize={12} marginY={'20px  !important'}>
          Choose how you want to connect. There are several wallet providers.
        </Text>
        <Button variant={'primary'} onClick={onClickConnectWallet}>
          Connect Wallet
        </Button>
      </Box>
    </Box>
  )
}

export default WelcomeScreen
