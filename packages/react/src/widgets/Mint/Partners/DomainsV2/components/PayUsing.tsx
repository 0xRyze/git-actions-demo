import { Flex, Select, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  getPayableCurrency: () => (
    | {
        label: string
        value: string
        ticker: string
        chain: number
        address?: undefined
      }
    | {
        label: string
        value: string
        ticker: string
        address: string
        chain: number
      }
  )[]
  payUsing: any
  onClickCustomPay: (e: any) => void
}

const PayUsing: React.FC<Props> = ({ getPayableCurrency, payUsing, onClickCustomPay }) => {
  return (
    <Flex justifyContent="space-between" mt={4} alignItems={'center'} mb="2">
      <Text color="foreground" fontWeight={400} fontSize={14}>
        Pay using
      </Text>
      <Flex justifyContent="center" align="center" mb={2}>
        <Select
          value={payUsing?.value}
          defaultValue={payUsing?.value}
          size="sm"
          onChange={onClickCustomPay}
          borderColor="muted"
          borderWidth="1.5px"
          borderRadius="lg"
          boxShadow="base"
          _hover={{}}
        >
          {getPayableCurrency().map(({ label, value }) => (
            <option value={value}>{label}</option>
          ))}
        </Select>
      </Flex>
    </Flex>
  )
}

export default PayUsing
