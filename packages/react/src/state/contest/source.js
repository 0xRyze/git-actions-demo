import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const verifyTask = async (collectionId, params, accessKey) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/contest/${collectionId}/verifyContest`, params, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getContestTaskStatus = async (walletAddress, collectionId, accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/users/${walletAddress}/contest/${collectionId}/getTaskStatus`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getMintSignature = async (collectionId, walletAddress, moduleId, accessKey, signature) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/contest/${collectionId}/mint`,
      {
        moduleId,
        walletAddress,
        signature,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getGaslessMintSignature = async (collectionId, walletAddress, moduleId, accessKey, signature) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/contest/${collectionId}/mint-gasless`,
      {
        moduleId,
        walletAddress,
        signature,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    // throw new Error(e)
    return false
  }
}

export const updateContestClaim = async (
  collectionId,
  referenceId,
  transactionHash,
  accessKey,
  walletAddress,
  signature,
) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/contest/${collectionId}/claim`,
      {
        referenceId,
        transactionHash,
        signature,
        walletAddress,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}

export const fetchContestParticipants = async (collectionId, offset, limit, accessKey) => {
  try {
    const res = await axios.get(
      `${SDK_API}/collection/contest/${collectionId}/participants?offset=${offset}&limit=${limit}`,
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}
