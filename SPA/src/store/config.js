import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'

import { rootReducer } from './rootReducer'

export default configureStore({ reducer: rootReducer })

export const API = axios.create({
  baseURL: process.env.REACT_APP_baseURL,
  timeout: 30000,
  headers: {
    'content-type': 'application/json',
  },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN_KEY')
  const newConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : null,
    },
  }

  return newConfig
})
