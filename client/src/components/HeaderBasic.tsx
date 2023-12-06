/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'

function HeaderBasic() {
  const navigate = useNavigate()
  const location = useLocation()
  const [keyword, setKeyword] = useState<string>('')
  const [isFixed, setIsFixed] = useState<boolean>(false)
  const [isNav, setIsNav] = useState<boolean>(false)
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  const handleSearchKeyword = (event: any) => {
    event.preventDefault()
    if (keyword) {
      navigate(`/search?keyword=${keyword.trim()}`)
    }
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (location.pathname === '/') {
      const positionNavbar = () => {
        window.pageYOffset > 0 ? setIsFixed(true) : setIsFixed(false)
        window.pageYOffset > 50 ? setIsNav(true) : setIsNav(false)
      }

      window.addEventListener('scroll', positionNavbar)

      return () => window.removeEventListener('scroll', positionNavbar)
    }
    setIsFixed(false)
    setIsNav(false)
  }, [location.pathname])

  return (
    <div
      className={`flex flex-col w-full top-0 z-30 ${
        isFixed ? 'fixed bg-white' : `${location.pathname === '/' && 'absolute bg-transparen'}`
      }`}
    >
      <div className='flex flex-row items-center justify-between py-5 px-28'>
        <div className='flex flex-row w-3/4 gap-5'>
          <img
            onClick={() => navigate('/')}
            src='/images/Fiverr-Logo.png'
            alt='logo'
            width='80'
            height='80'
            className='cursor-pointer'
          />
          <form
            onSubmit={handleSearchKeyword}
            className={`flex flex-row w-full ${
              isFixed ? 'opacity-100' : `${location.pathname === '/' && 'opacity-0'}`
            }`}
          >
            <input
              type='text'
              onChange={handleChangeKeyword}
              className='w-full h-12 py-0 pl-5 text-lg text-gray-900 border border-gray-300 rounded-lg rounded-r-none border-1 focus:rounded-none'
              placeholder='what service are you looking for today?'
            />
            <button
              type='submit'
              className='flex flex-col justify-center w-16 pl-5 bg-black rounded-l-none rounded-r-lg cursor-pointer '
            >
              <AiOutlineSearch className='w-6 h-6 fill-white' />
            </button>
          </form>
        </div>
        <div className='flex flex-row gap-5'>
          <button
            onClick={() => navigate('/seller')}
            type='button'
            className={`${
              isFixed ? 'text-gray-600' : `${location.pathname === '/' && 'text-white'}`
            } text-lg font-semibold hover:text-green-500 mx-2 cursor-pointer transition-all duration-300`}
          >
            Become a Seller
          </button>
          <button
            onClick={() => navigate('/auth/register')}
            type='button'
            className={`${
              isFixed ? 'text-gray-600' : `${location.pathname === '/' && 'text-white'}`
            } text-lg font-semibold hover:text-green-500 mx-2 cursor-pointer transition-all duration-300`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth/login')}
            type='button'
            className={`${
              isFixed || location.pathname !== '/'
                ? 'text-green-400 border-green-500'
                : `${location.pathname === '/' && 'text-white border-white'}`
            } font-bold text-base  border  px-4 py-1.5 rounded-md cursor-pointer hover:text-white hover:bg-green-500 transition-all duration-300`}
          >
            Join
          </button>
        </div>
      </div>
      <div className={`${isNav ? 'block' : `${location.pathname === '/' && 'hidden'}`} transition-all duration-300`}>
        <NavigationBar />
      </div>
    </div>
  )
}

export default HeaderBasic
