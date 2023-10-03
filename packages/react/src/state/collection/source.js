import { SDK_API, SYNC_V2_API } from '../../constants/endpoints'
import axios from 'axios'

export const getCollectionById = async (consumer, collectionId) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/${collectionId}`, {
      headers: {
        'X-API-KEY': consumer,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getRoadmapById = async (consumer, collectionId) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/roadmap/${collectionId}`, {
      headers: {
        'X-API-KEY': consumer,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getFeaturedCollectionById = async (accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/featured`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const updateMint = async (collectionId, accessKey, params, throwError = false) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/mint/${collectionId}`, params, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    console.log(e)
    if (throwError) {
      throw e
    }
  }
}

export const updateMintError = async (collectionId, accessKey, params) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/${collectionId}/mints/error`, params, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    console.log(e)
  }
}

export const callBeforeMintWebhook = async (address, chain, accessKey) => {
  try {
    axios.post(
      `${SYNC_V2_API}`,
      { address, chainId: chain, action: 'updateMaxSupply' },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
  } catch (e) {
    console.log(e)
  }
}

export const fetchRecommendations = async (address, accessKey, tags) => {
  try {
    let _tags = tags ? tags[0] : ''
    const res = await axios.get(`${SDK_API}/users/${address}/recommended?limit=10&tags=${_tags}`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })

    return res.data
  } catch (e) {
    console.log(e)
  }
}
