/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { getUserDetail } from 'apis/api'
import { IUser, UserGender, UserRole, UserStatus } from 'modules/user'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { arrUserGender, arrUserRole, arrUserStatus } from 'assets/data'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import moment from 'moment'

const userSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string(),
  verify: Yup.boolean().required('Verify is required'),
  gender: Yup.string().oneOf(Object.values(UserGender)).nullable(),
  status: Yup.string().oneOf(Object.values(UserStatus))
})

function UserDetail() {
  const formHandler = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onSubmit'
  })
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit
  } = formHandler
  const { id } = useParams<{ id?: string }>()
  const { accessToken } = getToken()
  const [user, setUser] = useState<IUser>()
  const [roles, setRoles] = useState<Array<UserRole>>([])
  const [birthday, setBirthday] = useState<string>()

  const handleAddRole = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value && !roles.includes(event.target.value as UserRole)) {
      setRoles([...roles, event.target.value as UserRole])
    }
  }

  const handleRemoveRole = (index: number) => {
    const clonedRoles = [...roles]
    clonedRoles.splice(index, 1)
    setRoles(clonedRoles)
  }

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.warning(String(arrErroes[0]?.message))
    }
  }, [errors])

  const getUserDetails = useCallback(async () => {
    if (id)
      await getUserDetail(id, accessToken)
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.user)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    getUserDetails()
  }, [getUserDetails])

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('phone', user.phone)
      setValue('gender', user.gender)
      setValue('status', user.status)
      setValue('verify', user.verify)
      setBirthday(user.birthday?.toString())
      setRoles(user.role)
    }
  }, [setValue, user])

  const handleUpdateUser = async () => {}

  return (
    <FormProvider {...formHandler}>
      <form className='' onSubmit={handleSubmit(handleUpdateUser)}>
        <div className='flex flex-row w-full gap-10'>
          <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>Update User</h2>
          <div className='flex items-center w-full gap-3'>
            <input
              id='verify'
              type='checkbox'
              {...register('verify')}
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label htmlFor='verify' className='text-sm font-medium text-gray-900 dark:text-white'>
              Verify
            </label>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-10'>
          <div className='grid col-span-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5'>
            <div className='w-full'>
              <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Name
              </label>
              <input
                id='name'
                className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                type='text'
                placeholder='Type the name ...'
                {...register('name')}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='phone' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Phone
              </label>
              <input
                id='phone'
                className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                type='text'
                placeholder='Type the phone ...'
                {...register('phone')}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='gender' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Gender
              </label>
              <select
                id='gender'
                className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                {...register('gender')}
              >
                {arrUserGender.length > 0 &&
                  arrUserGender.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor='status' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Status
              </label>
              <select
                id='status'
                className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                {...register('status')}
              >
                {arrUserStatus.length > 0 &&
                  arrUserStatus.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor='birthday' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Birthday
              </label>
              <div
                id='states'
                className='px-1 py-0.5 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    defaultValue={birthday ? dayjs(birthday) : null}
                    onChange={(val: React.SetStateAction<any>) => setBirthday(val)}
                    className='!w-full !text-inherit !h-full'
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div>
              <label htmlFor='status' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Status
              </label>
              <select
                className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                onChange={handleAddRole}
              >
                {arrUserRole.length > 0 &&
                  arrUserRole.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
              </select>
              {roles.length > 0 && (
                <ul className='flex flex-wrap gap-2 mt-4'>
                  {roles.map((role, index) => (
                    <li
                      key={index + role}
                      className='flex gap-2 items-center py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-md border border-gray-300 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200'
                    >
                      <span className='text-gray-900'>{role}</span>
                      <span className='text-red-700 cursor-pointer' onClick={() => handleRemoveRole(index)}>
                        X
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='w-full'>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Email
              </label>
              <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                {user?.email}
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor='provider' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Provider
              </label>
              <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                {user?.provider}
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor='createdAt' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Created At
              </label>
              <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                {moment(user?.createdAt).format('MM/DD/YYYY HH:MM:SS')}
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor='updatedAdminAt' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Updated Admin At
              </label>
              <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                {moment(user?.updatedAdminAt).format('MM/DD/YYYY HH:MM:SS')}
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor='createdBy' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Created By
              </label>
              <div className='px-1 py-2 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                <pre>{JSON.stringify(user?.createdBy, null, 2)}</pre>
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor='updatedAdminBy' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Updated Admin By
              </label>
              <div className='px-1 py-2 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                <pre>{JSON.stringify(user?.updatedAdminBy, null, 2)}</pre>
              </div>
            </div>
          </div>
          <div className='grid col-span-1 gap-4 mb-4 sm:grid-cols-1 sm:gap-6 sm:mb-5'>123</div>
        </div>
        <div className='flex items-center space-x-4'>
          <button
            type='submit'
            className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
          >
            Update product
          </button>
          <button
            type='button'
            className='text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
          >
            <svg
              className='w-5 h-5 mr-1 -ml-1'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Delete
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default UserDetail
