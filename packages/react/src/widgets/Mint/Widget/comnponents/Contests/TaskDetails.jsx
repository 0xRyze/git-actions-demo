import React, { useState } from 'react'
import { Accordion } from '@chakra-ui/react'
import Task from './Task'
import useUser from '../../hooks/useUser'

const TaskDetails = ({ tasks, moduleId, collectionContest, tasksCompleted = [], readonly = false }) => {
  const [index, setIndex] = useState(0)
  const user = useUser()
  const onChange = (index) => {
    setIndex(index)
  }
  return (
    <Accordion allowToggle onChange={onChange} index={index}>
      {tasks.map((task, index) => (
        <Task
          key={index}
          moduleId={moduleId}
          task={task}
          collectionContest={collectionContest}
          index={index}
          user={user}
          readonly={readonly}
          isCompleted={tasksCompleted?.includes(task.id)}
        />
      ))}
    </Accordion>
  )
}

export default TaskDetails
