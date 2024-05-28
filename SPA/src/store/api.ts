import axios from 'axios'

export const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  timeout: 30000,
  headers: { 'content-type': 'application/json' },
})

export const AuthenticatedAPI = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: { 'content-type': 'application/json' },
  timeout: 30000,
})

AuthenticatedAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN_KEY')
  config.headers.set('Authorization', token ? `Bearer ${token}` : null)
  return config
})
