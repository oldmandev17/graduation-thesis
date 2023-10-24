import { axiosJson } from 'apis/axios'

export const requestAuthLogIn = (data: any) => {
  return axiosJson.post('/auth/login', { ...data })
}

const requestAuthFetchMe = (token: any) => {
  if (!token) return
  // eslint-disable-next-line consistent-return
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

export { requestAuthFetchMe, requestForgotPassword, requestResetPassword }
