/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
import { getAllOrderByUser } from 'apis/api'
import { IOrder, OrderStatus } from 'modules/order'
import { useCallback, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Helmet } from 'react-helmet-async'
import { FaUserAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'

interface MonthlyStats {
  dateInterval: string
  orderCount: number
  totalAmount: number
}

function AnalyticPage() {
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const { accessToken } = getToken()
  const getAllOrderByUsers = useCallback(async () => {
    await getAllOrderByUser(accessToken, undefined, '', 'createdAt', 'desc', 'seller')
      .then((response) => {
        if (response.status === 200) {
          setOrders(response.data.orders)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken])

  useEffect(() => {
    getAllOrderByUsers()
  }, [getAllOrderByUsers])

  const getMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthNames[month - 1]
  }

  const getMonthlyStats = (
    orders: IOrder[]
  ): {
    dateIntervals: string[]
    orderCounts: number[]
    totalAmounts: number[]
  } => {
    const statsMap: { [dateInterval: string]: MonthlyStats } = {}

    const currentDate = new Date()
    const startDate = new Date(currentDate)
    startDate.setDate(currentDate.getDate() - 30)

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
              statsMap[dateIntervalKey].totalAmount += (order.price / 105) * 100
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

  const seriesBuyer = [
    {
      name: 'Order Count',
      type: 'column',
      data: getMonthlyStats(orders || []).orderCounts
    },
    {
      name: 'Total Amount',
      type: 'line',
      data: getMonthlyStats(orders || []).totalAmounts
    }
  ]

  const optionsBuyer = {
    stroke: {
      width: [0, 4]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: getMonthlyStats(orders || []).dateIntervals,
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
    <>
      <Helmet>
        <title>Analytics | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-10 py-10 px-28'>
        <span className='text-4xl font-semibold text-gray-500 '>Analytics</span>
        <div className='flex flex-row w-full py-3 border border-gray-300 rounded-lg'>
          <div className='flex flex-col items-center justify-center w-full gap-2 border-r border-gray-300'>
            <span className='text-base font-semibold text-gray-600'>Earning</span>
            <span className='text-xl font-semibold text-gray-500'>
              $
              {orders.length > 0
                ? orders
                    .filter((order) => order.status === OrderStatus.COMPLETE)
                    .reduce((sum, current) => sum + (current.price / 105) * 100, 0)
                : 0}
            </span>
          </div>
          <div className='flex flex-col items-center justify-center w-full gap-2'>
            <span className='text-base font-semibold text-gray-600'>Avg. selling price</span>
            <span className='text-xl font-semibold text-gray-500'>
              $
              {orders.length > 0
                ? orders
                    .filter((order) => order.status === OrderStatus.COMPLETE)
                    .reduce((sum, current) => sum + (current.price / 105) * 100, 0) /
                  orders.filter((order) => order.status === OrderStatus.COMPLETE).length
                : 0}
            </span>
          </div>
          <div className='flex flex-col items-center justify-center w-full gap-2 border-l border-gray-300'>
            <span className='text-base font-semibold text-gray-600'>Orders completed</span>
            <span className='text-xl font-semibold text-gray-500'>
              {orders.length > 0 ? orders.filter((order) => order.status === OrderStatus.COMPLETE).length : 0}
            </span>
          </div>
        </div>
        <div className='p-5 border border-gray-300 rounded-xl'>
          <span className='text-xl font-semibold text-gray-500 '>Overview last 30 days</span>
          <ReactApexChart options={optionsBuyer} series={seriesBuyer} type='line' />
        </div>
        <div className='flex flex-col gap-3 p-4 mb-5 border border-gray-300 rounded-xl'>
          <div className='text-xl font-semibold text-gray-500 '>Your Seller Level</div>
          <div className='flex flex-row items-center justify-center gap-2'>
            <span className='flex items-center justify-center w-16 h-16 bg-gray-400 rounded-full'>
              <FaUserAlt className='w-6 h-6 fill-gray-100' />
            </span>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                className='h-5 bg-[#00b14f] rounded'
                style={{
                  width: `${
                    orders.filter((order) => order.status === OrderStatus.COMPLETE).length >= 5
                      ? '100'
                      : (orders.filter((order) => order.status === OrderStatus.COMPLETE).length / 5) * 100
                  }%`
                }}
              />
            </div>
            <div className='rounded-full h-16 w-16 bg-[#91d8d9] flex flex-col justify-center items-center text-xs text-white font-bold'>
              <span>LEVEL</span>
              <span> ONE</span>
            </div>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                style={{
                  width: `${
                    orders.filter((order) => order.status === OrderStatus.COMPLETE).length <= 5
                      ? '0'
                      : orders.filter((order) => order.status === OrderStatus.COMPLETE).length > 10
                      ? '100'
                      : ((orders.filter((order) => order.status === OrderStatus.COMPLETE).length - 5) / 5) * 100
                  }%`
                }}
                className='h-5 bg-[#00b14f] rounded'
              />
            </div>
            <div className='rounded-full h-16 w-16  bg-[#deabf8] flex flex-col justify-center items-center text-xs text-white font-bold'>
              <span>LEVEL</span>
              <span> TWO</span>
            </div>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                style={{
                  width: `${
                    orders.filter((order) => order.status === OrderStatus.COMPLETE).length <= 10
                      ? '0'
                      : orders.filter((order) => order.status === OrderStatus.COMPLETE).length > 15
                      ? '100'
                      : ((orders.filter((order) => order.status === OrderStatus.COMPLETE).length - 10) / 15) * 100
                  }%`
                }}
                className='h-5 bg-[#00b14f] rounded'
              />
            </div>
            <img src='/images/top_rated.png' alt='top_rated' className='w-16 h-16' />
          </div>
        </div>
      </div>
    </>
  )
}

export default AnalyticPage
