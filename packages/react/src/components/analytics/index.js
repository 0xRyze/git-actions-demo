import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const logMetric = async (accessKey, metricTag, metricDetails) => {
  try {
    await axios.post(`${SDK_API}/metrics/${metricTag}`, metricDetails, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
  } catch (e) {
    console.log(e)
  }
}
