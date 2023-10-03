import { Text } from '@chakra-ui/react'

const OneHourMints = ({ hourlyMint }) => {
  return (
    <Text fontSize={['xs', 'sm']} fontWeight={'medium'}>
      {!!hourlyMint ? hourlyMint : '-'}
    </Text>
  )
}

export default OneHourMints
