import axios from 'axios'

export const setAxiosHeader = (headers) => {
  Object.keys(headers).forEach((k) => {
    axios.defaults.headers.common[k] = headers[k]
  })
}
