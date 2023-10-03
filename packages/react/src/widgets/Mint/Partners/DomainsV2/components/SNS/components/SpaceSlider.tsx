import { Box, Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React from 'react'

interface Props {
  size: number
  setSize: any
  loading: boolean
  subTotalPrice: any
}

const sizeGuide =
  'https://docs.bonfida.org/collection/naming-service/how-to-create-a-solana-domain-name/purchasing-a-domain-name/direct-registration'

const StyledBox = styled(Flex)`
  position: relative;
`

const SpaceSlider: React.FC<Props> = ({ size, setSize, loading, subTotalPrice }) => {
  return (
    <StyledBox paddingY={4} flexDir={'column'} alignItems={'center'}>
      <Slider defaultValue={0} min={1} max={10} step={1} w="94%" onChange={setSize} value={size}>
        <SliderTrack bg={'muted'}>
          <Box position="relative" right={10} />
          <SliderFilledTrack bg={'mutedForeground'} />
        </SliderTrack>
        <SliderThumb boxSize={4} borderColor={'mutedForeground'} borderWidth={'1'} />
      </Slider>
      <Flex justifyContent={'space-between'} w="full" mt="1">
        <Text fontSize={'12'}>1 Kb</Text>
        <Text fontSize={'12'}>10 Kb</Text>
      </Flex>
      <Flex w="full" justifyContent={'space-between'}>
        <Text fontSize={14} mt={4} fontWeight={'semibold'}>
          Selected Size: {`${size} Kb`}
        </Text>
        <Text
          fontSize={14}
          mt={4}
          textDecoration={'underline'}
          cursor={'pointer'}
          onClick={() => window.open(sizeGuide)}
          textAlign={'right'}
        >
          How much storage is right for you?
        </Text>
      </Flex>
      <Flex w="full" justifyContent={'space-between'} alignItems={'center'}>
        <Text fontSize={14} mt={4} fontWeight={'bold'}>
          Storage cost
        </Text>
        <Flex alignItems={'flex-end'} justifyContent={'center'} mt={4}>
          {loading ? (
            <Spinner size="xs" mb="1" />
          ) : (
            <Text fontSize={14} fontWeight={'bold'}>
              +{`${(subTotalPrice / LAMPORTS_PER_SOL)?.toFixed(5)}`}
            </Text>
          )}
          <Text ml="1" fontSize={14} fontWeight={'bold'}>
            {`SOL`}
          </Text>
        </Flex>
      </Flex>
    </StyledBox>
  )
}

export default SpaceSlider
