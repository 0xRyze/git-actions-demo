import { Button } from '@chakra-ui/react'
import React from 'react'

const LaunchpadView = React.lazy(() => import('./Launchpad'))

const Launchpad = (props) => {
  const { onOpenLaunchpad } = props

  return (
    <>
      <Button variant="outline" size={'sm'} w={'120px'} onClick={onOpenLaunchpad} mr={2}>
        Launchpad
      </Button>
      <LaunchpadView {...props} />
    </>
  )
}

export default Launchpad
