import axios from 'axios'
import { getToken, clearAuth } from '@/lib/auth-utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request Interceptor: attach JWT token ────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: normalize errors ───────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear auth and don't redirect (let components handle it)
    if (error.response?.status === 401) {
      clearAuth()
    }

    // Normalize error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'

    return Promise.reject(new Error(message))
  }
)

export default apiClient
