import axios from 'axios'

export const axiosJson = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
})

export const axiosFormData = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Cache-Control': 'no-cache'
  }
})
