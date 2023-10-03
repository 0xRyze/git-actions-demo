import React from 'react'
import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { BsApple, BsGoogle } from 'react-icons/bs'
import { createEvent } from 'ics'
import { useRootContext } from '../../../../context/RootContext'

const getDateValues = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [year, month, day, hour, minute]
}

const LaunchDateReminder = ({ isOpen, onClose, reminderCollection }) => {
  const { rootRef } = useRootContext()
  const createICalEventUrl = async (startTime, eventTitle, eventDetails) => {
    const event = {
      start: getDateValues(new Date(startTime * 1000)),
      duration: { hours: 24 },
      title: eventTitle,
      description: eventDetails,
    }
    const filename = `${eventTitle}.ics`
    const file = await new Promise((resolve, reject) => {
      createEvent(event, (error, value) => {
        if (error) {
          reject(error)
        }

        resolve(new File([value], filename, { type: 'plain/text' }))
      })
    })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    URL.revokeObjectURL(url)
  }
  const createGoogleCalendarEventUrl = (startTime, eventTitle, eventDetails) => {
    const startTimeISO = new Date(startTime * 1000).toISOString().replace(/-|:|\.\d+/g, '')
    const endTimeISO = new Date(startTime * 1000 + 1 * 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '')
    const encodedTitle = encodeURIComponent(eventTitle)
    const encodedDetails = encodeURIComponent(eventDetails)
    const baseUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit'
    const params = `dates=${startTimeISO}/${endTimeISO}&text=${encodedTitle}&details=${encodedDetails}&location=&allday=false`
    return `${baseUrl}?${params}`
  }
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} portalProps={{ containerRef: rootRef }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="foreground" fontSize="md">
          Add reminder to your calender
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <Flex justifyContent="space-between" alignItems="center" mb={1}>
            <Flex alignItems="center">
              <Icon as={BsGoogle} h="4" w="4" color="mutedForeground" />
              <Text ml="2" fontSize={'sm'}>
                Google Calender
              </Text>
            </Flex>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = createGoogleCalendarEventUrl(
                  reminderCollection?.stats?.startDate,
                  reminderCollection?.profile?.name,
                  `Get your hands on ${reminderCollection?.profile?.name} NFT Collection. Mint powered by Bandit.`,
                )
                window.open(url)
              }}
            >
              Add
            </Button>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mv="6">
            <Flex alignItems="center">
              <Icon as={BsApple} h="4" w="4" color="mutedForeground" />
              <Text ml="2" fontSize={'sm'}>
                iCalender
              </Text>
            </Flex>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                createICalEventUrl(
                  reminderCollection?.stats?.startDate,
                  reminderCollection?.profile?.name,
                  `Get your hands on ${reminderCollection?.profile?.name} NFT Collection. Mint powered by Bandit.`,
                ).catch((error) => console.log(error))
                // window.open(url)
              }}
            >
              Add
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LaunchDateReminder
