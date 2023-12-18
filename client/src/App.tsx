/* eslint-disable no-underscore-dangle */
import { useMessage } from 'contexts/StateContext'
import { ReactNode, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { authRefreshToken, authUpdateUser } from 'stores/auth/auth-slice'
import { useAppDispatch, useAppSelector } from 'stores/hooks'
import { getToken, logout } from 'utils/auth'

function App({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { handleWishlist } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  useEffect(() => {
    if (user && user._id) {
      const { accessToken } = getToken()
      dispatch(
        authUpdateUser({
          user,
          accessToken
        })
      )
      handleWishlist(user.wishlist)
    } else {
      const { refreshToken } = getToken()
      if (refreshToken) dispatch(authRefreshToken(refreshToken))
      else {
        dispatch(
          authUpdateUser({
            user: undefined,
            accessToken: null
          })
        )
        logout()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user])

  return (
    <>
      <Helmet>
        <title>Freelancer</title>
      </Helmet>
      {children}
    </>
  )
}

export default App
