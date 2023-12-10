import { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { IoCloseSharp } from 'react-icons/io5'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [iconName, setIconName] = useState<boolean>(false)
  const [textName, setTextName] = useState<string>('')
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [iconEmail, setIconEmail] = useState<boolean>(false)
  const [textEmail, setTextEmail] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideNameClick = (event: any) => {
      if (event.target.id !== 'name') {
        setIconName(false)
      }
    }
    document.addEventListener('click', handleOutsideNameClick)
    return () => {
      document.removeEventListener('click', handleOutsideNameClick)
    }
  }, [])

  useEffect(() => {
    const handleOutsideEmailClick = (event: any) => {
      if (event.target.id !== 'email') {
        setIconEmail(false)
      }
    }
    document.addEventListener('click', handleOutsideEmailClick)
    return () => {
      document.removeEventListener('click', handleOutsideEmailClick)
    }
  }, [])

  return (
    <div className='flex flex-col justify-start min-w-[500px]'>
      <div className='flex flex-col items-center w-full gap-2'>
        <p className='py-2 text-5xl font-bold text-white '>SignUp</p>
        <p className='text-lg text-white '>Let's create an account</p>
      </div>
      <form autoComplete='off' className='flex flex-col justify-between w-full gap-5 px-20 py-7 '>
        <div className='relative block bg-white-500 ' id='divUsername'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <AiOutlineUser className='w-5 h-5 fill-black ' />
          </span>
          <input
            type='text'
            className='w-full py-2 pl-12 pr-10 text-black bg-white rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-md placeholder:text-md '
            id='name'
            placeholder='Full name'
            onFocus={() => setIconName(true)}
            onClick={() => setIconName(true)}
            onChange={(e) => {
              setTextName(e.target.value)
              setIconName(textName !== '' && true)
            }}
            value={textName}
          />
          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {textName !== '' && iconName && (
              <IoCloseSharp onClick={() => setTextName('')} className='w-5 h-5 fill-black' />
            )}
          </span>
        </div>
        <div className='relative block bg-white-500' id='divUsername'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <AiOutlineMail className='w-5 h-5 fill-black ' />
          </span>
          <input
            type='email'
            className='w-full py-2 pl-12 pr-10 text-black bg-white rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-md placeholder:text-md '
            id='email'
            placeholder='Email'
            onFocus={() => setIconEmail(true)}
            onClick={() => setIconEmail(true)}
            onChange={(e) => {
              setTextEmail(e.target.value)
              setIconEmail(textEmail !== '' && true)
            }}
            value={textEmail}
          />

          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {textEmail !== '' && iconEmail && (
              <IoCloseSharp onClick={() => setTextEmail('')} className='w-5 h-5 fill-black' />
            )}
          </span>
        </div>
        <div className='relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <RiLockPasswordLine className='w-5 h-5 fill-black ' />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            className='w-full py-2 pl-12 pr-10 text-black bg-white rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-md placeholder:text-md '
            id='password'
            placeholder='Password'
          />
          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {showPassword ? (
              <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className='w-5 h-5 fill-black ' />
            ) : (
              <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className='w-5 h-5 fill-black ' />
            )}
          </span>
        </div>

        <div className='relative block'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <RiLockPasswordLine className='w-5 h-5 fill-black ' />
          </span>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className='w-full py-2 pl-12 pr-10 text-black bg-white rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-md placeholder:text-md '
            id='Confirmpassword'
            placeholder='Confirm Password'
          />
          <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='w-5 h-5 fill-black '
              />
            ) : (
              <AiOutlineEye
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='w-5 h-5 fill-black '
              />
            )}
          </span>
        </div>
        <div className='flex justify-between'>
          <button
            onClick={() => navigate('/auth/login')}
            type='button'
            className='text-white hover:text-yellow-300 text-md'
          >
            Already Account ?
          </button>
          <button
            onClick={() => navigate('/auth/forgot-password')}
            type='button'
            className='text-white hover:text-yellow-300 text-md'
          >
            Forgot Password ?
          </button>
        </div>
        <button
          type='button'
          className='text-yellow-100 p-3 rounded-lg text-lg font-bold bg-[#1dbf73] hover:bg-green-500'
        >
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  )
}

export default SignupPage
