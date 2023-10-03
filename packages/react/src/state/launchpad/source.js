import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const createCollection = async (params, accessKey) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/create`, params, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const fileUpload = async (file, walletAddress, accessKey, signature) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('wallet_address', walletAddress)
    formData.append('signature', signature)
    const res = await axios.post(`${SDK_API}/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const assetUpload = async (file, name, accessKey, description) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    const res = await axios.post(`${SDK_API}/assets/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const solanaAssetUpload = async (file, name, accessKey, description, symbol) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('symbol', symbol)
    const res = await axios.post(`${SDK_API}/assets/solana/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const isWhitelistedForLaunchpad = async (accessKey, walletAddress) => {
  try {
    const res = await axios.get(`${SDK_API}/users/${walletAddress}/launchpad`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const getContractFactoryAddresses = async (accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/contracts/contract-factory`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const createSolanaCollectionTx = async (params, accessKey) => {
  try {
    const res = await axios.post(`${SDK_API}/collection/solana/create`, params, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserSpaces = async (walletAddress, accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/spaces?wallet_address=${walletAddress}&limit=25`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const createSpaces = async (params, accessKey) => {
  try {
    const res = await axios.post(`${SDK_API}/spaces`, params, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}
