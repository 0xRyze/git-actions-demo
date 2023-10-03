import React, { useState } from 'react'
import success from '../../../../components/Svgs/success'
import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { truncateAddress } from '../../../../utils'
import styled from '@emotion/styled'
import { AiOutlineFullscreen } from 'react-icons/ai'
import { FaTwitter } from 'react-icons/fa'

const bonkImage = ''
const NftEveningImage = ''
const BanditImage = ''

const StyledBottomBox = styled(Box)`
  //margin-left: 30px;
  //margin-right: 30px;
  border: 1px solid #cccc;
  border-radius: 14px;
  padding: 10px 20px;
  height: 65px;
  overflow: hidden;
  ${({ offersOpen }) =>
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

const OffersCard = ({ imageSrc, title, onClick }) => {
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
        >
          Claim here
        </Button>
      )}
    </Flex>
  )
}

const PurchaseSuccess = ({ address, showOffers, onClickCollection, website, twitterHandle, isEnsDomain }) => {
  const [offersOpen, setOffersOpen] = useState(false)

  const celebrate = () => {
    if (isEnsDomain) {
      window.open(
        `https://twitter.com/intent/tweet?text=Just%20secured%20my%20new%20@ensdomains%20on%20bandit.network!%20Ready%20to%20rock%20my%20online%20presence.%20&hashtags=DigitalUpgrade`,
        '_blank',
      )
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=Ready%20to%20take%20my%20online%20identity%20to%20the%20next%20level%20with%20my%20${twitterHandle()}%20on%20bandit.network.%20And%20the%20best%20part?%20I%20also%20got%20some%20amazing%20rewards%20from%20@OnBndit,%20@bonk_inu,%20@NFTevening.%20Join%20me%20and%20claim%20yours%20now!`,
        '_blank',
      )
    }
  }
  return (
    <Box>
      <Flex flexDir="column" align="center" position="relative" w="full" userSelect={'none'} p={8}>
        <Image src={success} w="75" h="75" />
        <Text textAlign={'center'} mt="4" fontSize={'20'} fontWeight="semibold">
          Domain purchased successfully 🎉
        </Text>
        <Text textAlign={'center'} marginY="4" fontSize={14}>
          Note: Login to{' '}
          <Link href={website()} target="_blank">
            {website()}
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
    </Box>
  )
}

export default PurchaseSuccess
