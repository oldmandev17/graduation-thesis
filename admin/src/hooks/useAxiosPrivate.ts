import { axiosFormData } from 'apis/axios'
import { useEffect } from 'react'
import { useAppSelector } from 'stores/hooks'
import useRefreshToken from './useRefreshToken'

export default function useAxiosPrivate() {
  const refresh = useRefreshToken()
  const { accessToken } = useAppSelector((state) => state.auth)
  useEffect(() => {
    const requestInterceptor = axiosFormData.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseInterceptor = axiosFormData.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = refresh()
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosFormData(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosFormData.interceptors.request.eject(requestInterceptor)
      axiosFormData.interceptors.response.eject(responseInterceptor)
    }
  }, [accessToken, refresh])

  return axiosFormData
}
