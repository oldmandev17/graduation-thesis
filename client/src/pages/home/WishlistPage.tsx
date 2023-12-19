/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
import { getProfile } from 'apis/api'
import GigCard from 'components/common/GigCard'
import { IGig } from 'modules/gig'
import { IUser } from 'modules/user'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getToken } from 'utils/auth'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

function WishlistPage() {
  const [all, setAll] = useState<boolean>(false)
  const { accessToken } = getToken()
  const [user, setUser] = useState<IUser>()
  const [relatedGigs, setRelatedGigs] = useState<Array<IGig>>([])

  const getUserProfile = useCallback(async () => {
    await getProfile(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.profile)
          setRelatedGigs(response.data.relatedGigs)
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
        <title>My Lists | Freelancer</title>
      </Helmet>
      <div className='flex flex-col h-screen gap-5 py-10 px-28'>
        <div className='flex flex-row justify-between'>
          <span className='text-4xl font-semibold text-gray-600'>My Lists</span>
        </div>
        <p className='text-lg font-semibold text-gray-600'>
          Organize your go-to freelancers and favorite services into custom lists you can easily access and share with
          your team.
        </p>
        <div>
          <div className='grid grid-cols-4 gap-10'>
            {user &&
              user.wishlist.length > 0 &&
              user.wishlist
                .slice(0, all ? user && user.wishlist.length - 1 : 3)
                .map((gig, index) => <GigCard height={200} key={gig?._id + index} gig={gig} type='wishlist' />)}
          </div>
          {user && user.wishlist.length > 4 && !all && (
            <button onClick={() => setAll(true)} className='border border-black rounded-lg p-2' type='button'>
              View All ({user && user.wishlist.length})
            </button>
          )}
        </div>
        {relatedGigs && relatedGigs.length > 0 && (
          <>
            <span className='text-2xl font-bold text-gray-800 '>Because you saved it</span>
            <Swiper
              slidesPerView={5}
              spaceBetween={20}
              freeMode
              pagination={{
                clickable: true
              }}
              modules={[FreeMode]}
              className='w-full mySwiper'
            >
              {relatedGigs &&
                relatedGigs.length > 0 &&
                relatedGigs.map((gig, index) => (
                  <SwiperSlide key={gig._id + index} className='rounded-lg'>
                    <GigCard height={160} type='like' gig={gig} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </>
        )}
      </div>
    </>
  )
}

export default WishlistPage
