/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getUserDetail } from 'apis/api'
import { arrUserGender, arrUserRole, arrUserStatus } from 'assets/data'
import dayjs from 'dayjs'
import { GigStatus, IGig } from 'modules/gig'
import { IOrder } from 'modules/order'
import { IUser, UserGender, UserRole, UserStatus } from 'modules/user'
import moment from 'moment'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import timeAgo from 'utils/timeAgo'
import * as Yup from 'yup'
import ReactApexChart from 'react-apexcharts'
import useDebounce from 'hooks/useDebounce'

interface MonthlyStats {
  yearMonth: string
  orderCount: number
  totalAmount: number
}

const userSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string(),
  gender: Yup.string().oneOf(Object.values(UserGender)).nullable(),
  status: Yup.string().oneOf(Object.values(UserStatus)),
  avatar: Yup.mixed()
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
    handleSubmit,
    unregister,
    watch,
    getValues
  } = formHandler
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { accessToken } = getToken()
  const [user, setUser] = useState<IUser>()
  const [roles, setRoles] = useState<Array<UserRole>>([])
  const [birthday, setBirthday] = useState<string>()
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const [gigName, setGigName] = useState<string>('')
  const gigNameDebounce = useDebounce(gigName, 500)
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const [orderCode, setOrderCode] = useState<string>()
  const orderCodeDebounce = useDebounce(orderCode, 500)

  const searchGigsByName = (gigs: IGig[], searchTerm: string) => {
    const searchTermLower = searchTerm.toLowerCase()
    const filteredGigs = gigs.filter((gig) => gig.name?.toLowerCase().includes(searchTermLower))
    setGigs(filteredGigs)
  }

  useEffect(() => {
    if (gigNameDebounce) {
      searchGigsByName(gigs, gigNameDebounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gigNameDebounce])

  const searchOrderByCode = (orders: IOrder[], searchCode: string) => {
    const searchCodeLower = searchCode.toLowerCase()
    const filteredOrders = orders.filter((order) => order.name?.toLowerCase().includes(searchCodeLower))
    setOrders(filteredOrders)
  }

  useEffect(() => {
    if (gigNameDebounce) {
      searchOrderByCode(orders, orderCodeDebounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCodeDebounce])

  const files = watch('avatar')

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setValue('avatar', droppedFiles[0], { shouldValidate: true })
    },
    [setValue]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  })

  useEffect(() => {
    register('avatar')
    return () => {
      unregister('avatar')
    }
  }, [register, unregister])

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
            setGigs(response.data.user?.gigs)
            setOrders(response.data.user?.orders)
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
      setValue('avatar', user.avatar)
      setBirthday(user.birthday?.toString())
      setRoles(user.role)
    }
  }, [setValue, user])

  const handleUpdateUser = async () => {}

  const countGigsByStatus = (gigs: IGig[]): number[] => {
    const statusOrder = [GigStatus.ACTIVE, GigStatus.INACTIVE, GigStatus.WAITING, GigStatus.BANNED, GigStatus.DELETED]
    const statusCount: Record<GigStatus, number> = {
      [GigStatus.ACTIVE]: 0,
      [GigStatus.INACTIVE]: 0,
      [GigStatus.WAITING]: 0,
      [GigStatus.BANNED]: 0,
      [GigStatus.DELETED]: 0,
      [GigStatus.NONE]: 0
    }
    if (gigs) {
      gigs.forEach((gig: IGig) => {
        const { status } = gig

        if (status) statusCount[status]++
      })
    }
    const resultArray = statusOrder.map((status) => statusCount[status])
    return resultArray
  }

  const seriesSeller = countGigsByStatus(user?.gigs || [])
  const optionsSeller = {
    title: {
      text: 'Gig Overview'
    },
    labels: ['ACTIVE', 'INACTIVE', 'WAITING', 'BANNED', 'DELETED'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }

  const getMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthNames[month - 1]
  }

  const getMonthlyStats = (
    orders: IOrder[]
  ): {
    yearMonths: string[]
    orderCounts: number[]
    totalAmounts: number[]
  } => {
    const monthlyStatsMap: { [yearMonth: string]: MonthlyStats } = {}

    const earliestOrderDate = orders.reduce(
      (minDate, order) => (order.createdAt < minDate ? order.createdAt : minDate),
      new Date()
    )

    const currentDate = new Date()
    const currentMonth = new Date(earliestOrderDate)

    while (currentMonth <= currentDate) {
      const year = currentMonth.getFullYear().toString()
      const month = getMonthName(currentMonth.getMonth() + 1)
      const yearMonthKey = `${month}-${year}`

      monthlyStatsMap[yearMonthKey] = {
        yearMonth: yearMonthKey,
        orderCount: 0,
        totalAmount: 0
      }

      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    orders.forEach((order) => {
      const orderYear = order.createdAt.getFullYear().toString()
      const orderMonth = getMonthName(order.createdAt.getMonth() + 1)
      const yearMonthKey = `${orderMonth}-${orderYear}`

      if (monthlyStatsMap[yearMonthKey]) {
        monthlyStatsMap[yearMonthKey].orderCount += 1
        monthlyStatsMap[yearMonthKey].totalAmount += order.price
      }
    })

    const yearMonths = Object.keys(monthlyStatsMap)
    const orderCounts = yearMonths.map((key) => monthlyStatsMap[key].orderCount)
    const totalAmounts = yearMonths.map((key) => monthlyStatsMap[key].totalAmount)

    return { yearMonths, orderCounts, totalAmounts }
  }

  const seriesBuyer = [
    {
      name: 'Order Count',
      type: 'column',
      data: getMonthlyStats(user?.orders || []).orderCounts
    },
    {
      name: 'Total Amount',
      type: 'line',
      data: getMonthlyStats(user?.orders || []).totalAmounts
    }
  ]

  const optionsBuyer = {
    stroke: {
      width: [0, 4]
    },
    title: {
      text: 'Order Overview'
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: getMonthlyStats(user?.orders || []).yearMonths,
    yaxis: [
      {
        title: {
          text: 'Order Count'
        }
      },
      {
        opposite: true,
        title: {
          text: 'Total Amount'
        }
      }
    ]
  }

  return (
    <div className='flex flex-col gap-5'>
      <FormProvider {...formHandler}>
        <form className='' onSubmit={handleSubmit(handleUpdateUser)}>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>Update User</h2>
          <div className='grid grid-cols-3 gap-6'>
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
                <label htmlFor='role' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Role
                </label>
                <select
                  className='w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                  onChange={handleAddRole}
                >
                  {arrUserRole.length > 0 &&
                    arrUserRole.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                </select>
                {roles.length > 0 && (
                  <ul className='flex flex-wrap gap-2 mt-4'>
                    {roles.map((role, index) => (
                      <li key={index + role}>
                        <span
                          id='badge-dismiss-dark'
                          className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded me-2 dark:bg-gray-700 dark:text-gray-300'
                        >
                          {role}
                          <button
                            type='button'
                            onClick={() => handleRemoveRole(index)}
                            className='inline-flex items-center p-1 text-sm text-gray-400 bg-transparent rounded-sm ms-2 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                            data-dismiss-target='#badge-dismiss-dark'
                            aria-label='Remove'
                          >
                            <svg
                              className='w-2 h-2'
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 14 14'
                            >
                              <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                              />
                            </svg>
                            <span className='sr-only'>Remove badge</span>
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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
                <label
                  htmlFor='updatedAdminAt'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
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
                  <pre className='overflow-auto'>{JSON.stringify(user?.createdBy, null, 2)}</pre>
                </div>
              </div>
              <div className='w-full'>
                <label
                  htmlFor='updatedAdminBy'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Updated Admin By
                </label>
                <div className='px-1 py-2 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                  <pre className='overflow-auto'>{JSON.stringify(user?.updatedAdminBy, null, 2)}</pre>
                </div>
              </div>
            </div>
            <div>
              <div className='grid col-span-1 gap-4 mb-4 sm:grid-cols-1 sm:gap-6 sm:mb-5'>
                <div className='w-full'>
                  <label htmlFor='verify' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Verify
                  </label>
                  <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
                    {user?.verify.toString().toUpperCase()}
                  </div>
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
                <div className='flex items-center justify-center rounded-full'>
                  <div
                    {...getRootProps()}
                    className='flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-full cursor-pointer w-80 h-80 bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                  >
                    {files ? (
                      <div className='rounded-full w-80 h-80'>
                        <img
                          src={
                            user?.avatar
                              ? URL.createObjectURL(files)
                              : typeof files !== 'string'
                              ? URL.createObjectURL(files)
                              : `${process.env.REACT_APP_URL_SERVER}/${getValues('avatar')}`
                          }
                          alt='Avatar'
                          className='object-contain mb-4 rounded-full w-80 h-80'
                        />
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg
                          className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 20 16'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                          />
                        </svg>
                        <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                          <span className='font-semibold'>Click to upload</span> or drag and drop
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'> PNG, JPG (MAX. 800x400px)</p>
                      </div>
                    )}
                    <input
                      {...getInputProps()}
                      id='dropzone-file'
                      type='file'
                      className='hidden rounded-full w-80 h-80'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <button
              type='submit'
              className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              Update User
            </button>
            {(user?.gigs?.length === 0 || !user?.gigs) && (user?.orders?.length === 0 || !user?.orders) && (
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
            )}
          </div>
        </form>
      </FormProvider>
      {!user?.role.includes(UserRole.SELLER) && (
        <>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            Freelancer Seller Account: Unlocking Opportunities for Independent Professionals
          </h2>
          <div className='grid grid-cols-3 gap-6'>
            <div className=''>
              <ReactApexChart options={optionsSeller} series={seriesSeller} type='pie' width={380} />
            </div>
            <div className='relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg'>
              <div className='flex flex-wrap items-center justify-between pb-4 space-y-4 flex-colum sm:flex-row sm:space-y-0'>
                <div className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                  Total Gig: {user?.orders?.length || 0}
                </div>
                <label htmlFor='table-search' className='sr-only'>
                  Search
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3'>
                    <svg
                      className='w-5 h-5 text-gray-500 dark:text-gray-400'
                      aria-hidden='true'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <input
                    type='text'
                    id='table-search'
                    className='block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Search for gig name'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setGigName(event.target.value)}
                  />
                </div>
              </div>
              <table className='w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='p-4'>
                      <div className='flex items-center'>
                        <input
                          id='checkbox-all-search'
                          type='checkbox'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label htmlFor='checkbox-all-search' className='sr-only'>
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Status
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Category
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Created At
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gigs?.length > 0 &&
                    gigs.map((gig: IGig, index) => (
                      <tr
                        key={gig._id + index}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <td className='w-4 p-4'>
                          <div className='flex items-center'>
                            <input
                              id='checkbox-table-search-1'
                              type='checkbox'
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                            />
                            <label htmlFor='checkbox-table-search-1' className='sr-only'>
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {gig?.name}
                        </th>
                        <td className='px-6 py-4'>{gig?.status}</td>
                        <td className='px-6 py-4'>{gig?.category?.name}</td>
                        <td className='px-6 py-4'>{timeAgo(new Date(gig.createdAt))}</td>
                        <td className='px-6 py-4'>
                          <span
                            onClick={() => navigate(`/gig-detail/${gig?._id}`)}
                            className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                          >
                            View
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {!user?.role.includes(UserRole.BUYER) && (
        <>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            Freelancer Buyer Account: Seamless Access to Quality Services
          </h2>
          <div className='grid grid-cols-3 gap-6'>
            <div className=''>
              <ReactApexChart options={optionsBuyer} series={seriesBuyer} type='line' />
            </div>
            <div className='relative col-span-2 overflow-x-auto shadow-md sm:rounded-lg'>
              <div className='flex flex-wrap items-center justify-between pb-4 space-y-4 flex-colum sm:flex-row sm:space-y-0'>
                <div className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                  Total Order: {user?.orders?.length || 0}
                </div>
                <label htmlFor='table-search' className='sr-only'>
                  Search
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3'>
                    <svg
                      className='w-5 h-5 text-gray-500 dark:text-gray-400'
                      aria-hidden='true'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <input
                    type='text'
                    id='table-search'
                    className='block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Search for order code'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setOrderCode(event.target.value)}
                  />
                </div>
              </div>
              <table className='w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='p-4'>
                      <div className='flex items-center'>
                        <input
                          id='checkbox-all-search'
                          type='checkbox'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label htmlFor='checkbox-all-search' className='sr-only'>
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Code
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Status
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Gig
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Created At
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.length > 0 &&
                    orders.map((order: IOrder, index) => (
                      <tr
                        key={order._id + index}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      >
                        <td className='w-4 p-4'>
                          <div className='flex items-center'>
                            <input
                              id='checkbox-table-search-1'
                              type='checkbox'
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                            />
                            <label htmlFor='checkbox-table-search-1' className='sr-only'>
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {order?.name}
                        </th>
                        <td className='px-6 py-4'>{order?.status}</td>
                        <td className='px-6 py-4'>{order?.gig?.name}</td>
                        <td className='px-6 py-4'>{timeAgo(new Date(order.createdAt))}</td>
                        <td className='px-6 py-4'>
                          <span
                            onClick={() => navigate(`/order-detail/${order?._id}`)}
                            className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                          >
                            View
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserDetail
