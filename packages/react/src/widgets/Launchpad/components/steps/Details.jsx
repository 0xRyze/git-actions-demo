import React, { useCallback, useEffect } from 'react'
import { Box, Button, Checkbox, Flex, Image, InputLeftAddon, Text } from '@chakra-ui/react'
import FileUpload from '../FileUpload'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateContext } from '../../hooks/useCreateContext'
import { Input } from '../../../../components/ui/input'
import { getImageUrl } from '../../../../utils'

const Schema = yup.object().shape({
  cover: yup.mixed().test('required', 'Cover image is required', (file) => {
    if (file) return true
    return false
  }),
  profile: yup.mixed().test('required', 'Cover image is required', (file) => {
    if (file) return true
    return false
  }),
  twitter: yup.string(),
  discord: yup.string(),
  website: yup.string(),
})

const Details = () => {
  const { goToNext, createState, setCreateState, setShareSpaceDetails, shareSpaceDetails, isEditingCollection } =
    useCreateContext()
  const { space, profile } = createState

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      cover: '',
      profile: '',
      twitter: '',
      discord: '',
      website: '',
    },
  })

  useEffect(() => {
    if (shareSpaceDetails) {
      setValue('cover', space.coverImage)
      setValue('profile', space.profileImage)
      setValue('twitter', space?.socialmedia?.twitter)
      setValue('discord', space?.socialmedia?.discord)
      setValue('website', space?.socialmedia?.website)
    } else {
      setValue('cover', profile.coverImage)
      setValue('profile', profile.profileImage)
      setValue('twitter', profile?.socialmedia?.twitter)
      setValue('discord', profile?.socialmedia?.discord)
      setValue('website', profile?.socialmedia?.website)
    }
  }, [shareSpaceDetails, space])

  const onChangeShareSpaceDetails = useCallback(() => {
    setShareSpaceDetails(!shareSpaceDetails)
  }, [setShareSpaceDetails, shareSpaceDetails])

  const onClickSubmit = useCallback(
    (data) => {
      const { cover, profile, twitter, discord, website } = data
      setCreateState((state) => ({
        ...state,
        profile: {
          ...state.profile,
          coverImage: cover,
          profileImage: profile,
          socialmedia: {
            twitter,
            discord,
            website,
          },
        },
      }))

      goToNext()
    },
    [setShareSpaceDetails, shareSpaceDetails],
  )
  return (
    <div>
      <Text mb="2">Enter in the details of your collection that will be used for your collection page.</Text>
      {!isEditingCollection && (
        <Checkbox isChecked={shareSpaceDetails} marginY={2} onChange={onChangeShareSpaceDetails}>
          Use same as space
        </Checkbox>
      )}
      <FileUpload
        name="cover"
        control={control}
        acceptedFileTypes={['image/png']}
        schema={Schema}
        renderChild={({ click, image, error }) => (
          <Flex
            w="full"
            h="32"
            justifyContent={'center'}
            alignItems="center"
            onClick={click}
            cursor={'pointer'}
            userSelect="none"
            bg="muted"
            borderRadius={'8'}
            border={error ? '2px solid red' : 'none'}
            overflow="hidden"
          >
            <Text
              pos="absolute"
              fontSize="14"
              color={error ? 'red.500' : 'primary'}
              display={image ? 'none' : 'initial'}
            >
              Cover Image
            </Text>
            <Image
              src={
                shareSpaceDetails || typeof image !== 'object'
                  ? `${getImageUrl(image, { height: '512' })}`
                  : URL.createObjectURL(image)
              }
              w="full"
              h="32"
              bg="muted"
              borderRadius={'8'}
              objectFit="cover"
              display={image ? 'initial' : 'none'}
            />
          </Flex>
        )}
      />

      <FileUpload
        name="profile"
        control={control}
        acceptedFileTypes={['image/png']}
        schema={Schema}
        renderChild={({ click, image, error }) => (
          <Flex
            pos="absolute"
            top={'-10'}
            ml="4"
            bg="muted"
            h="20"
            w="20"
            borderRadius={'6'}
            justifyContent="center"
            alignItems={'center'}
            onClick={click}
            userSelect="none"
            cursor={'pointer'}
            border={error ? '2px solid red' : '2px solid white'}
            overflow="hidden"
          >
            <Text
              textAlign={'center'}
              fontSize="14"
              color={error ? 'red.500' : 'primary'}
              display={image ? 'none' : 'initial'}
            >
              Profile Image
            </Text>
            <Image
              pos="absolute"
              src={
                shareSpaceDetails || typeof image !== 'object'
                  ? `${getImageUrl(image, { height: '512' })}`
                  : URL.createObjectURL(image)
              }
              // top={'-1'}
              // ml="4"
              bg="muted"
              h="20"
              w="20"
              borderRadius={'6'}
              display={image ? 'initial' : 'none'}
              objectFit="cover"
            />
          </Flex>
        )}
      />

      <Box mt={14}>
        <Input
          label="Twitter Username (Optional)"
          InputLeftAddon={
            <InputLeftAddon children="twitter.com/" backgroundColor={'muted'} borderColor={'input !important'} />
          }
          {...register('twitter')}
          isInvalid={errors.twitter}
          error={errors?.twitter?.message}
        />
      </Box>
      <Box mt={2}>
        <Input
          label="Discord Invite Code (Optional)"
          InputLeftAddon={
            <InputLeftAddon children="discord.gg/" backgroundColor={'muted'} borderColor={'input !important'} />
          }
          {...register('discord')}
          isInvalid={errors.discord}
          error={errors?.discord?.message}
        />
      </Box>
      <Box mt={2}>
        <Input
          label="Website Url (Optional)"
          placeholder="https://nftcollection.io"
          {...register('website')}
          isInvalid={errors.website}
          error={errors?.website?.message}
        />
      </Box>

      <Flex justifyContent="flex-end" mt={8}>
        <Button variant={'primary'} onClick={handleSubmit(onClickSubmit)}>
          Proceed
        </Button>
      </Flex>
    </div>
  )
}

export default Details
