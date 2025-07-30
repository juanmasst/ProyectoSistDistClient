import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

export function useAuthApi() {
  const { getAccessTokenSilently } = useAuth0()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  api.interceptors.request.use(async (config) => {
    const token = await getAccessTokenSilently()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
} 