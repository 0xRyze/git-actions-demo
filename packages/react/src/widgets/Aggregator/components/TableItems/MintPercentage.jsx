import { Text } from '@chakra-ui/react'

const MintPercentage = ({ maxSupply, mintPercentage }) => {
  return (
    <Text fontSize={['xs', 'sm']} fontWeight={'medium'}>
      {maxSupply === 0 ? '-' : mintPercentage}
    </Text>
  )
}

export default MintPercentage
