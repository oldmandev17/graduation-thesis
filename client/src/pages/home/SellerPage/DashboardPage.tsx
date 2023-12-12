import { Divider } from '@mui/material'
import { getProfile } from 'apis/api'
import { OrderStatus } from 'modules/order'
import { IUser } from 'modules/user'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'

function DashboardPage() {
  const [profile, setProfile] = useState<IUser>()
  console.log('🚀 ~ file: DashboardPage.tsx:10 ~ DashboardPage ~ profile:', profile)
  const { accessToken } = getToken()

  const getUserProfile = useCallback(async () => {
    await getProfile(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setProfile({ ...response.data.profile, orders: response.data.orders, gigs: response.data.gigs })
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken])

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  return (
    <div className='grid grid-cols-7 gap-16 px-28 py-10'>
      <div className='flex flex-col gap-3 w-full col-span-2'>
        <div className='p-4 flex flex-col gap-2 bg-white w-full'>
          <div className='flex gap-5 items-center'>
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
              <p className='col-span-3'>Order completion</p>
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
                        (profile?.orders?.filter((order) => order.status === OrderStatus.COMPLETE)?.length as number) /
                        Number(profile?.orders?.length)
                      }`}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
