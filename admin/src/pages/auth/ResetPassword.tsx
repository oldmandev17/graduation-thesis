/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch } from 'stores/hooks'
import { useParams } from 'react-router-dom'
import { authResetPassword } from 'stores/auth/auth-slice'

function ResetPassword() {
  const { id, resetString } = useParams<{
    id?: string
    resetString?: string
  }>()

  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must meet the requirements')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    terms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
      .required('You must agree to the terms and conditions')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
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

  const handleResetPassowrd = (values: any) => {
    values.userId = id
    values.resetString = resetString
    dispatch(authResetPassword(values))
  }

  return (
    <section>
      <div className='flex flex-col items-center justify-center px-6 py-16 mx-auto '>
        <a href='/' className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          <img
            className='w-8 h-8 mr-2'
            src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg'
            alt='logo'
          />
          Freelancer
        </a>
        <div className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8'>
          <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
            Change Password
          </h2>
          <form className='mt-4 space-y-4 lg:mt-5 md:space-y-5' onSubmit={handleSubmit(handleResetPassowrd)}>
            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                New Password
              </label>
              <input
                type='password'
                {...register('password')}
                name='password'
                id='password'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Confirm password
              </label>
              <input
                type='password'
                {...register('confirmPassword')}
                name='confirmPassword'
                id='confirmPassword'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='flex items-start'>
              <div className='flex items-center h-5'>
                <input
                  id='terms'
                  {...register('terms')}
                  name='terms'
                  aria-describedby='terms'
                  type='checkbox'
                  className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                />
              </div>
              <div className='ml-3 text-sm'>
                <label htmlFor='terms' className='font-light text-gray-500 dark:text-gray-300'>
                  I accept the{' '}
                  <a className='font-medium text-primary-600 hover:underline dark:text-primary-500' href='/'>
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type='submit'
              className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              Reset passwod
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword
