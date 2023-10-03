import React, { useState } from 'react'
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react'
import { TbStar, TbStarFilled } from 'react-icons/tb'
import { submitSurvey } from '../../../../../state/survey/source'
import { useConsumerContext } from '../../../../../hooks/useConsumerContext'
import useWalletContext from '../../../../../components/WalletModal/hooks/useWalletContext'

const SurveyItem = ({ question, id, link, type, selectedSurvey, setSelectedSurvey, setEndView, show }) => {
  const [star, setStar] = useState(-1)
  const { primaryAddress } = useWalletContext()
  const { accessKey } = useConsumerContext()
  const onHover = (star) => {
    setStar(star)
  }
  const submitRating = () => {
    try {
      submitSurvey(accessKey, primaryAddress, id, star + 1)
      setSelectedSurvey(selectedSurvey + 1)
      setEndView(id, star + 1)
    } catch (e) {}
  }

  const handleButton = () => {
    window.open(link?.dest)
    setSelectedSurvey(selectedSurvey + 1)
    setEndView()
  }

  return (
    <Flex flexDir={'column'}>
      <Text mb={2} textAlign="center">
        {question}
      </Text>
      {type === 'rating' && (
        <Flex justifyContent={'center'}>
          {Array.from(Array(5).keys()).map((index) => (
            <Box
              key={index}
              onClick={submitRating}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(-1)}
            >
              <Icon cursor="pointer" h={8} w={8} as={star >= index ? TbStarFilled : TbStar} />
            </Box>
          ))}
        </Flex>
      )}
      {type === 'link' && show === 'contact' && (
        <Flex justify="center">
          {link?.name && (
            <Button size="sm" onClick={handleButton}>
              {link?.name}
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default SurveyItem
