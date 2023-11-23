/* eslint-disable consistent-return */
import { axiosJson } from 'apis/axios'

const requestAuthLogIn = (data: any) => {
  return axiosJson.post('/auth/login', { ...data })
}

const requestAuthFetchMe = (token: any) => {
  if (!token) return
  return axiosJson.get('/auth/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

const requestForgotPassword = (data: any) => {
  return axiosJson.post(
    '/auth/requestPasswordReset',
    { ...data },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const requestResetPassword = (data: any) => {
  return axiosJson.post(
    '/auth/resetPassword',
    { ...data },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const requestAuthRefreshToken = (token: any) => {
  if (!token) return
  return axiosJson.post(
    '/auth/refresh-token',
    {
      refreshToken: token
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const requestAuthLogout = (token: any) => {
  if (!token) return
  return axiosJson.delete(`/auth/logout/${token}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export {
  requestAuthFetchMe,
  requestAuthLogout,
  requestAuthRefreshToken,
  requestForgotPassword,
  requestResetPassword,
  requestAuthLogIn
}
