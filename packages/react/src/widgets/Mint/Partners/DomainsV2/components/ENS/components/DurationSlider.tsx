import { Flex, Spinner, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import Counter from '../../../../../../../components/Counter'

const StyledBox = styled(Flex)`
  position: relative;
`

interface Props {
  duration: number
  setDuration: any
  loading: boolean
  subTotalPrice: any
  payUsing: any
}

const DurationSlider: React.FC<Props> = ({ duration, setDuration, loading, subTotalPrice, payUsing }) => {
  return (
    <StyledBox paddingY={4} flexDir={'column'} alignItems={'center'}>
      <Counter initialState={1} maxState={10000} onChange={setDuration} onError={() => {}} value={duration} />
      <Flex w="full" justifyContent={'space-between'} alignItems={'center'}>
        <Text fontSize={14} mt={4} fontWeight={'bold'}>
          {`${duration} year registration`}
        </Text>
        <Flex alignItems={'flex-end'} justifyContent={'center'} mt={4}>
          {loading ? (
            <Spinner size="xs" mb="1.5" />
          ) : (
            <Text fontSize={14} fontWeight={'bold'}>
              {`${subTotalPrice?.toFixed(5)}`}
            </Text>
          )}
          <Text ml="1" fontSize={14} fontWeight={'bold'}>
            {payUsing?.ticker}
          </Text>
        </Flex>
      </Flex>
    </StyledBox>
  )
}

export default DurationSlider
