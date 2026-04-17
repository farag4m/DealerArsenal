import axios from 'axios'
import type { AxiosInstance } from 'axios'

const baseURL = import.meta.env['VITE_API_BASE_URL'] as string | undefined ?? 'http://localhost:5000'

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token !== null && token !== '') {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Never expose raw error details — log only, return generic shape
    console.error('[api] request failed', error)
    return Promise.reject(error)
  },
)

export default apiClient
