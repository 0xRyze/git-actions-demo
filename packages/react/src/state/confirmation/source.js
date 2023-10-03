import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const scanTransaction = async (accessKey, params) => {
  try {
    const res = await axios.post(`${SDK_API}/transaction/scan`, params, {
      headers: { 'X-API-KEY': accessKey },
    })
    return res.data
  } catch (e) {
    throw e
  }
}
