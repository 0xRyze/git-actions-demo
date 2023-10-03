import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'
import { CHAIN_IDS_TO_NAMES } from '../../constants/network'

// export const getStats = async (consumer, filter, offset, limit, chain = '', filterByCollection = []) => {
//   try {
//     const res = await axios.get(
//       `${SDK_API}/stats?limit=${limit}&offset=${offset}&filter_by=${filter}${
//         chain ? '&chain=' + CHAIN_IDS_TO_NAMES_URL_COMPONENT[chain] : ''
//       }`,
//       {
//         headers: { 'X-API-KEY': consumer },
//       },
//     )
//     return res.data
//   } catch (e) {
//     throw e
//   }
// }

export const getStats = async (
  consumer,
  filter,
  offset,
  limit,
  chains = '',
  filterByCollection = [],
  filterByType,
  allowedMarketPlaces,
) => {
  try {
    let _filterByType = (filterByType || []).filter((f) => f !== 'all')
    const res = await axios.post(
      `${SDK_API}/stats`,
      {
        limit,
        offset,
        filterBy: filter,
        filterByChain: chains.map((c) => CHAIN_IDS_TO_NAMES[c]),
        filterByCollection,
        filterByType: _filterByType,
        marketSource: allowedMarketPlaces,
      },
      {
        headers: { 'X-API-KEY': consumer },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}

export const fetchSearchResults = async (
  consumer,
  searchText,
  filterByType,
  filterBy,
  chains,
  allowedMarketPlaces,
  allowedCollections,
) => {
  try {
    let _filterByType = []
    if (filterByType[0] !== 'all') {
      _filterByType = filterByType
    }
    const res = await axios.post(
      `${SDK_API}/collection/search/${searchText}`,
      {
        filterByType: _filterByType,
        filterBy: filterBy,
        filterByChain: chains.map((c) => CHAIN_IDS_TO_NAMES[c]),
        marketSource: allowedMarketPlaces,
        filterByCollection: allowedCollections,
      },
      {
        headers: { 'X-API-KEY': consumer },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}

export const getTopWallets = async (accessKey, offset, limit, collectionId) => {
  try {
    const res = await axios.get(`${SDK_API}/stats/${collectionId}/getTopWallets?limit=${limit}&offset=${offset}`, {
      headers: { 'X-API-KEY': accessKey },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

export const getAllCollectionByAddress = async (consumer, deployer, offset = 0, limit = 15, space = null) => {
  try {
    const res = await axios.get(
      `${SDK_API}/users/${deployer}/collections?offset=${offset}&limit=${limit}&space=${space}`,
      {
        headers: { 'X-API-KEY': consumer },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}

export const getCollectionTags = async (consumer) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/tags`, {
      headers: { 'X-API-KEY': consumer },
    })
    return res.data
  } catch (e) {
    throw e
  }
}
