/* eslint-disable @typescript-eslint/no-shadow */
import { getAnalytics } from 'apis/api'
import { IOrder, OrderStatus } from 'modules/order'
import { IUser } from 'modules/user'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'

interface MonthlyOrderStats {
  dateInterval: string
  orderCount: number
  totalAmount: number
}

interface MonthlyUserStats {
  dateInterval: string
  userCount: number
}

function Overview() {
  const { accessToken } = getToken()
  const [users, setUsers] = useState<Array<IUser>>([])
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const [timeInterval, setTimeInterval] = useState<string>('day')

  const getDashboardAnalytics = useCallback(async () => {
    await getAnalytics(timeInterval, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data.users)
          setOrders(response.data.orders)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeInterval])

  useEffect(() => {
    getDashboardAnalytics()
  }, [getDashboardAnalytics])

  const getMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthNames[month - 1]
  }

  const getMonthlyOrderStats = (
    orders: IOrder[]
  ): {
    dateIntervals: string[]
    orderCounts: number[]
    totalAmounts: number[]
  } => {
    const statsMap: { [dateInterval: string]: MonthlyOrderStats } = {}

    const currentDate = new Date()
    const startDate = new Date(currentDate)
    let day = 1
    if (timeInterval === 'day') {
      day = 1
    } else if (timeInterval === 'month') {
      day = 30
    } else {
      day = 365
    }
    startDate.setDate(currentDate.getDate() - day)

    const currentDateInterval = new Date(startDate)

    while (currentDateInterval <= currentDate) {
      const endDate = new Date(currentDateInterval)
      endDate.setDate(endDate.getDate() + 2)

      const startYear = currentDateInterval.getFullYear().toString()
      const startMonth = getMonthName(currentDateInterval.getMonth() + 1)
      const startDay = currentDateInterval.getDate()

      const endYear = endDate.getFullYear().toString()
      const endMonth = getMonthName(endDate.getMonth() + 1)
      const endDay = endDate.getDate()

      const dateIntervalKey = `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`

      statsMap[dateIntervalKey] = {
        dateInterval: dateIntervalKey,
        orderCount: 0,
        totalAmount: 0
      }

      currentDateInterval.setDate(currentDateInterval.getDate() + 3)
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt)

      if (orderDate >= startDate && orderDate <= currentDate) {
        Object.keys(statsMap).forEach((dateIntervalKey) => {
          const [start, end] = dateIntervalKey.split(' to ')
          const [startDay, startMonth, startYear] = start.split('-')
          const [endDay, endMonth, endYear] = end.split('-')

          const startDate = new Date(`${startMonth} ${startDay}, ${startYear}`)
          const endDate = new Date(`${endMonth} ${endDay}, ${endYear}`)
          endDate.setDate(endDate.getDate() + 1)
          endDate.setHours(0, 0, 0, 0)
          if (orderDate >= startDate && orderDate <= endDate) {
            statsMap[dateIntervalKey].orderCount += 1
            if (order.status === OrderStatus.COMPLETE) {
              statsMap[dateIntervalKey].totalAmount += (order.price / 105) * 5
            }
          }
        })
      }
    })

    const dateIntervals = Object.keys(statsMap)
    const orderCounts = dateIntervals.map((key) => statsMap[key].orderCount)
    const totalAmounts = dateIntervals.map((key) => statsMap[key].totalAmount)

    return { dateIntervals, orderCounts, totalAmounts }
  }

  const getMonthlyUserStats = (
    users: IUser[]
  ): {
    dateIntervals: string[]
    userCounts: number[]
  } => {
    const statsMap: { [dateInterval: string]: MonthlyUserStats } = {}

    const currentDate = new Date()
    const startDate = new Date(currentDate)
    let day = 1
    if (timeInterval === 'day') {
      day = 1
    } else if (timeInterval === 'month') {
      day = 30
    } else {
      day = 365
    }
    startDate.setDate(currentDate.getDate() - day)

    const currentDateInterval = new Date(startDate)

    while (currentDateInterval <= currentDate) {
      const endDate = new Date(currentDateInterval)
      endDate.setDate(endDate.getDate() + 2)

      const startYear = currentDateInterval.getFullYear().toString()
      const startMonth = getMonthName(currentDateInterval.getMonth() + 1)
      const startDay = currentDateInterval.getDate()

      const endYear = endDate.getFullYear().toString()
      const endMonth = getMonthName(endDate.getMonth() + 1)
      const endDay = endDate.getDate()

      const dateIntervalKey = `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`

      statsMap[dateIntervalKey] = {
        dateInterval: dateIntervalKey,
        userCount: 0
      }

      currentDateInterval.setDate(currentDateInterval.getDate() + 3)
    }

    users.forEach((user) => {
      const userDate = new Date(user.createdAt)

      if (userDate >= startDate && userDate <= currentDate) {
        Object.keys(statsMap).forEach((dateIntervalKey) => {
          const [start, end] = dateIntervalKey.split(' to ')
          const [startDay, startMonth, startYear] = start.split('-')
          const [endDay, endMonth, endYear] = end.split('-')

          const startDate = new Date(`${startMonth} ${startDay}, ${startYear}`)
          const endDate = new Date(`${endMonth} ${endDay}, ${endYear}`)
          endDate.setDate(endDate.getDate() + 1)
          endDate.setHours(0, 0, 0, 0)
          if (userDate >= startDate && userDate <= endDate) {
            statsMap[dateIntervalKey].userCount += 1
          }
        })
      }
    })

    const dateIntervals = Object.keys(statsMap)
    const userCounts = dateIntervals.map((key) => statsMap[key].userCount)

    return { dateIntervals, userCounts }
  }

  const seriesOrder = [
    {
      name: 'Order Count',
      type: 'column',
      data: getMonthlyOrderStats(orders || []).orderCounts
    },
    {
      name: 'Total Amount',
      type: 'line',
      data: getMonthlyOrderStats(orders || []).totalAmounts
    }
  ]

  const seriesUser = [
    {
      name: 'User Count',
      type: 'column',
      data: getMonthlyUserStats(users || []).userCounts
    }
  ]

  const optionsOrder = {
    stroke: {
      width: [0, 4]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: getMonthlyOrderStats(orders || []).dateIntervals,
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

  const optionsUser = {
    stroke: {
      width: [0, 4]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: getMonthlyUserStats(users || []).dateIntervals,
    yaxis: [
      {
        title: {
          text: 'User Count'
        }
      }
    ]
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex justify-end w-full'>
        <select
          name='day'
          id='day'
          value={timeInterval}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setTimeInterval(e.target.value)
          }}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        >
          <option value='day'>Last Day</option>
          <option value='month'>Last Month</option>
          <option value='year'>Last Year</option>
        </select>
      </div>
      <div className='grid grid-cols-3 gap-5'>
        <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Users</h5>
          <p className='text-3xl font-normal text-center text-gray-700 dark:text-gray-400'>{users.length}</p>
        </div>
        <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Orders</h5>
          <p className='text-3xl font-normal text-center text-gray-700 dark:text-gray-400'>{orders.length}</p>
        </div>
        <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Earned</h5>
          <p className='text-3xl font-normal text-center text-gray-700 dark:text-gray-400'>
            $
            {orders
              .filter((order) => order.status === OrderStatus.COMPLETE)
              .reduce((sum, current) => sum + (current.price / 105) * 5, 0)}
          </p>
        </div>
      </div>
      <div className='block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>User Overview</h5>
        <ReactApexChart options={optionsUser} series={seriesUser} type='line' />
      </div>
      <div className='block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Order Overview</h5>
        <ReactApexChart options={optionsOrder} series={seriesOrder} type='line' />
      </div>
    </div>
  )
}

export default Overview
