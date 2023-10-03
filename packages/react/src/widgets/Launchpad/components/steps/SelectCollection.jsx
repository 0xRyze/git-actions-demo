import React, { useEffect, useState } from 'react'
import { Button, Flex, FormControl } from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCreateContext } from '../../hooks/useCreateContext'
import Select from '../../../../components/Forms/Select'
import { getCollectionById } from '../../../../state/collection/source'
import { useSelector } from 'react-redux'
import { getAllCollectionByAddress } from '../../../../state/stats/source'
import { useWeb3React } from '@web3-react/core'
import { useConsumerContext } from '../../../../hooks/useConsumerContext'

const Schema = yup.object().shape({
  collectionId: yup.string().required('Select collection'),
})

const SelectCollection = () => {
  const { accessKey } = useConsumerContext()

  const [collections, setCollections] = useState([])
  const { account } = useWeb3React()

  const {
    goToNext,
    createState,
    setCollectionId,
    setCreateState,
    setModules,
    setIsEditingCollection,
    setShareSpaceDetails,
  } = useCreateContext()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      collectionId: null,
    },
  })
  watch('collectionId')

  const collectionId = getValues('collectionId')

  useEffect(() => {
    setIsEditingCollection(true)
    setShareSpaceDetails(false)
  }, [])

  useEffect(() => {
    if (accessKey) {
      getAllCollectionByAddress(accessKey, account)
        .then(({ data }) => {
          let _collections = data?.map((collection) => ({
            value: collection.collectionId,
            label: `${collection.name}`.concat(' ').concat(collection?.spaceName ? `(${collection?.spaceName})` : ''),
          }))
          setCollections(_collections)
        })
        .catch((error) => console.log(error))
    }
  }, [accessKey])

  useEffect(() => {
    const setCollectionToContext = async () => {
      try {
        const collection = await getCollectionById(accessKey, collectionId)
        const { profile, contestMetaData } = collection
        setCreateState((state) => ({
          ...state,
          profile,
        }))

        const modules = contestMetaData.map(({ name, req, rewardData, tasks }) => ({
          name,
          req,
          rewardData,
          tasks,
          readOnly: true,
        }))
        setModules(modules)
      } catch (e) {}
    }
    if (collectionId) {
      setCollectionToContext()
    }
  }, [collectionId])

  const onClickProceed = () => {
    handleSubmit((data) => {
      const { collectionId } = data
      setCollectionId(collectionId)
      goToNext()
    })()
  }

  return (
    <>
      <FormControl isInvalid={errors.collectionId}>
        <Select
          label="Select Collection"
          options={collections}
          // options={[{ label: '2035', value: '2035' }]}
          {...register('collectionId')}
          error={errors?.collectionId?.message}
        />
      </FormControl>
      <Flex justifyContent="flex-end" mt={'auto'}>
        <Button
          bg="black"
          color="white"
          _hover={{
            backgroundColor: 'black',
          }}
          onClick={onClickProceed}
        >
          Proceed
        </Button>
      </Flex>
    </>
  )
}

export default SelectCollection
