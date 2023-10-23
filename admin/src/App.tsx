/* eslint-disable no-underscore-dangle */
import { ReactNode, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAppDispatch, useAppSelector } from 'stores/hooks'
// import { getToken } from "utils/auth";

function App({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  useEffect(() => {
    if (user && user._id) {
      // const { accessToken } = getToken();
    } else {
      // const { refreshToken } = getToken();
    }
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
