/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import { useEffect } from 'react'
import { SiFiverr } from 'react-icons/si'
import { Outlet, useNavigate } from 'react-router-dom'
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
    <div className='bg-[#093f25] h-screen'>
      <span className='flex flex-row pl-5' onClick={() => navigate('/')}>
        <SiFiverr className='w-20 h-20 fill-white' />
      </span>
      <div className=' bg-[#093f25] grid grid-cols-2 px-20 py-20 '>
        <div className='px-16'>
          <Outlet />
        </div>
        <img className='w-full h-auto' src='/images/career.webp' alt='login_image' />
      </div>
    </div>
  )
}

export default AuthenticationLayout
