import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import { useContract } from '../../../hooks/useContract'
import axios from 'axios'

const TOKEN_URI_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getURIFromLink = (link) => {
  if (!link) return ''
  return link.split('/')[link.split('/').length - 1]
}

const NFTView = ({ isOpen, onClose, contractAddress, mintedTokens }) => {
  const [metaData, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const contract = useContract(contractAddress, TOKEN_URI_ABI)
  useEffect(() => {
    const fetchTokenUri = async () => {
      try {
        setError(false)
        if (mintedTokens.length <= 0) return setLoading(false)
        setLoading(true)
        const ipfs = await contract.tokenURI(mintedTokens[mintedTokens.length - 1])
        if (ipfs) {
          const URI = getURIFromLink(ipfs)
          const { data } = await axios.get(`https://bandit.infura-ipfs.io/ipfs/${URI}`)
          setMetadata(data)
        }
      } catch (e) {
        setError(true)
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    if (isOpen && mintedTokens && contract) {
      fetchTokenUri()
    }
  }, [mintedTokens, contract, isOpen])
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={'column'} align="center" mb={4}>
            <Box borderRadius={8} p={2} w={'180px'} borderColor="input" border="1px solid">
              <Flex direction={'column'} align="center">
                <Skeleton isLoaded={!loading} startColor="muted" endColor="input">
                  <Box h={40} w={40} bg="muted">
                    <Image
                      h={'full'}
                      w={'full'}
                      borderRadius={8}
                      objectFit={'cover'}
                      src={`https://bandit.infura-ipfs.io/ipfs/${getURIFromLink(metaData?.image)}`}
                    />
                  </Box>
                </Skeleton>
                <Skeleton isLoaded={!loading} mt={2} startColor="muted" endColor="input">
                  <Text fontSize={14} fontWeight={600}>
                    {metaData?.name}
                  </Text>
                </Skeleton>
              </Flex>
            </Box>
            {error && (
              <Text fontSize={14} color={'red'} mt={2}>
                Something went wrong! Failed to load your NFT.
              </Text>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NFTView
