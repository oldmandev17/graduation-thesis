/* eslint-disable jsx-a11y/label-has-associated-control */
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch } from 'stores/hooks'
import { authLogIn } from 'stores/auth/auth-slice'

function Login() {
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must meet the requirements')
      .required('Password is required')
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
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

  const dispatch = useAppDispatch()

  const handleLogin = (values: any) => {
    dispatch(authLogIn(values))
    reset()
  }

  return (
    <section>
      <div className='flex flex-col items-center justify-center px-6 py-16 mx-auto'>
        <a href='/' className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          <img
            className='w-8 h-8 mr-2'
            src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg'
            alt='logo'
          />
          Freelancer
        </a>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              Sign in to your account
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Your email
                </label>
                <input
                  type='email'
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('email')}
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='name@company.com'
                />
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('password')}
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-start' />
                <a
                  href='/auth/forgotPassword'
                  className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                >
                  Forgot password?
                </a>
              </div>
              <button
                type='submit'
                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
