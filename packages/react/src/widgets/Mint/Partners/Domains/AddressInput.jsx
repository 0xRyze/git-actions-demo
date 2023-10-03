import React from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import { isAddress } from '@ethersproject/address'
import styled from '@emotion/styled'
import { Input } from '../../../../components/ui/input'

const StyledBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: -30px;
    width: 100%;
    height: 32px;
    background: rgb(255, 255, 255);
    background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
  }
`

const AddressInput = ({ address, setAddress }) => {
  const toast = useToast()
  const onChangeAddress = (e) => {
    const address = e.target.value
    if (isAddress(address)) {
      setAddress(address)
    } else {
      toast({ title: 'Invalid ethereum address', description: 'Please enter valid address', status: 'error' })
      setAddress('')
    }
  }
  return (
    <StyledBox paddingY={4}>
      <Input placeholder="Enter ethereum wallet address" value={address} onChange={onChangeAddress} />
      <Text fontSize={14} mt={2}>
        Note: Enter correct wallet address for domain mapping. We are not liable for any discrepancies caused by an
        incorrect address
      </Text>
    </StyledBox>
  )
}

export default AddressInput
