import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const getDomainSuggestions = async (accessKey, query, account) => {
  try {
    const res = await axios.get(
      `${SDK_API}/collection/unstoppable/searchDomain?query=${query}&wallet_address=${account}`,
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const claimDomain = async (accessKey, body) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/unstoppable/claim`, body, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export const lockDomain = async (accessKey, body) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/unstoppable/lockDomain`, body, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export const preLockDomain = async (accessKey, domain, currency, walletAddress) => {
  try {
    const res = await axios.get(
      `${SDK_API}/collection/unstoppable/updatedPrice?domain=${domain}&currency=${currency}&wallet_address=${walletAddress}`,
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (error) {
    throw error
  }
}

export const getSnsDomainSuggestions = async (accessKey, query) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/sns/searchDomain?=&query=${query}`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const registerSnsDomain = async (accessKey, domian, claimWallet, price, payUsing, space) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/sns/registerDomain`,
      {
        name: domian,
        claimWallet,
        price,
        payUsing,
        space,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const claimSnsDomain = async (accessKey, domian, signature) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/sns/claimDomain`,
      {
        name: domian,
        transactionHash: signature,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const getEnsDomainSuggestions = async (accessKey, query) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/ens/searchDomains?query=${query}.eth`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const claimEnsDomain = async (accessKey, body) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/ens/claimDomain`, body, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export const getBnsDomainSuggestions = async (accessKey, query) => {
  try {
    const res = await axios.get(`${SDK_API}/collection/base/search-domains?query=${query}`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const registerBnsDomain = async (accessKey, domain, claimWallet) => {
  try {
    const res = await axios.post(
      `${SDK_API}/collection/base/register-domain`,
      {
        name: domain,
        claimWallet,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const claimBnsDomain = async (accessKey, body) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/base/claim-domain`, body, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw error
  }
}
