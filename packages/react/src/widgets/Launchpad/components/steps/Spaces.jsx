import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { createSpaces, getUserSpaces } from '../../../../state/launchpad/source'
import FileUpload from '../FileUpload'
import { fileUpload } from '../../../../state/launchpad/source'
import useSignature from '../../../../hooks/useSignature'
import Loader from '../../../../components/Loader'
import { useCreateContext } from '../../hooks/useCreateContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { Input } from '../../../../components/ui/input'
import { useConsumerContext } from '../../../../hooks/useConsumerContext'

const Schema = yup.object().shape({
  space: yup.number().required('Select Space'),
})

const CreateSchema = yup.object().shape({
  cover: yup.mixed().test('required', 'Cover image is required', (file) => {
    if (file) return true
    return false
  }),
  profile: yup.mixed().test('required', 'Cover image is required', (file) => {
    if (file) return true
    return false
  }),
  name: yup.string().required('Space name is required'),
  description: yup.string().required('Space description is required'),
  twitter: yup.string(),
  discord: yup.string(),
  website: yup.string(),
})

const Spaces = () => {
  const { accessKey } = useConsumerContext()

  const [loadingSpaces, setLoadingSpaces] = useState(false)
  const [spaces, setSpaces] = useState([])
  const [showCreateSpace, setShowCreateSpace] = useState(false)

  const { account, chainId: connectedChainId } = useWeb3React()
  const { publicKey: solanaAccount } = useWallet()

  const { goToNext, setCreateState, createState } = useCreateContext()

  // const { balance } = useRelayer(true)
  // const { isOpen: isFundOpen, onOpen: onFundOpen, onClose: onFundClose } = useDisclosure()

  const { space } = createState

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      space: null,
    },
  })

  const fetchSpaces = useCallback(async () => {
    try {
      if (account || solanaAccount) {
        setLoadingSpaces(true)
        const _account = account || solanaAccount?.toBase58()
        const response = await getUserSpaces(_account, accessKey)
        setSpaces(response.map((s) => ({ key: s.profile.name, value: s.spaceId, space: s })))
        setValue('space', space.spaceId)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoadingSpaces(false)
    }
  }, [account, solanaAccount])

  const refreshSpaces = useCallback(
    (spaceId) => {
      if (spaceId) {
        setValue('space', Number(spaceId))
        setShowCreateSpace(false)
      }
      fetchSpaces()
    },
    [fetchSpaces, setShowCreateSpace, setValue],
  )

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  const selectSpace = useCallback(() => {
    const selectedSpaceId = getValues('space')
    const space = spaces.find((s) => s.value === Number(selectedSpaceId))
    setCreateState((state) => ({
      ...state,
      space: {
        spaceId: space.value,
        ...space.space.profile,
      },
    }))
    goToNext()
  }, [getValues, spaces, setCreateState, goToNext])

  if (loadingSpaces)
    return (
      <Flex h="full" alignItems="center" justifyContent="center">
        <Loader size="md" />
      </Flex>
    )

  if (showCreateSpace)
    return <CreateSpace cancelCreate={() => setShowCreateSpace(false)} refreshSpaces={refreshSpaces} />

  return (
    <>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" height="full">
        <Text mb={2} textAlign="center">
          Space is a workspace where you can create and manage your collections
        </Text>

        {!!spaces.length && (
          <>
            <Flex w={'full'} flexDir={'column'}>
              <FormControl isInvalid={errors.space}>
                <Select
                  borderColor="input"
                  _hover={{
                    borderColor: '',
                  }}
                  placeholder="Select space"
                  {...register('space')}
                >
                  {spaces.map(({ key, value }) => (
                    <option value={value}>{key}</option>
                  ))}
                </Select>
              </FormControl>
              {/* <Flex justifyContent={'space-between'} mt="2" alignItems={'center'}>
                <Text fontSize={'12'}>Balance: {balance}</Text>
                <Button size={'xs'} onClick={onFundOpen}>
                  Deposit Funds
                </Button>
              </Flex> */}
            </Flex>

            <Text marginY={8}>OR</Text>
            {/* <FundModal isOpen={isFundOpen} onOpen={onFundOpen} onClose={onFundClose} isFund={true} /> */}
          </>
        )}

        <Box>
          <Button
            ml={2}
            onClick={() => setShowCreateSpace(true)}
            fontSize="sm"
            fontWeight={500}
            variant="outline"
            borderColor="input"
          >
            Create New Space
          </Button>
        </Box>

        <Flex justifyContent="flex-end" mt={'auto'} width={'full'}>
          <Button variant={'primary'} onClick={handleSubmit(selectSpace)} ml={2}>
            Proceed
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

const CreateSpace = ({ cancelCreate, refreshSpaces }) => {
  const [loading, setLoading] = useState(false)
  const [signature, getSignature] = useSignature()
  const { account } = useWeb3React()
  const { publicKey: solanaAccount } = useWallet()
  // const accessKey = useSelector((state) => state.user.accessKey)
  const { accessKey } = useConsumerContext()

  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(CreateSchema),
    defaultValues: {
      name: '',
      description: '',
      cover: '',
      profile: '',
      twitter: '',
      discord: '',
      website: '',
    },
  })

  const createSpace = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const { name, description, cover, profile, twitter, discord, website } = data
        const _account = account || solanaAccount.toBase58()
        let _signature = signature
        if (!_signature) _signature = await getSignature()
        const { data: coverImage } = await fileUpload(cover, _account, accessKey, _signature)
        const { data: profileImage } = await fileUpload(profile, _account, accessKey, _signature)
        const response = await createSpaces(
          {
            profile: {
              name,
              description,
              coverImage,
              profileImage,
              socialmedia: {
                twitter,
                discord,
                website,
              },
            },
            createdBy: _account,
          },
          accessKey,
        )
        refreshSpaces(response?.data?.spaceId)
        toast({ title: 'Space created', description: '', status: 'success' })
      } catch (e) {
        console.log(e)
        toast({ title: 'Failed to create space', description: '', status: 'error' })
      } finally {
        setLoading(false)
      }
    },
    [getSignature, account, solanaAccount, accessKey, signature, refreshSpaces],
  )
  return (
    <>
      <Flex flexDir="column" pos="relative" w="full">
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
                color={error ? 'red.500' : 'mutedForeground'}
                display={image ? 'none' : 'initial'}
              >
                Cover Image
              </Text>
              <Image
                src={image ? URL.createObjectURL(image) : ''}
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
                color={error ? 'red.500' : 'mutedForeground'}
                display={image ? 'none' : 'initial'}
              >
                Profile Image
              </Text>
              <Image
                pos="absolute"
                src={image ? URL.createObjectURL(image) : ''}
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

        <Box mt={12}>
          <Input
            label="Space Name"
            placeholder={'Space Name'}
            {...register('name')}
            isInvalid={errors.name}
            error={errors?.name?.message}
          />
        </Box>
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
            label="Space Description"
            placeholder={'Space Description'}
            {...register('description')}
            isInvalid={errors.description}
            error={errors?.description?.message}
          />
        </Box>

        <Box mt={4}>
          <Input
            label="Twitter Username"
            InputLeftAddon={
              <InputLeftAddon children="twitter.com/" backgroundColor={'muted'} borderColor={'input !important'} />
            }
            isInvalid={errors.twitter}
            {...register('twitter')}
          />
        </Box>
        <Box mt={4}>
          <Input
            label="Discord Invite Code"
            InputLeftAddon={
              <InputLeftAddon children="discord.gg/" backgroundColor={'muted'} borderColor={'input !important'} />
            }
            isInvalid={errors.discord}
            {...register('discord')}
          />
        </Box>
        <Box mt={4}>
          <Input
            label="Website Url"
            placeholder="https://nftcollection.io"
            isInvalid={errors.website}
            {...register('website')}
          />
        </Box>

        <Flex justifyContent="flex-end" mt={8}>
          <Button variant="outline" onClick={cancelCreate} isDisabled={loading}>
            Back
          </Button>
          <Button
            variant={'primary'}
            onClick={handleSubmit(createSpace)}
            ml={2}
            isLoading={loading}
            loadingText="Creating Space..."
          >
            Create Space
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Spaces
