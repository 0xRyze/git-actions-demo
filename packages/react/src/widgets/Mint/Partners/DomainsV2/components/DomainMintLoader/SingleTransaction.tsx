import React, { useState } from 'react'
import { Button, Image, Link, Spinner, Text, Box } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'
import { truncateAddress } from '../../../../../../utils'
import { FaTwitter } from 'react-icons/fa'
import styled from '@emotion/styled'
import { AiOutlineFullscreen } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { updateSelectedCollectionId } from '../../../../../../state/collection/reducer'

const bonkImage =
  'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/3761cd57-827a-4a05-f82f-ca8c1abc7300/quality=80,height=100'
const NftEveningImage =
  'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/2db84388-37eb-4c01-32cc-67b0e1741e00/height=100,quality=80'
const BanditImage =
  'https://imagedelivery.net/6iczWBYEbx_1dYNU7ek_bA/62a5ffd5-6a84-4b3c-7812-f55cf4c7d300/height=100,quality=80'

const StyledBottomBox = styled(Box)`
  //margin-left: 30px;
  //margin-right: 30px;
  z-index: 99;
  border: 1px solid #cccc;
  border-radius: 14px;
  padding: 10px 20px;
  height: 76px;
  overflow: hidden;
  ${({ offersOpen }: any) =>
    offersOpen &&
    `
    position: absolute;
    top : 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: unset;
  `};
`

interface OfferCardProps {
  imageSrc: string
  title: string
  onClick?: () => void
}

const OffersCard: React.FC<OfferCardProps> = ({ imageSrc, title, onClick }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      borderWidth="1.5px"
      borderColor="gray.400"
      borderRadius="lg"
      p={1}
      mb={2}
    >
      <Flex align="center">
        <Image src={imageSrc} w={8} h={8} borderRadius="50%" />
        <Text fontSize="12px" fontWeight={600} mb={1} ml={3}>
          {title}
        </Text>
      </Flex>
      {onClick && (
        <Button
          size="xs"
          bg="gray.800"
          color="white"
          _hover={{
            bg: 'gray.800',
          }}
          onClick={onClick}
          fontSize={'10'}
        >
          Claim here
        </Button>
      )}
    </Flex>
  )
}

interface SingleTransactionProps {
  transaction: any
  postTransaction: {
    showOffers: boolean
    celebrate: () => void
    website: string
    address: string
  }
}

const SingleTransaction: React.FC<SingleTransactionProps> = ({ transaction, postTransaction }) => {
  return (
    <Flex direction="column" align="center">
      {transaction?.completed === 'pending' ? (
        <Loading />
      ) : transaction?.completed === 'error' ? (
        <Error />
      ) : transaction?.completed === 'completed' ? (
        <Completed
          showOffers={postTransaction?.showOffers}
          celebrate={postTransaction?.celebrate}
          website={postTransaction?.website}
          address={postTransaction?.address}
        />
      ) : (
        <Loading />
      )}
      {/* <Flex h="10">
        {transaction?.completed === 'completed' && (
          <Link fontSize="xs" fontWeight={'semibold'} mt={8} onClick={() => window.open(transaction?.link)}>
            View on Explorer
          </Link>
        )}
      </Flex> */}
    </Flex>
  )
}

const Loading = () => {
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        <Spinner size="md" />
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Transaction Pending
      </Text>
    </Flex>
  )
}

interface CompletedProps {
  showOffers: boolean
  celebrate: () => void
  website: string
  address: string
}

const Completed: React.FC<CompletedProps> = ({ showOffers, celebrate, website, address }) => {
  const [offersOpen, setOffersOpen] = useState(false)
  const dispatch = useDispatch()

  const onClickCollection = (id: any) => {
    dispatch(updateSelectedCollectionId({ id }))
  }
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        🎉
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Domain Purchase Successful
      </Text>
      <Text textAlign={'center'} marginY="4" fontSize={14}>
        Note: Login to{' '}
        <Link href={website} target="_blank" textDecoration={'underline'} fontWeight={'semibold'}>
          {website}
        </Link>{' '}
        using <b>{truncateAddress(address, 6)}</b> address to view your domain. It might take upto 10 minutes to
        register your domain.
      </Text>
      <Button
        mb={5}
        border="1.5px solid"
        w={'fit-content'}
        borderColor="input"
        size={'sm'}
        fontWeight={500}
        rightIcon={<FaTwitter width={20} height={20} color="#1DA1F2" />}
        onClick={celebrate}
      >
        Celebrate
      </Button>
      {showOffers && (
        <StyledBottomBox bg="gray.200" offersOpen={offersOpen}>
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" fontWeight={600} mb={1}>
              Exclusive rewards for purchasing UD
            </Text>
            <AiOutlineFullscreen cursor="pointer" onClick={() => setOffersOpen(!offersOpen)} />
          </Flex>

          <Text fontSize="xs" fontWeight={500} mb={3}>
            As a thank you, we're offering exclusive rewards to the first 2500 users by our partner platforms
          </Text>

          <OffersCard
            imageSrc={BanditImage}
            onClick={() => onClickCollection('64072')}
            title="Claim 100 $BAD token wrapped Bandit NFTs by Bandit"
          />
          <OffersCard
            imageSrc={bonkImage}
            title="Eligible to receive 400K $BONK coins after the offer period by BONK"
          />
          <OffersCard imageSrc={NftEveningImage} title="Get 15% discount on all services by NFT Evening" />
          <Text fontSize="2xs">
            These rewards are only available to the first 2500 users from our partner platforms, so don't miss out!
            Start exploring the exciting world of web3 domains and NFTs with these amazing offers.
          </Text>
        </StyledBottomBox>
      )}
    </Flex>
  )
}

const Error = () => {
  return (
    <Flex flexDirection="column" align="center">
      <Flex justify="center" align="center" bg="muted" w={10} h={10} borderRadius="50%">
        ❌
      </Flex>
      <Text fontSize="lg" fontWeight="bold" mt="2">
        Domain Purchase Failed
      </Text>
    </Flex>
  )
}

export default SingleTransaction
