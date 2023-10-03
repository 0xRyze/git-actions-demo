import React from 'react'
import { Box, Button, Flex, Textarea } from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCreateContext } from '../../hooks/useCreateContext'
import { Input } from '../../../../components/ui/input'

const Schema = yup.object().shape({
  name: yup.string().required('Collection name is required'),
  description: yup.string().required('Collection description is required'),
})

const Collection = () => {
  const { goToNext, createState, setCreateState } = useCreateContext()

  const { profile } = createState

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      name: profile.name,
      description: profile.description,
    },
  })

  const onClickProceed = () => {
    handleSubmit((data) => {
      const { name, description } = data
      setCreateState((state) => ({
        ...state,
        profile: {
          ...state.profile,
          name,
          description,
        },
      }))
      goToNext()
    })()
  }

  return (
    <>
      <Input
        label="Collection Name"
        placeholder={'NFT Collection'}
        {...register('name')}
        isInvalid={errors.name}
        error={errors?.name?.message}
      />
      <Box mt={4}>
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
          as={Textarea}
          label="Collection Description"
          placeholder={'NFT Collection Description'}
          {...register('description')}
          isInvalid={errors.description}
          error={errors?.description?.message}
        />
      </Box>

      <Flex justifyContent="flex-end" mt={'auto'}>
        <Button variant={'primary'} onClick={onClickProceed}>
          Proceed
        </Button>
      </Flex>
    </>
  )
}

export default Collection
