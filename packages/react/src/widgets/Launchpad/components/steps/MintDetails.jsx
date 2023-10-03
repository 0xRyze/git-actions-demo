import React, { useCallback } from 'react'
import Switch from '../../../../components/Forms/Switch'
import { Box, Button, Flex, Image, Text, Tooltip } from '@chakra-ui/react'
import FileUpload from '../FileUpload'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateContext } from '../../hooks/useCreateContext'
import { CHAIN_INFO } from '../../../../constants/chains'
import { useWeb3React } from '@web3-react/core'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Input } from '../../../../components/ui/input'

const Schema = yup.object().shape({
  isUnlimitedSupply: yup.bool(),
  isGasLessMint: yup.bool(),
  totalSupply: yup
    .number()
    .typeError('Total supply must be a number')
    .when('isUnlimitedSupply', {
      is: false,
      then: (schema) => schema.required('Total supply is required'),
    }),
  mintPrice: yup.number().required('Mint price is required').typeError('Mint price must be a number'),
  ipfs: yup.string().when('isUnlimitedSupply', {
    is: false,
    then: (schema) => schema.required('NFT assets link is required'),
  }),
  nftImage: yup.mixed().when('isUnlimitedSupply', {
    is: true,
    then: (schema) =>
      schema.test('required', 'NFT image is required', (file) => {
        if (file) return true
        return false
      }),
  }),
  // nftImage: yup.mixed().test('required', 'NFT image is required', (file) => {
  //   if (file) return true
  //   return false
  // }),
})

const MintDetails = () => {
  const { chainId } = useWeb3React()
  const { goToNext, createState, setCreateState, isSolana } = useCreateContext()
  const { contract, isGasLessMint: isGasLessMintDefaultValue } = createState
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      isUnlimitedSupply: contract.isUnlimitedSupply,
      isGasLessMint: isGasLessMintDefaultValue,
      totalSupply: contract.maxMint,
      mintPrice: contract.price,
      nftImage: contract.nftImage,
      ipfs: contract.ipfs,
    },
  })
  watch('isUnlimitedSupply')
  watch('isGasLessMint')

  const { isUnlimitedSupply, isGasLessMint } = getValues()

  const onChangeUnlimitedSupply = useCallback(() => {
    setValue('isUnlimitedSupply', !isUnlimitedSupply)
  }, [getValues, setValue, isUnlimitedSupply])

  const onChangeGasLessMint = useCallback(() => {
    setValue('isGasLessMint', !isGasLessMint)
  }, [getValues, setValue, isGasLessMint])

  const onClickProceed = useCallback(
    (data) => {
      const { totalSupply, mintPrice, isUnlimitedSupply, ipfs, nftImage, isGasLessMint } = data
      setCreateState((state) => ({
        ...state,
        contract: {
          ...state.contract,
          price: mintPrice,
          maxMint: totalSupply,
          isUnlimitedSupply,
          ipfs,
          nftImage,
        },
        isGasLessMint,
      }))
      goToNext()
    },
    [setCreateState, goToNext],
  )

  return (
    <div>
      <Switch
        label={'Does your collection have unlimited items?'}
        id="unlimited supply"
        onChange={onChangeUnlimitedSupply}
        isChecked={getValues('isUnlimitedSupply')}
        sx={{ 'span.chakra-switch__track:not([data-checked])': { background: 'input' } }}
      />
      <Box mt={4} opacity={isUnlimitedSupply ? 0.6 : 1}>
        <Input
          label={'Total Supply'}
          placeholder={'10000'}
          helperText="Number of total items in the collection"
          disabled={isUnlimitedSupply}
          {...register('totalSupply')}
          isInvalid={errors.totalSupply}
          error={errors?.totalSupply?.message}
        />
      </Box>
      <Box mt={4}>
        <Input
          label={`Mint price (${CHAIN_INFO[!isSolana ? chainId : 9091]?.nativeCurrency?.symbol})`}
          placeholder={'1'}
          helperText="Price of each nft of your collection. Enter 0 for free mint"
          {...register('mintPrice')}
          isInvalid={errors.mintPrice}
          error={errors?.mintPrice?.message}
        />
      </Box>

      {!isSolana && (
        <Flex mt={4} justifyContent={'space-between'} alignItems={'center'}>
          <Switch
            id="isGasLessMint"
            label={'Do you want to cover gas costs?'}
            onChange={onChangeGasLessMint}
            isChecked={getValues('isGasLessMint')}
            sx={{ 'span.chakra-switch__track:not([data-checked])': { background: 'input' } }}
          />
          <Tooltip label="This will cover the gas required for minting.">
            <InfoOutlineIcon w="3" h="3" color={'primary'} ml="1" />
          </Tooltip>
        </Flex>
      )}

      {!isUnlimitedSupply && (
        <Box mt={4}>
          <Input
            label={<>NFT Assets Link</>}
            placeholder={'ipfs://QmfGHdrccEy4zse3xFzYuivwc6UPfix4b74FX8o9jFy3Yh'}
            helperText="URI for NFT metadata."
            {...register('ipfs')}
            isInvalid={errors.ipfs}
            error={errors?.ipfs?.message}
          />
        </Box>
      )}

      {isUnlimitedSupply && (
        <Box mt={4}>
          <FileUpload
            name="nftImage"
            control={control}
            acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4']}
            schema={Schema}
            renderChild={({ click, image, error }) => (
              <Box>
                <Text>NFT Image</Text>
                <Box
                  h="100px"
                  w="100px"
                  bg="muted"
                  borderRadius={'6'}
                  justifyContent="center"
                  alignItems={'center'}
                  onClick={click}
                  userSelect="none"
                  cursor={'pointer'}
                  border={error ? '2px solid red' : '2px solid white'}
                  overflow="hidden"
                >
                  <Image
                    // pos="absolute"
                    src={image ? URL.createObjectURL(image) : ''}
                    // top={'-1'}
                    // ml="4"
                    bg="gray.400"
                    h="100px"
                    w="100px"
                    borderRadius={'6'}
                    display={image ? 'initial' : 'none'}
                    objectFit="cover"
                  />
                </Box>
                <Text fontSize={12}>This is the image used for all the NFT minted from your collection</Text>
              </Box>
            )}
          />
        </Box>
      )}

      <Flex justifyContent="flex-end" mt={8}>
        <Button variant={'primary'} onClick={handleSubmit(onClickProceed)}>
          Proceed
        </Button>
      </Flex>
    </div>
  )
}

export default MintDetails
