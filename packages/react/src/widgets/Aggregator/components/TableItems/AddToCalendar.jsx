import React, { lazy, Suspense } from 'react'
import { Button, useDisclosure } from '@chakra-ui/react'

const LaunchDateReminder = lazy(() => import('../LaunchDateReminder'))

const AddToCalendar = ({ collection }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button fontSize="sm" fontWeight={500} variant="outline" size="sm" onClick={onOpen}>
        Add
      </Button>

      <Suspense fallback={null}>
        <LaunchDateReminder isOpen={isOpen} onClose={onClose} reminderCollection={collection} />
      </Suspense>
    </>
  )
}

export default AddToCalendar
