import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Input from '../../../../components/Forms/Input'

const taskSchema = yup.object().shape({
  name: yup.string().required('Task name is required'),
  description: yup.string().required('Task description is required'),
  taskType: yup.string().required('Task type is required'),
  taskAction: yup.string().required('Task action is required'),
  channelUsername: yup.string(),
  twitterPostId: yup.string(),
  // .required('Twitter post link is required'),
  twitterUsername: yup.string(),
  // .required('Twitter account is required'),
  discordInviteLink: yup.string(),
  graphEndPoint: yup.string(),
  graphQuery: yup.string(),
  graphExpression: yup.string(),
  channelAddress: yup.string(),
  // .required('Discord link is required'),
})

const AddTask = ({ addTask, editTask, defaultValues, editTaskIndex, isEdit, resetDefaultValues, verifyTasks }) => {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      taskType: 'twitter',
      taskAction: '',
      channelUsername: '',
      twitterPostId: '',
      twitterTweet: '',
      twitterUsername: '',
      discordInviteLink: '',
      graphEndPoint: '',
      graphQuery: '',
      graphExpression: '',
      channelAddress: '',
    },
  })

  const onSubmitTask = (state) => {
    const type = state.taskType + '_' + state.taskAction
    let key = null
    if (type === 'telegram_join') {
      key = ['channelUsername']
    } else if (type === 'twitter_follow') {
      key = ['twitterUsername']
    } else if (type === 'twitter_tweet') {
      key = ['twitterTweet']
    } else if (type === 'twitter_like' || type === 'twitter_retweet') {
      key = ['twitterPostId']
    } else if (type === 'discord_join') {
      key = ['discordInviteLink']
    } else if (type === 'onchain_graph') {
      key = ['graphEndPoint', 'graphQuery', 'graphExpression']
    } else if (type === 'offchain_rest_api') {
      key = ['apiEndPoint', 'apiQuery', 'apiExpression']
    } else if (type === 'email_verify') {
      key = ['']
    } else if (type === 'epns_subscription') {
      key = ['channelAddress']
    }

    const args = key.reduce((o, key) => ({ ...o, [key]: state[key] }), {})
    // if (!verifyTasks(type)) {
    //   return toast({
    //     title: 'Email Verification is required',
    //     description: 'Prior to Offchain REST API, Email verification task is must.',
    //     duration: 10000,
    //     isClosable: true,
    //     status: 'warning',
    //   })
    // }

    if (!isEdit) {
      addTask({
        name: state.name,
        description: state.description,
        type,
        args,
      })
    } else {
      editTask(editTaskIndex, {
        name: state.name,
        description: state.description,
        type,
        args,
      })
    }
    reset()
  }

  const onClickAdd = () => {
    handleSubmit(onSubmitTask)()
  }

  const watchAll = watch()

  useEffect(() => {
    if (defaultValues?.name) {
      setValue('name', defaultValues?.name ? defaultValues?.name : '')
      setValue('description', defaultValues?.description ? defaultValues?.description : '')
      setValue('taskType', defaultValues?.type ? defaultValues?.type?.split('_')[0] : '')
      setValue('taskAction', defaultValues?.type ? defaultValues?.type?.split('_')[1] : '')
      setValue('channelUsername', defaultValues?.args?.channelUsername ? defaultValues?.args?.channelUsername : '')
      setValue('twitterPostId', defaultValues?.args?.twitterPostId ? defaultValues?.args?.twitterPostId : '')
      setValue('twitterTweet', defaultValues?.args?.twitterTweet ? defaultValues?.args?.twitterTweet : '')
      setValue('twitterUsername', defaultValues?.args?.twitterUsername ? defaultValues?.args?.twitterUsername : '')
      setValue(
        'discordInviteLink',
        defaultValues?.args?.discordInviteLink ? defaultValues?.args?.discordInviteLink : '',
      )
      setValue('channelAddress', defaultValues?.args?.channelAddress ? defaultValues?.args?.channelAddress : '')
    }
  }, [defaultValues?.name])

  const getTaskInputsContent = () => {
    const state = getValues()
    const type = state.taskType + '_' + state.taskAction
    let title = null
    let value = null
    let prefix = null
    if (state.taskType === 'telegram') {
      if (state.taskAction === 'join') {
        title = 'Channel Username'
        value = 'channelUsername'
      }
    } else if (state.taskType === 'twitter') {
      if (state.taskAction === 'follow') {
        title = 'Twitter Handle'
        value = 'twitterUsername'
        prefix = 'twitter.com/'
      } else if (state.taskAction === 'tweet') {
        title = 'Tweet Text'
        value = 'twitterTweet'
      } else if (state.taskAction === 'like' || state.taskAction === 'retweet') {
        title = 'Tweet URL'
        value = 'twitterPostId'
        prefix = ''
      }
    } else if (state.taskType === 'discord') {
      title = 'Discord Invite'
      value = 'discordInviteLink'
      prefix = 'discord.gg/'
    } else if (state.taskType === 'epns') {
      if (state.taskAction === 'subscription') {
        title = 'Channel Address'
        value = 'channelAddress'
      }
    } else if (state.taskType === 'onchain' && state.taskAction === 'graph') {
      const graph = [
        {
          title: 'Graph Endpoint',
          value: 'graphEndPoint',
        },
        {
          title: 'Graph Query',
          value: 'graphQuery',
        },
        {
          title: 'Graph Expression',
          value: 'graphExpression',
        },
      ]

      return graph.map(({ title, value }) => (
        <Flex alignItems="center" justify="space-between">
          <Box>
            <Text>{title}</Text>
          </Box>
          <Box>
            {value && (
              <FormControl isInvalid={!!errors[value]}>
                <InputGroup mt="2">
                  <InputLeftAddon
                    children={prefix}
                    display={prefix ? 'flex' : 'none'}
                    backgroundColor={'muted'}
                    borderColor={'input !important'}
                  />
                  <Input {...register(value, { required: true })} />
                </InputGroup>
              </FormControl>
            )}
          </Box>
        </Flex>
      ))
    } else if (state.taskType === 'offchain' && state.taskAction === 'rest_api') {
      const graph = [
        {
          title: 'API Endpoint',
          value: 'apiEndPoint',
        },
        {
          title: 'API Query',
          value: 'apiQuery',
        },
        {
          title: 'API Expression',
          value: 'apiExpression',
        },
      ]

      return graph.map(({ title, value }) => (
        <Flex align="center" justify="space-between">
          <Box>
            <Text>{title}</Text>
          </Box>
          <Box>
            {value && (
              <FormControl isInvalid={!!errors[value]}>
                <InputGroup mt="2">
                  <InputLeftAddon children={prefix} display={prefix ? 'flex' : 'none'} />
                  <Input {...register(value, { required: true })} />
                </InputGroup>
              </FormControl>
            )}
          </Box>
        </Flex>
      ))
    }

    return (
      <Flex align="center" justify="space-between">
        <Box>
          <Text>{title}</Text>
        </Box>
        <Box>
          {value && (
            <FormControl isInvalid={!!errors[value]}>
              <InputGroup mt="2" alignItems={'flex-end'}>
                <InputLeftAddon
                  children={prefix}
                  display={prefix ? 'flex' : 'none'}
                  backgroundColor={'muted'}
                  borderColor={'input !important'}
                />
                <Input {...register(value, { required: true })} />
              </InputGroup>
            </FormControl>
          )}
        </Box>
      </Flex>
    )
  }

  const getActions = () => {
    const state = getValues()
    let actions = []

    if (state.taskType === 'telegram') {
      actions = [
        <option key="join" value="join">
          Join
        </option>,
      ]
    }

    if (state.taskType === 'twitter') {
      actions = [
        <option key="follow" value="follow">
          Follow
        </option>,
        <option key="like" value="like">
          Like
        </option>,
        <option key="retweet" value="retweet">
          Retweet
        </option>,
        <option key="tweet" value="tweet">
          Tweet
        </option>,
      ]
    }
    if (state.taskType === 'discord') {
      actions = [
        <option key="join" value="join">
          Invite
        </option>,
      ]
    }

    if (state.taskType === 'onchain') {
      actions = [
        <option key="graph" value="graph">
          Graph
        </option>,
      ]
    }
    if (state.taskType === 'offchain') {
      actions = [
        <option key="rest_api" value="rest_api">
          Rest API
        </option>,
      ]
    }

    if (state.taskType === 'email') {
      actions = [
        <option key="verify" value="verify">
          Verify
        </option>,
      ]
    }

    if (state.taskType === 'epns') {
      actions = [
        <option key="subscription" value="subscription">
          Push Subscription
        </option>,
      ]
    }

    return (
      <Flex align="center" justify="space-between" mb={4}>
        <Box>
          <Text>Action</Text>
        </Box>
        <Box>
          {actions && (
            <FormControl isInvalid={!!errors.taskAction}>
              <Select {...register('taskAction')} placeholder="Select Action" _hover={{}}>
                {actions}
              </Select>
            </FormControl>
          )}
        </Box>
      </Flex>
    )
  }

  return (
    <Box border="1px solid" borderRadius={12} p={3}>
      <FormControl isInvalid={!!errors.name}>
        <Input placeholder="Task Name" {...register('name')} mb={4} />
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <Input
          _focusVisible={{
            borderColor: 'ring',
          }}
          color="foreground"
          background="background"
          boxShadow="base"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="input"
          borderRadius="lg"
          _hover={{}}
          _disabled={{
            opacity: 1,
          }}
          _placeholder={{
            color: 'mutedForeground',
          }}
          placeholder="Task description"
          {...register('description')}
          mb={4}
          as={Textarea}
        />
      </FormControl>
      <Flex align="center" justify="space-between" mb={4}>
        <Box>
          <Text>Task Type</Text>
        </Box>
        <Box>
          <Select {...register('taskType')} _hover={{}}>
            <option value="telegram">Telegram</option>
            <option value="twitter">Twitter</option>
            <option value="discord">Discord</option>
            <option value="onchain">Onchain</option>
            <option value="offchain">Offchain</option>
            <option value="email">Email</option>
            <option value="epns">EPNS</option>
          </Select>
        </Box>
      </Flex>

      {getActions()}
      {getTaskInputsContent()}

      <Flex justify="end" mt={5}>
        <Button
          size="xs"
          mr="2"
          variant="outline"
          onClick={() => {
            reset()
            resetDefaultValues()
          }}
        >
          Reset
        </Button>
        <Button size="xs" onClick={onClickAdd}>
          {isEdit ? 'Save changes' : 'Add Task'}
        </Button>
      </Flex>
    </Box>
  )
}

export default AddTask
