import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const getConsumerDetails = async (accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/consumer`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    return {}
    console.log(e)
  }
}
