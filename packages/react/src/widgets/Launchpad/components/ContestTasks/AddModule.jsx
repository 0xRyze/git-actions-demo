import React, { useState } from 'react'
import { Accordion, Box, Button, Flex, FormControl, Text, useToast } from '@chakra-ui/react'
import AddTask from './AddTask'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Task from '../../../Mint/Widget/comnponents/Contests/Task'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { Input } from '../../../../components/ui/input'

const moduleSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  mintCount: yup.number().required('Number of mints is required'),
})

const AddModule = ({
  onClickBack,
  addModule,
  editModule,
  editModuleIndex,
  isEdit,
  defaultValues,
  resetDefaultValues,
}) => {
  const [tasks, setTasks] = useState(defaultValues?.tasks ? defaultValues?.tasks : [])
  const [editTaskIndex, setEditTaskIndex] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(moduleSchema),
    defaultValues: {
      name: defaultValues?.name ? defaultValues?.name : '',
      mintCount: defaultValues?.rewardData?.count ? defaultValues?.rewardData?.count : null,
    },
  })

  const toast = useToast()
  const onClickDone = (state) => {
    if (!tasks.length)
      return toast({
        title: "Group doesn't have any tasks",
        status: 'warning',
      })
    const module = {
      name: state.name,
      req: '*',
      rewardData: {
        type: 'mint_enable',
        count: state.mintCount,
      },
      tasks,
      readOnly: false,
    }
    if (!isEdit) {
      addModule(module)
    } else {
      editModule(editModuleIndex, module)
      resetDefaultValues()
    }
    onClickBack()
  }

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task])
  }
  const editTask = (index, task) => {
    setTasks((tasks) => [...tasks.slice(0, index), task, ...tasks.slice(index + 1)])
    setEditTaskIndex(null)
  }
  const resetTask = () => {
    setEditTaskIndex(null)
  }
  const deleteTask = (index) => {
    setTasks((tasks) => [...tasks.slice(0, index), ...tasks.slice(index + 1)])
  }
  const verifyTasks = (type) => {
    if (type !== 'offchain_rest_api') return true
    return tasks.some((task) => task.type === 'email_verify')
  }
  return (
    <Box background="background" zIndex={1} width="full" height="full">
      <Text mb={4} fontSize={14}>
        A whitelist can have any number of groups, and each group can contain any number of tasks. Users would be able
        to mint a specific number of NFTS after completing each group of tasks.
      </Text>
      <FormControl isInvalid={!!errors.name}>
        <Input placeholder="Group Name" {...register('name')} mb={2} />
      </FormControl>
      <FormControl isInvalid={!!errors.mintCount}>
        <Input placeholder="Allowed number of mints on quest completion per user" {...register('mintCount')} mb={2} />
      </FormControl>

      <Box>
        <Accordion allowToggle>
          {tasks.map((task, index) => (
            <Flex key={index} flexDir="column" my="2">
              <Flex alignItems={'center'} justifyContent="flex-end" mb="1">
                <EditIcon
                  w="3"
                  h="3"
                  mr="2"
                  cursor="pointer"
                  onClick={() => {
                    setEditTaskIndex(index)
                  }}
                />
                <CloseIcon w="3" h="3" cursor="pointer" ml="1" onClick={() => deleteTask(index)} />
              </Flex>
              <Task task={task} key={index} readonly={true} />
            </Flex>
          ))}
        </Accordion>
      </Box>

      <Box>
        <AddTask
          addTask={addTask}
          editTask={editTask}
          isEdit={editTaskIndex !== null}
          editTaskIndex={editTaskIndex}
          defaultValues={tasks[editTaskIndex]}
          resetDefaultValues={resetTask}
          verifyTasks={verifyTasks}
        />
      </Box>

      <Flex justify="flex-end" mt={8}>
        <Button
          variant={'outline'}
          onClick={() => {
            onClickBack()
            resetDefaultValues()
          }}
        >
          Back
        </Button>
        <Button variant={'primary'} ml={4} onClick={handleSubmit(onClickDone)}>
          Save Changes
        </Button>
      </Flex>
    </Box>
  )
}

export default AddModule
