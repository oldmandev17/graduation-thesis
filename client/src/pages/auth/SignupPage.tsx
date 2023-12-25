/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { IoCloseSharp } from 'react-icons/io5'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authSignUp } from 'stores/auth/auth-slice'
import { useAppDispatch } from 'stores/hooks'
import * as Yup from 'yup'

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must meet the requirements')
    .required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
})

function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [iconName, setIconName] = useState<boolean>(false)
  const [textName, setTextName] = useState<string>('')
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [iconEmail, setIconEmail] = useState<boolean>(false)
  const [textEmail, setTextEmail] = useState<string>('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.error(String(arrErroes[0]?.message), {
        pauseOnHover: false,
        delay: 0
      })
    }
  }, [errors])

  const handleSignUp = (values: any) => {
    dispatch(authSignUp(values))
    reset()
  }

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
      <form onSubmit={handleSubmit(handleSignUp)} className='flex flex-col justify-between w-full gap-5 px-20 py-7 '>
        <div className='relative block bg-white-500 ' id='divUsername'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-5'>
            <AiOutlineUser className='w-5 h-5 fill-black ' />
          </span>
          <input
            type='text'
            className='w-full py-2 pl-12 pr-10 text-black bg-white rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-md placeholder:text-md '
            id='name'
            {...register('name')}
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
            {...register('email')}
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
            {...register('password')}
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
            {...register('confirmPassword')}
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
          type='submit'
          className='text-yellow-100 p-3 rounded-lg text-lg font-bold bg-[#1dbf73] hover:bg-green-500'
        >
          {isSubmitting ? (
            <div role='status'>
              <svg
                aria-hidden='true'
                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          ) : (
            <>CREATE ACCOUNT</>
          )}
        </button>
      </form>
    </div>
  )
}

export default SignupPage
