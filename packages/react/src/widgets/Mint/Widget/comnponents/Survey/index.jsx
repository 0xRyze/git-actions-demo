import React, { useEffect, useState } from 'react'
import SurveyItem from './SurveyItem'
import { Box, CloseButton, Flex, Text } from '@chakra-ui/react'
import { useConsumerContext } from '../../../../../hooks/useConsumerContext'
import { getSurvey } from '../../../../../state/survey/source'

const Survey = ({ closeSurvey }) => {
  const [selectedSurvey, setSelectedSurvey] = useState(0)
  const [surveyList, setSurveyList] = useState([])
  const [show, setShow] = useState('')
  const [ratings, setRatings] = useState([])
  const { accessKey } = useConsumerContext()

  const fetchSurvey = async () => {
    try {
      const res = await getSurvey(accessKey)
      setSurveyList(res)
    } catch (e) {}
  }

  useEffect(() => {
    fetchSurvey()
  }, [])

  const setEndView = (id, star) => {
    if (id && star) {
      let ratingTypesSurveyList = surveyList.filter((s) => s?.type === 'rating')
      let _rating = { id, star }
      let _ratings = [...ratings, _rating]
      let lowRatings = _ratings.filter((r) => r.star < 3)
      if (_ratings.length === ratingTypesSurveyList.length && lowRatings.length > 0) {
        setShow('contact')
      }
      if (_ratings.length === ratingTypesSurveyList.length && lowRatings.length === 0) {
        setShow('thanks')
      }
      setRatings([...ratings, _rating])
    } else {
      setShow('thanks')
    }
  }

  const tabs = show === 'contacts' ? surveyList.filter((s) => s?.type === 'rating') : surveyList

  return (
    <Flex
      direction="column"
      position="absolute"
      top={0}
      left={0}
      h="full"
      w="full"
      bg={'background'}
      p={2}
      opacity={0.9}
      zIndex={99}
    >
      <Flex justifyContent={'center'} mr="1" alignItems={'center'}>
        {selectedSurvey !== surveyList?.length && (
          <Text mt="1" fontSize={'lg'} textAlign="center">
            Help us to serve you better!
          </Text>
        )}
        <CloseButton onClick={closeSurvey} pos="absolute" right="3" top="2" />
      </Flex>

      {show === 'thanks' ? (
        <Flex w="full" h="full" flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
          <Text fontSize="24" textAlign="center">
            Thank you for completing the survey!
          </Text>
          <Text fontSize="md" color="mutedForeground" textAlign="center" mt="2">
            Your feedback is valuable to us.
          </Text>
        </Flex>
      ) : (
        <Flex w="full" h="full" flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
          <Flex align="center" justify="center">
            <SurveyItem
              {...surveyList[selectedSurvey]}
              selectedSurvey={selectedSurvey}
              setSelectedSurvey={setSelectedSurvey}
              setEndView={setEndView}
              show={show}
            />
          </Flex>
        </Flex>
      )}

      <Flex alignItems={'center'} mt="1" w="full" justifyContent={'center'}>
        {show !== 'thanks' &&
          tabs.map((survey, index) => (
            <Box w="10" h="1" bg={selectedSurvey === index ? 'primary' : 'input'} mx="1" borderRadius={'4'} />
          ))}
      </Flex>
    </Flex>
  )
}

export default Survey
