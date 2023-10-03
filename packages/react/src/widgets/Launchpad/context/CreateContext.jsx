import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { environment } from '../../../context/BanditContext'

const mainnetChains = [137, 56, 8081, 9090, 40]
const testnetChains = [5, 80001, 97, 8081, 9091, 41]

const CreateContext = createContext(undefined)

const initialState = {
  profile: {
    name: '',
    description: '',
    profileImage: '',
    coverImage: '',
    socialmedia: {
      twitter: '',
      discord: '',
      website: '',
    },
  },
  contract: {
    chainId: null,
    contractAddress: '',
    abi: '',
    mintFunction: 'mint',
    price: 0,
    maxMint: 1,
    isUnlimitedSupply: true,
    ipfs: '',
    nftImage: '',
  },
  contestMetaData: [],
  collectionTag: [],
  space: {
    spaceId: null,
  },
  isGasLessMint: false,
}

const CreateContextProvider = ({
  setActiveStep,
  activeStep,
  goToNext,
  goToPrevious,
  modalProps,
  children,
  allowedChains: _allowedChains = [],
}) => {
  const [createState, setCreateState] = useState(initialState)

  const [collectionId, setCollectionId] = useState(null)
  const [isEditingCollection, setIsEditingCollection] = useState(false)

  const [shareSpaceDetails, setShareSpaceDetails] = useState(true)
  const [modules, setModules] = useState([])
  const [isContest, setIsContest] = useState(true)
  const [nftTransferBlocked, setNftTransferBlock] = useState(true)
  const selectedWallet = useSelector((state) => state.user.selectedWallet)
  const [isSolana, setIsSolana] = useState(null)

  const [allowedChains] = useState(_allowedChains)

  let supportedChains = useMemo(() => (environment === 'production' ? mainnetChains : testnetChains), [environment])
  supportedChains = useMemo(
    () =>
      allowedChains && !!allowedChains.length
        ? supportedChains.filter((chain) => allowedChains.includes(chain))
        : supportedChains,
    [allowedChains],
  )

  useEffect(() => {
    setIsSolana(selectedWallet === 'Phantom' ? true : false)
    if (!!supportedChains.length) {
      setCreateState((state) => ({
        ...state,
        contract: {
          ...state.contract,
          chainId: supportedChains[0],
        },
      }))
    }
  }, [supportedChains, selectedWallet])

  const reset = (doStepReset = true) => {
    doStepReset && setActiveStep(0)
    setCreateState(initialState)
    setCollectionId(null)
    setIsEditingCollection(false)
    setShareSpaceDetails(true)
    setModules([])
    setIsContest(true)
    setNftTransferBlock(true)
  }

  const value = useMemo(
    () => ({
      supportedChains,
      createState,
      setCreateState,
      activeStep,
      goToNext,
      goToPrevious,
      shareSpaceDetails,
      setShareSpaceDetails,
      modules,
      setModules,
      modalProps,
      collectionId,
      setCollectionId,
      isEditingCollection,
      setIsEditingCollection,
      isContest,
      setIsContest,
      nftTransferBlocked,
      setNftTransferBlock,
      reset,
      isSolana,
    }),
    [
      supportedChains,
      createState,
      setCreateState,
      activeStep,
      goToNext,
      goToPrevious,
      shareSpaceDetails,
      setShareSpaceDetails,
      modules,
      setModules,
      modalProps,
      collectionId,
      setCollectionId,
      isEditingCollection,
      setIsEditingCollection,
      isContest,
      setIsContest,
      nftTransferBlocked,
      setNftTransferBlock,
      reset,
      isSolana,
    ],
  )
  return <CreateContext.Provider value={value}>{children}</CreateContext.Provider>
}

export { CreateContext, CreateContextProvider }
