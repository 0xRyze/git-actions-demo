import dayjs from 'dayjs'
import { Text } from '@chakra-ui/react'

const LaunchDate = ({ startDate }) => {
  return (
    <Text noOfLines={1} fontSize={['xs', 'sm']} fontWeight={'medium'}>
      {dayjs.unix(startDate).format('MMM DD YYYY, h:mm a')}
    </Text>
  )
}

export default LaunchDate
