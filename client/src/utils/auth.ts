import Cookies from 'js-cookie'

const accessTokenKey = 'access_token'
const refreshTokenKey = 'refreshToken'
const objCookies = {
  expires: 30,
  domain: process.env.COOKIE_DOMAIN
}

export const saveToken = (access_token: any, refreshToken: any) => {
  if (access_token && refreshToken) {
    Cookies.set(accessTokenKey, access_token, {
      ...objCookies
    })
    Cookies.set(refreshTokenKey, refreshToken, {
      ...objCookies
    })
  } else {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: '/',
      domain: process.env.COOKIE_DOMAIN
    })
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: '/',
      domain: process.env.COOKIE_DOMAIN
    })
  }
}

export const getToken = () => {
  const accessToken = Cookies.get(accessTokenKey)
  const refreshToken = Cookies.get(refreshTokenKey)

  return {
    accessToken,
    refreshToken
  }
}

export const logout = () => {
  const accessToken = Cookies.get(accessTokenKey)
  if (accessToken) {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: '/',
      domain: process.env.COOKIE_DOMAIN
    })
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: '/',
      domain: process.env.COOKIE_DOMAIN
    })
  }
}
