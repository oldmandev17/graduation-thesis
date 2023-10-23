import { axiosJson } from 'apis/axios'

const requestAuthSignUp = (data: any) => {
  return axiosJson.post('/auth/register', { ...data })
}

export const requestAuthSignIn = (data: any) => {
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

export { requestAuthSignUp, requestAuthFetchMe }
