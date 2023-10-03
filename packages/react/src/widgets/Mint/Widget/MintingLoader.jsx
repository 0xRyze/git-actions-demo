import React from 'react'
import { Box, Button, Flex, Image, Link, Skeleton, Text } from '@chakra-ui/react'
import { CalendarIcon, CheckCircleIcon, ExternalLinkIcon, WarningIcon } from '@chakra-ui/icons'
import Loader from '../../../components/Loader'
import { getImageUrl } from '../../../utils'
import { BLOCK_EXPLORER, SupportedChainId } from '../../../constants/chains'
import { solScan } from '../../../assets/images'

const LoadingItem = ({ completed, title, link, hasLink, index, isTransaction = true }) => {
  return (
    <Flex mb="10px">
      {completed === 'pending' ? (
        <Loader size="md" mr={'10px'} />
      ) : completed === 'completed' ? (
        <CheckCircleIcon width={'24px'} height={'24px'} color="#01B652" mr={'10px'} />
      ) : (
        <WarningIcon width={'24px'} height={'24px'} color="#ff3333" mr={'10px'} />
      )}

      <Text>
        {isTransaction ? `Transaction ${isTransaction ? index - 1 : index}:` : ''} {title}
      </Text>
      {hasLink && (
        <Link href={link} isExternal>
          <ExternalLinkIcon ml={'10px'} cursor="pointer" />
        </Link>
      )}
    </Flex>
  )
}

const ConnectWithUs = ({ completed: mintStatus }) => {
  return (
    <>
      {mintStatus === 'error' ? (
        <>
          <Text fontSize={15} mx={12} mt={2} textAlign="center">
            We apologise for the inconvenience. We would love to know what went wrong. Please provide us feedback by
            setting up a call with us.
          </Text>
          <Text fontSize={15} mt={4} textAlign="center" fontWeight={'semibold'}>
            Recieve 100 $BAD NFT wrapped tokens.
          </Text>
          <Button
            mt="20px"
            bg="buttonBackground"
            color="buttonColor"
            width={200}
            variant="solid"
            _hover={{
              backgroundColor: 'buttonBackground',
            }}
            onClick={() => {
              window.open('https://calendly.com/sandesh_bandit/customer-feedback', '_blank')
            }}
            leftIcon={<CalendarIcon width={4} height={4} color="#00000" />}
          >
            Get Help
          </Button>
        </>
      ) : mintStatus === 'completed' ? (
        <>
          <Text fontSize={12} mx={'20%'} mt={2} textAlign="center">
            We would love to know your experience of using our platform. Please provide us feedback by setting up a call
            with us.
          </Text>
          <Text fontSize={12} mt={2} textAlign="center" fontWeight={'semibold'}>
            Receive 100 $BAD NFT wrapped tokens.
          </Text>
          <Button
            mt={2}
            bg="buttonBackground"
            color="buttonColor"
            // width={140}
            variant="outline"
            size="xs"
            _hover={{
              backgroundColor: 'buttonBackground',
            }}
            onClick={() => {
              window.open('https://calendly.com/sandesh_bandit/customer-feedback', '_blank')
            }}
            leftIcon={<CalendarIcon width={3} height={3} color="#00000" />}
          >
            Connect
          </Button>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

const SolanaExplorer = ({ mintAddress, chainId }) => {
  if (!mintAddress) return null
  return (
    <Flex alignItems={'center'} mt="4">
      <Text fontSize={'12'}>View NFT:</Text>
      <Image
        src={solScan}
        w="4"
        h="4"
        ml="2"
        cursor={'pointer'}
        onClick={() => {
          window.open(
            `${BLOCK_EXPLORER[chainId]}token/${mintAddress}${
              chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
            }`,
          )
        }}
      />
    </Flex>
  )
}

const MintingLoader = ({ list = [], completed: mintStatus, price, viewNFT, collectionState, sage }) => {
  const _list = list.filter((l) => l.enable)
  return (
    <>
      <Flex flexDir={'column'} w="full" justifyContent={'center'} alignItems={'center'}>
        <Text fontSize={24} fontWeight={600} mb={2}>
          Minting {mintStatus === 'completed' ? 'Completed' : mintStatus === 'pending' ? 'In Progress' : 'Failed'}
        </Text>
        <Flex flexDir={'column'} alignItems={'flex-start'}>
          {_list.map((props, index) => (
            <LoadingItem {...props} key={index} index={index + 1} />
          ))}
        </Flex>
      </Flex>
      {viewNFT && <TokenCard loading={false} collectionState={collectionState} />}
      <Flex flexDir={'column'} w="full" justifyContent={'center'} alignItems={'center'} mt={2}>
        {price > 0 ? <ConnectWithUs completed={mintStatus} /> : <></>}
      </Flex>
      {sage && <SolanaExplorer mintAddress={sage?.mintAddress} chainId={sage?.chainId} />}
    </>
  )
}

const TokenCard = ({ loading, collectionState }) => {
  const { profile } = collectionState || {}
  const { name, profileImage } = profile
  return (
    <Box borderRadius={8} p={2} w={'100px'} borderColor="input" border="1px solid">
      <Flex direction={'column'} align="center">
        <Skeleton isLoaded={!loading} startColor="muted" endColor="input">
          <Box h={20} w={20} bg="gray.300">
            <Image
              h={'full'}
              w={'full'}
              borderRadius={8}
              objectFit={'cover'}
              src={`${getImageUrl(profileImage, { height: 100 })}`}
            />
          </Box>
        </Skeleton>
        <Skeleton isLoaded={!loading} w={'full'} mt={2} startColor="muted" endColor="input">
          <Text textAlign="center" noOfLines={1} fontSize={10} w={'full'} fontWeight={600}>
            {name}
          </Text>
        </Skeleton>
      </Flex>
    </Box>
  )
}

export default MintingLoader
