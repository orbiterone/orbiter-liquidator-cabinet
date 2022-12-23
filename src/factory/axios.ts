import axios from 'axios'
import { store } from '../redux/store'

// @ts-ignore
axios.defaults.headers['x-orbiter-api-key'] =
  process.env.REACT_APP_X_ORBITER_LIQUIDATOR_API_KEY

interface params {
  method: string
  path: string
  data?: {}
}

export const request = ({ method, path, data }: params) => {
  return axios({
    method,
    url: `${process.env.REACT_APP_X_ORBITER_LIQUIDATOR_API_URL}/${path}`,
    data,
  }).then((res) => res)
}
