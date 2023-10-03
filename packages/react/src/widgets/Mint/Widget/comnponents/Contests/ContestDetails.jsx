import React from 'react'
import ContestModule from './ContestModule'
import { Accordion, Box } from '@chakra-ui/react'
import styled from '@emotion/styled'

const StyledBox = styled(Box)`
  .chakra-accordion__item {
    border: 1px solid grey;
    border-radius: 12px;
    margin-bottom: 10px;
  }
`

const ContestDetails = ({ modules, collectionContest }) => {
  const { modulesStatus } = collectionContest

  return (
    <StyledBox marginY={5}>
      <Accordion allowToggle defaultIndex={0}>
        {modules.map((module, index) => (
          <ContestModule
            key={index}
            module={module}
            status={modulesStatus[module.id]}
            collectionContest={collectionContest}
          />
        ))}
      </Accordion>
    </StyledBox>
  )
}

export default ContestDetails
