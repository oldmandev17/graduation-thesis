/* eslint-disable no-underscore-dangle */
import Footer from 'components/Footer'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { SiFiverr } from 'react-icons/si'
import { useAppSelector } from 'stores/hooks'

function AuthenticationLayout() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user._id) {
      navigate('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (user && user._id) return null

  return (
    <div className='bg-[#093f25]'>
      <span className='flex flex-row pl-5'>
        <SiFiverr className='w-20 h-20 fill-white' />
      </span>
      <div className=' bg-[#093f25] flex flex-row px-14 py-24 justify-center'>
        <Outlet />
        <div className=''>
          <img src='/images/career.webp' alt='login_image' />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AuthenticationLayout
