import {
  Box,
  Button,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import SuccessIcon from '../../../components/Svgs/success'
import { Input } from '../../../components/ui/input'
import { CHAIN_INFO } from '../../../constants/chains'
import { useRootContext } from '../../../context/RootContext'
import useRelayer from '../../../hooks/useRelayer'

const schema = yup.object().shape({
  amount: yup.number().typeError('Amount is required.').required('Amount is required.'),
})

const FundModal = ({ isOpen, onClose, onOpen, selectedChainId, isFund = false }) => {
  const [loading, setLoading] = useState(false)
  const { fundSpace, chainId, withdrawSpaceFunds, balance } = useRelayer()
  const [isActionComplete, setIsActionComplete] = useState(false)

  const { rootRef } = useRootContext()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
    },
  })
  const amount = watch('amount')
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (isFund) {
        await fundSpace(data.amount)
      } else {
        await withdrawSpaceFunds(data.amount)
      }
      setIsActionComplete(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const close = () => {
    reset()
    setIsActionComplete(false)
    onClose()
  }
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={close}
      isCentered
      portalProps={{ containerRef: rootRef }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isFund ? `Deposit Funds` : `Withdraw Funds`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isActionComplete ? (
            <Flex w="full" justifyContent={'center'} h="40" alignItems={'center'} flexDir={'column'} mb="10">
              <SuccessIcon />
              <Text fontWeight={'bold'} mt="2">
                {isFund
                  ? `Deposited ${amount} ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`
                  : `Withdrawn ${amount} ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`}
              </Text>
              <Button mt="4" bg="primary" onClick={close}>
                Close
              </Button>
            </Flex>
          ) : (
            <Box>
              <Input
                label="Amount"
                placeholder={`0.5 ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`}
                {...register('amount')}
                isInvalid={errors.amount}
                error={errors?.amount?.message}
              />
              <FormControl isInvalid={!!errors.amount}></FormControl>
              <Button
                w="full"
                my="4"
                bg={'primary'}
                onClick={handleSubmit(onSubmit)}
                isLoading={loading}
                loadingText={isFund ? 'Funding...' : 'Withdrawing...'}
              >
                {isFund
                  ? `Fund ${CHAIN_INFO[selectedChainId]?.nativeCurrency?.symbol}`
                  : `Withdraw ${CHAIN_INFO[selectedChainId]?.nativeCurrency?.symbol}`}
              </Button>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FundModal
