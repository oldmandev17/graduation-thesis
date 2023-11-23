import React, { useEffect, useState } from 'react'

import { AiOutlineUser, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineMail } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'

import { IoCloseSharp } from 'react-icons/io5'

function SignupPage() {
  const [show, setShow] = useState<boolean>(false)
  const [icon, setIcon] = useState<boolean>(false)
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (event.target.id !== 'username') {
        setIcon(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  return (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col items-center gap-2 px-64  '>
        <p className=' text-white font-bold text-5xl py-2'>SignUp</p>
        <p className=' text-white text-xs'>Let's create an account</p>
      </div>
      <form autoComplete='off' className='flex flex-col justify-between py-7 px-52  gap-5  '>
        <div className='relative block bg-white-500  ' id='divUsername'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <AiOutlineUser className='h-5 w-5 fill-black ' />
          </span>
          <input
            type='text'
            className='bg-white  text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  '
            id='username'
            placeholder='Full name'
            onFocus={() => setIcon(true)}
            onClick={() => setIcon(true)}
            onChange={(e) => {
              setText(e.target.value)
              setIcon(text !== '' && true)
            }}
            value={text}
          />

          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {text !== '' && icon && <IoCloseSharp onClick={() => setText('')} className='h-5 w-5 fill-black' />}
          </span>
        </div>
        <div className='relative block bg-white-500  ' id='divUsername'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <AiOutlineMail className='h-5 w-5 fill-black ' />
          </span>
          <input
            type='email'
            className='bg-white  text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  '
            id='gmail'
            placeholder='Gmail'
            onFocus={() => setIcon(true)}
            onClick={() => setIcon(true)}
            onChange={(e) => {
              setText(e.target.value)
              setIcon(text !== '' && true)
            }}
            value={text}
          />

          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {text !== '' && icon && <IoCloseSharp onClick={() => setText('')} className='h-5 w-5 fill-black' />}
          </span>
        </div>
        <div className='relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <RiLockPasswordLine className='h-5 w-5 fill-black ' />
          </span>
          <input
            type={show ? 'text' : 'password'}
            className='bg-white text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  '
            id='password'
            placeholder='Password'
          />
          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {show ? (
              <AiOutlineEyeInvisible onClick={() => setShow(!show)} className='h-5 w-5 fill-black ' />
            ) : (
              <AiOutlineEye onClick={() => setShow(!show)} className='h-5 w-5 fill-black ' />
            )}
          </span>
        </div>

        <div className='relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <RiLockPasswordLine className='h-5 w-5 fill-black ' />
          </span>
          <input
            type={show ? 'text' : 'password'}
            className='bg-white text-black  w-full rounded-md py-2 pl-12 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm placeholder:text-xs  '
            id='Confirmpassword'
            placeholder='Confirm Password'
          />
          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {show ? (
              <AiOutlineEyeInvisible onClick={() => setShow(!show)} className='h-5 w-5 fill-black ' />
            ) : (
              <AiOutlineEye onClick={() => setShow(!show)} className='h-5 w-5 fill-black ' />
            )}
          </span>
        </div>
        <button
          type='button'
          className='text-yellow-100  p-3 rounded-lg text-sm font-bold bg-[#1dbf73] hover:bg-green-500 '
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupPage
