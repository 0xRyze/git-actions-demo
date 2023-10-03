import React, { useEffect, useState } from 'react'
import useUser from './useUser'
import { getContestTaskStatus, verifyTask } from '../../../../state/contest/source'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'
import useSignature from '../../../../hooks/useSignature'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'

const useContest = ({ collectionId, contestMetaData = [], isCollectionContest, chainId, refresh = false }) => {
  const [modulesStatus, setModuleStatus] = useState({})
  const { user } = useUser()
  const accessKey = useSelector((state) => state.user.accessKey)
  const selectedWallet = useSelector((state) => state.user.selectedWallet)
  const [signature, getSignature] = useSignature()
  const wallet = useWallet()
  const { account } = useWeb3React()

  const toast = useToast()

  useEffect(() => {
    if (collectionId && isCollectionContest && user?.walletAddress) {
      getUserCompletedTasks()
    }
  }, [collectionId, user?.walletAddress, refresh])

  useEffect(() => {
    if (!user?.walletAddress) {
      setModuleStatus({})
    }
  }, [user?.walletAddress, refresh])

  const getUserCompletedTasks = async () => {
    try {
      const status = await getContestTaskStatus(user?.walletAddress, collectionId, accessKey)
      let statusObj = {}
      status.forEach((item) => {
        statusObj = {
          ...statusObj,
          [item.moduleId]: item,
        }
      })

      setModuleStatus(statusObj)
    } catch (e) {
      console.log(e)
    }
  }

  const verifyModuleTask = async (moduleId, task) => {
    try {
      let _signature = signature
      if (!_signature) _signature = await getSignature()

      await verifyTask(
        collectionId,
        {
          moduleId,
          task,
          walletAddress: selectedWallet === 'Phantom' ? wallet?.publicKey?.toBase58() : account,
          signature: _signature,
        },
        accessKey,
      )

      await getUserCompletedTasks()
      toast({ title: 'Verification success', description: '', status: 'success' })
    } catch (e) {
      toast({ title: 'Verification Failed', description: '', status: 'error' })
      console.log(e)
    }
  }

  const completedTasksAndClaimed = contestMetaData.filter(
    (module) =>
      modulesStatus[module.id]?.tasksCompleted?.length === module?.tasks?.length && modulesStatus[module.id]?.isClaimed,
  )

  const contestCompleted = completedTasksAndClaimed.length === contestMetaData.length

  const completedTasks = contestMetaData.filter(
    (module) =>
      modulesStatus[module.id]?.tasksCompleted?.length === module?.tasks?.length &&
      !modulesStatus[module.id]?.isClaimed,
  )
  const isEligibleToMint = completedTasks.length > 0
  const tokensEligibleToClaim = completedTasks
    ? completedTasks.reduce((partialSum, task) => partialSum + task.rewardData?.count, 0)
    : 0

  const eligibleModules = completedTasks.map((module) => module.id)
  const claimedTokens = 0
  const availableTokens = 11

  return {
    contestCompleted,
    isEligibleToMint,
    tokensEligibleToClaim,
    eligibleModules,
    claimedTokens,
    availableTokens,
    modulesStatus,
    verifyModuleTask,
    user,
    getUserCompletedTasks,
    chainId,
  }
}

export default useContest
