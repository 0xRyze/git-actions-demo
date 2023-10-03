import React from 'react'
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import TaskDetails from './TaskDetails'
import { CheckCircleIcon } from '@chakra-ui/icons'

const ContestModule = ({ module, status, collectionContest, readonly = false }) => {
  const { id, name, tasks } = module
  const { tasksCompleted } = status || {}

  const isModuleTasksCompleted = tasksCompleted?.length === module?.tasks?.length
  return (
    <AccordionItem>
      {/* <h2> */}
      <AccordionButton>
        <AccordionIcon />
        <Box
          as="span"
          flex="1"
          textAlign="left"
          fontSize={14}
          fontWeight={500}
          color={isModuleTasksCompleted ? 'green' : 'inherit'}
        >
          {name}
        </Box>
        <CheckCircleIcon color={isModuleTasksCompleted ? 'green' : 'grey'} />
      </AccordionButton>
      {/* </h2> */}
      <AccordionPanel pb={4}>
        <TaskDetails
          moduleId={id}
          tasks={tasks}
          readonly={readonly}
          tasksCompleted={tasksCompleted}
          collectionContest={collectionContest}
        />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default ContestModule
