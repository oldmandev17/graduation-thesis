/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import { getAllOrderByUser, getProfile } from 'apis/api'
import { IOrder, OrderStatus } from 'modules/order'
import { IUser } from 'modules/user'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AiOutlineNotification } from 'react-icons/ai'
import { GrCertificate } from 'react-icons/gr'
import { IoBookOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'

const becomeSellerData = [
  {
    icon: <AiOutlineNotification className='w-10 h-10 text-gray-800' />,
    title: 'Get noticed',
    content: 'Tap into the power of social media by sharing your Gig, and get expert help to grow your impact.'
  },
  {
    icon: <IoBookOutline className='w-10 h-10 text-gray-800' />,
    title: 'Get more skills & exposure',
    content:
      'Hone your skills and expand your knowledge with online courses. You’ll be able to offer more services and gain more exposure with every course completed.'
  },
  {
    icon: <GrCertificate className='w-10 h-10 text-gray-800' />,
    title: 'Become a successful seller!',
    content:
      'Watch this free online course to learn how to create an outstanding service experience for your buyer and grow your career as an online freelancer.'
  }
]

function DashboardPage() {
  const [profile, setProfile] = useState<IUser>()
  const { accessToken } = getToken()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Array<IOrder>>([])

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

  const getUserProfile = useCallback(async () => {
    await getProfile(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setProfile(response.data.profile)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken])

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  return (
    <>
      <Helmet>
        <title>Seller Dashboard | Freelancer</title>
      </Helmet>
      <div className='grid h-screen grid-cols-7 gap-16 py-10 px-28'>
        <div className='flex flex-col w-full col-span-2 gap-10'>
          <div className='flex flex-col w-full gap-5 p-5 bg-white'>
            <div className='flex items-center gap-5'>
              {profile?.avatar ? (
                <img
                  src={`${
                    profile.avatar.startsWith('upload')
                      ? `${process.env.REACT_APP_URL_SERVER}/${profile.avatar}`
                      : profile.avatar
                  }`}
                  alt={profile?.name}
                  className='w-20 h-20 rounded-full'
                />
              ) : (
                <div className='relative flex items-center justify-center w-20 h-20 bg-purple-500 rounded-full'>
                  <span className='text-lg text-white'>{profile?.email[0].toUpperCase()}</span>
                </div>
              )}
              <span className='text-xl font-semibold text-gray-600'>{profile?.id}</span>
            </div>
            <Divider />
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-5 gap-1'>
                <p className='col-span-3 text-lg'>Delivered on time</p>
                <div className='flex items-center justify-between col-span-2'>
                  <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded-xl dark:bg-gray-700'>
                    <div
                      className='h-3 bg-gray-500 rounded-xl'
                      style={{
                        width: `${
                          profile && profile.orders && profile.orders.length <= 0
                            ? '100'
                            : `${
                                (profile?.orders?.filter((order) => order.status === OrderStatus.COMPLETE)
                                  ?.length as number) / Number(profile?.orders?.length)
                              }`
                        }%`
                      }}
                    />
                  </div>
                  <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    {profile && profile.orders && profile.orders.length <= 0
                      ? '100'
                      : `${
                          (profile?.orders?.filter((order) => order.status === OrderStatus.COMPLETE)
                            ?.length as number) / Number(profile?.orders?.length)
                        }`}
                    %
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-5 gap-1'>
                <p className='col-span-3 text-lg'>Order completion</p>
                <div className='flex items-center justify-between col-span-2'>
                  <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded-xl dark:bg-gray-700'>
                    <div
                      className='h-3 bg-gray-500 rounded-xl'
                      style={{
                        width: `${
                          orders && orders.length <= 0
                            ? '100'
                            : `${Number(
                                (orders?.filter((order) => order.status === OrderStatus.COMPLETE).length /
                                  orders?.length) *
                                  100
                              ).toFixed(0)}`
                        }%`
                      }}
                    />
                  </div>
                  <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    {orders && orders.length <= 0
                      ? '100'
                      : `${Number(
                          (orders?.filter((order) => order.status === OrderStatus.COMPLETE).length / orders?.length) *
                            100
                        ).toFixed(0)}`}
                    %
                  </span>
                </div>
              </div>
            </div>
            <Divider />
            <div className='flex justify-between'>
              <p className='text-lg font-semibold text-gray-600'>Earned in December</p>
              <span className='text-lg font-semibold'>
                $
                {orders.length > 0
                  ? orders
                      .filter((order) => order.status === OrderStatus.COMPLETE)
                      .reduce((sum, current) => sum + (current.price / 105) * 100, 0)
                  : 0}
              </span>
            </div>
          </div>
          <div className='flex justify-between w-full p-5 bg-white'>
            <p className='text-lg font-semibold text-gray-600'>Inbox</p>
            <button
              className='font-semibold text-blue-600'
              type='button'
              onClick={() => navigate(`/user/${profile?.id}/messages`)}
            >
              View All
            </button>
          </div>
        </div>
        <div className='flex flex-col col-span-5 gap-10 ww-full'>
          <div className='inline-flex items-center w-full gap-5'>
            <p className='text-lg font-semibold text-gray-600 min-w-max'>Upgrade Your Business</p>
            <hr className='bg-gray-300 w-full h-0.5 rounded-full' />
          </div>
          <div className='grid grid-cols-3 gap-10 p-5 bg-white'>
            <div className='flex flex-col col-span-3 gap-3'>
              <h4 className='text-2xl font-semibold text'>3 steps to become a top seller on Fiverr</h4>
              <p className='text-gray-600'>
                The key to your success on Fiverr is the brand you build for yourself through your Fiverr reputation. We
                gathered some tips and resources to help you become a leading seller on Fiverr.
              </p>
            </div>
            {becomeSellerData.length > 0 &&
              becomeSellerData.map((become, index) => (
                <div key={become.title + index} className='flex flex-col gap-5'>
                  <span className='w-10 h-10'>{become.icon}</span>
                  <p className='text-lg font-semibold'>{become.title}</p>
                  <p className='text-gray-600'>{become.content}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
