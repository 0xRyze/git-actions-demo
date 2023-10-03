import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const getSurvey = async (accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/users/survey?limit=10`, {
      headers: { 'X-API-KEY': accessKey },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

export const submitSurvey = async (accessKey, address, id, rating) => {
  try {
    const res = await axios.post(
      `${SDK_API}/users/${address}/survey`,
      {
        id,
        rating,
      },
      {
        headers: { 'X-API-KEY': accessKey },
      },
    )
    return res.data
  } catch (e) {
    throw e
  }
}
