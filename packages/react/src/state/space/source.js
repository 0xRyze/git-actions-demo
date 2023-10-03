import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const fetchSpaceLeaderBoard = async (ids, offset, limit, accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/spaces/leaderboard?space_ids=${ids}&offset=${offset}&limit=${limit}`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}
