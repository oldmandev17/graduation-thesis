/* eslint-disable no-underscore-dangle */
import FooterAuth from 'components/auth/FooterAuth'
import HeaderAuth from 'components/auth/HeaderAuth'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'

function Authentication() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user._id) {
      navigate('/overview')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (user && user._id) return null

  return (
    <div className='h-screen bg-gray-50 dark:bg-gray-900'>
      <HeaderAuth />
      <Outlet />
      <FooterAuth />
    </div>
  )
}

export default Authentication
