import { axiosJson } from 'apis/axios'
import { getToken, saveToken } from 'utils/auth'

export default function useRefreshToken() {
  async function refresh() {
    const { refreshToken } = getToken()
    if (!refreshToken) return null
    const response = await axiosJson.post(
      '/auth/refresh-token',
      {
        refreshToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.data) return null
    saveToken(response.data.accessToken, response.data.refreshToken)

    return response.data.accessToken || ''
  }
  return refresh
}
