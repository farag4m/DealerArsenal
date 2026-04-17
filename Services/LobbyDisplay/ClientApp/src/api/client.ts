import axios from 'axios'
import { ENV } from '../env'

export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})
