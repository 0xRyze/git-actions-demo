import React, { useCallback, useState } from 'react'
import { Button, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useCreateContext } from '../../hooks/useCreateContext'
import { assetUpload, createCollection, fileUpload, solanaAssetUpload } from '../../../../state/launchpad/source'
import { useDispatch, useSelector } from 'react-redux'
import useSignature from '../../../../hooks/useSignature'
import { useWeb3React } from '@web3-react/core'
import success from '../../../../components/Svgs/success'
import { updateCollectionViewOpen, updateSelectedCollectionId } from '../../../../state/collection/reducer'
import useDeployContractEvm from '../../hooks/useDeployContractEvm'
import axios from 'axios'
import { useWallet } from '@solana/wallet-adapter-react'
import useQuest from '../../hooks/useQuest'
import { changeQueryParams, getImageUrl } from '../../../../utils'
import { useConsumerContext } from '../../../../hooks/useConsumerContext'
import SuccessIcon from '../../../../components/Svgs/success'

function randomString(length) {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1)
}

const Submit = () => {
  const [loadingState, setLoadingState] = useState({ isLoading: false, loadingText: '' })

  const [collectionCreated, setCollectionCreated] = useState(null)

  const { accessKey } = useConsumerContext()

  const {
    createState,
    shareSpaceDetails,
    modules,
    modalProps,
    isEditingCollection,
    nftTransferBlocked,
    collectionId,
    reset,
    isSolana,
  } = useCreateContext()
  const [signature, getSignature] = useSignature()

  const { deployErc721Contract, deployOATContract, deployNFTBaseWhitelistedContract } = useDeployContractEvm()

  const toast = useToast()

  const { account } = useWeb3React()
  const { publicKey: solanaAccount } = useWallet()
  const { init } = useQuest(createState?.contract?.chainId)

  const dispatch = useDispatch()

  const onClickDeploy = useCallback(async () => {
    try {
      const { profile, contract, space, isGasLessMint } = createState
      if (isEditingCollection && collectionId) {
        let coverImage = null
        let profileImage = null
        let _signature = signature
        let deployedContract = null
        let _ipfsHash = null

        setLoadingState({ isLoading: true, loadingText: 'Requesting Signature...' })

        if (!_signature) _signature = await getSignature()

        if (contract.isUnlimitedSupply) {
          setLoadingState({ isLoading: true, loadingText: 'Uploading Asset...' })
          if (typeof contract.nftImage === 'object') {
            const { data } = await assetUpload(contract.nftImage, profile.name, accessKey, profile.description)
            _ipfsHash = data
          } else {
            _ipfsHash = contract.nftImage
          }
        } else {
          _ipfsHash = contract.ipfs
        }

        if (!shareSpaceDetails) {
          if (typeof profile.coverImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Cover...' })
            const { data: coverImg } = await fileUpload(profile.coverImage, account, accessKey, _signature)
            coverImage = coverImg
          } else {
            coverImage = profile.coverImage
          }

          if (typeof profile.profileImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Profile...' })
            const { data: profileImg } = await fileUpload(profile.profileImage, account, accessKey, _signature)
            profileImage = profileImg
          } else {
            profileImage = profile.profileImage
          }
        } else {
          coverImage = profile.coverImage
          profileImage = profile.profileImage
        }

        setLoadingState({ isLoading: true, loadingText: 'Updating Collection...' })

        const collectionParams = {
          collectionId: Number(collectionId),
          profile: {
            name: profile.name,
            description: profile.description,
            profileImage,
            coverImage,
            socialmedia: profile.socialmedia,
          },
          contract: {
            deployer: account,
          },
          contestMetaData: modules,
          collectionTag: ['quest'],
          spaceId: space.spaceId,
          isGasLessMint,
        }
        console.log(collectionParams) //

        const res = await createCollection(collectionParams, accessKey)

        setCollectionCreated(res)
      } else {
        let coverImage = null
        let profileImage = null
        let _signature = signature
        let deployedContract = null
        let _ipfsHash = null

        setLoadingState({ isLoading: true, loadingText: 'Requesting Signature...' })

        if (!_signature) _signature = await getSignature()

        if (contract.isUnlimitedSupply) {
          setLoadingState({ isLoading: true, loadingText: 'Uploading Asset...' })
          const { data } = await assetUpload(contract.nftImage, profile.name, accessKey, profile.description)
          _ipfsHash = data
        } else {
          _ipfsHash = contract.ipfs
        }

        const contractParams = {
          name: profile.name,
          symbol: profile.name.replaceAll(' ', '_').toUpperCase(),
          uri: _ipfsHash,
          price: contract.price,
          maxSupply: contract.isUnlimitedSupply
            ? '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            : contract.maxMint,
          nftTransferBlocked,
        }

        // contract deployment
        setLoadingState({ isLoading: true, loadingText: 'Deploying Contract...' })

        if (modules.length <= 0) {
          deployedContract = await deployErc721Contract(contractParams)
        } else {
          deployedContract = await deployNFTBaseWhitelistedContract(contractParams)
        }

        if (!shareSpaceDetails) {
          if (typeof profile.coverImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Cover...' })
            const { data: coverImg } = await fileUpload(profile.coverImage, account, accessKey, _signature)
            coverImage = coverImg
          } else {
            coverImage = profile.coverImage
          }

          if (typeof profile.profileImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Profile...' })

            const { data: profileImg } = await fileUpload(profile.profileImage, account, accessKey, _signature)
            profileImage = profileImg
          } else {
            profileImage = profile.profileImage
          }
        } else {
          coverImage = profile.coverImage
          profileImage = profile.profileImage
        }

        setLoadingState({ isLoading: true, loadingText: 'Creating Collection...' })

        const collectionParams = {
          profile: {
            name: profile.name,
            description: profile.description,
            profileImage,
            coverImage,
            socialmedia: profile.socialmedia,
          },
          contract: {
            chainId: contract.chainId,
            contractAddress: deployedContract.address,
            abi: '',
            mintFunction: modules.length > 0 ? 'claim' : 'mint',
            price: String(contract.price),
            maxMint: contract.isUnlimitedSupply ? 0 : contract.maxMint,
            deployer: account,
          },
          contestMetaData: modules,
          collectionTag: ['quest'],
          transactionHash: deployedContract.transactionHash,
          spaceId: space.spaceId,
          isGasLessMint: isGasLessMint,
        }
        console.log(collectionParams) //
        const res = await createCollection(collectionParams, accessKey)

        setCollectionCreated(res)
      }
    } catch (e) {
      console.log(e)
      toast({
        title: 'Failed to create collection',
        // description: e.message,
        status: 'error',
      })
    } finally {
      setLoadingState({ isLoading: false, loadingText: '' })
    }
  }, [createState])

  const onClickDeployToSolana = useCallback(async () => {
    try {
      const { profile, contract, space } = createState
      if (isEditingCollection && collectionId) {
        let coverImage = null
        let ipfsProfileImage = null
        let ipfsQuestImage = null
        let _ipfsHash
        let _signature = signature

        setLoadingState({ isLoading: true, loadingText: 'Requesting Signature...' })

        if (!_signature) _signature = await getSignature()
        const symbol = profile.name.replaceAll(' ', '_').toUpperCase()

        if (contract.isUnlimitedSupply) {
          setLoadingState({ isLoading: true, loadingText: 'Uploading Asset...' })
          if (typeof contract.nftImage === 'object') {
            const { data } = await solanaAssetUpload(
              contract.nftImage,
              profile.name,
              accessKey,
              profile.description,
              symbol,
            )
            _ipfsHash = data
          } else {
            _ipfsHash = contract.nftImage
          }
        } else {
          _ipfsHash = contract.ipfs
        }
      } else {
        // create
        let coverImage = null
        let profileImage = null
        let _signature = signature
        let ipfsCollectionHash = null
        let ipfsQuestHash = null

        setLoadingState({ isLoading: true, loadingText: 'Requesting Signature...' })

        if (!_signature) _signature = await getSignature()
        const symbol = profile.name
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 9)

        if (contract.isUnlimitedSupply) {
          setLoadingState({ isLoading: true, loadingText: 'Uploading Asset...' })
          const { data } = await solanaAssetUpload(
            contract.nftImage,
            profile.name,
            accessKey,
            profile.description,
            symbol,
          )
          ipfsQuestHash = data
        } else {
          // TODO: check with candy machine thing!
          ipfsQuestHash = contract.ipfs
        }

        if (!shareSpaceDetails) {
          if (typeof profile.coverImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Cover...' })
            const { data: coverImg } = await fileUpload(
              profile.coverImage,
              solanaAccount.toBase58(),
              accessKey,
              _signature,
            )
            coverImage = coverImg
          } else {
            coverImage = profile.coverImage
          }

          if (typeof profile.profileImage === 'object') {
            setLoadingState({ isLoading: true, loadingText: 'Uploading Profile...' })

            const { data: profileImg } = await fileUpload(
              profile.profileImage,
              solanaAccount.toBase58(),
              accessKey,
              _signature,
            )
            profileImage = profileImg
          } else {
            profileImage = profile.profileImage
          }
        } else {
          coverImage = profile.coverImage
          profileImage = profile.profileImage
        }
        const { data: imageBlob } = await axios.get(getImageUrl(profileImage, { height: 1080, quality: 100 }), {
          responseType: 'blob',
        })
        console.log(imageBlob)

        const profileFile = new File([imageBlob], 'collection.png', { type: 'image/png' })

        setLoadingState({ isLoading: true, loadingText: 'Uploading Asset...' })
        const { data } = await solanaAssetUpload(profileFile, profile.name, accessKey, profile.description, symbol)
        ipfsCollectionHash = data

        // init quest
        setLoadingState({ isLoading: true, loadingText: 'Creating Quest...' })
        const createQuest = await init({
          accessKey,
          collection: {
            name: profile.name,
            symbol,
            uri: ipfsCollectionHash,
          },
          maxDepth: 16,
          maxBufferSize: 64,
          canopyDepth: 0,
          questDetails: {
            name: profile.name,
            symbol,
            uri: ipfsQuestHash,
            sellerFeeBasisPoints: 0,
          },
        })

        // create collection
        setLoadingState({ isLoading: true, loadingText: 'Creating Collection...' })

        const collectionParams = {
          profile: {
            name: profile.name,
            description: profile.description,
            profileImage,
            coverImage,
            socialmedia: profile.socialmedia,
          },
          contract: {
            chainId: contract.chainId,
            contractAddress: createQuest.collectionMint.toBase58(),
            abi: '',
            mintFunction: modules.length > 0 ? 'claim' : 'mint',
            price: String(contract.price),
            maxMint: contract.isUnlimitedSupply ? 0 : contract.maxMint,
            deployer: solanaAccount.toBase58(),
            candyMachineId: createQuest.quest.toBase58(),
          },
          contestMetaData: modules,
          collectionTag: ['quest'],
          transactionHash: '0xabc',
          spaceId: space.spaceId,
          isGasLessMint: true,
        }
        console.log(collectionParams) //

        const res = await createCollection(collectionParams, accessKey)

        setCollectionCreated(res)
      }
    } catch (e) {
      console.log(e)
      toast({
        title: 'Failed to create collection',
        // description: e.message,
        status: 'error',
      })
    } finally {
      setLoadingState({ isLoading: false, loadingText: '' })
    }
  }, [createState, init])

  const closeModal = useCallback(() => {
    if (modalProps.onClose) {
      modalProps.onClose()
      reset()
    }
  }, [modalProps])

  const goToCollection = useCallback(() => {
    window.open(`https://bandit.network?collectionId=${collectionCreated.data}`)
    // dispatch(updateSelectedCollectionId({ id: collectionCreated.data }))
    // changeQueryParams(
    //   window.location.search,
    //   window.location.pathname,
    //   collectionCreated.data,
    //   (url) => {
    //     window.history.pushState({}, '', url)
    //   },
    //   false,
    //   false,
    //   false,
    // )
    closeModal()
  }, [closeModal])

  if (!!collectionCreated)
    return (
      <Flex height="full" flexDirection="column" justifyContent="center" alignItems="center">
        {/*<Image src={success} w="75" h="75" />*/}
        <SuccessIcon />
        <Text textAlign={'center'} mt="4" fontSize={'20'} onClick={closeModal}>
          Collection {isEditingCollection ? 'updated' : 'created'} successfully 🎉
        </Text>
        <Flex justifyContent="center" mt={2}>
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" ml={2} onClick={goToCollection}>
            Go to collection
          </Button>
        </Flex>
      </Flex>
    )
  return (
    <>
      <Flex height="full" flexDirection="column" justifyContent="center">
        {isEditingCollection ? (
          <Text textAlign="center">Are you sure you want to save the changes?</Text>
        ) : (
          <Text textAlign="center">You are ready to create collection. Please review the details and click deploy</Text>
        )}

        <Flex justifyContent="center" mt={4}>
          {isEditingCollection && <Button onClick={closeModal}>Cancel</Button>}
          <Button
            variant="primary"
            ml={4}
            isLoading={loadingState.isLoading}
            loadingText={loadingState.loadingText}
            onClick={isSolana ? onClickDeployToSolana : onClickDeploy}
          >
            {isEditingCollection ? 'Save' : 'Deploy'}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Submit
