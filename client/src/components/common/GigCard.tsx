/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { addOrRemoveWishlist } from 'apis/api'
import { useMessage } from 'contexts/StateContext'
import { IGig } from 'modules/gig'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineStar } from 'react-icons/ai'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { EffectFade, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getToken } from 'utils/auth'

function GigCard({ gig, type, height }: { gig: IGig; type: string; height: number }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessToken } = getToken()
  const { user } = useAppSelector((state) => state.auth)
  const { wishlist, handleAddWishlist, handleRemoveWishlist } = useMessage()
  const [hover, setHover] = useState<boolean>(false)
  const totalRating = gig?.reviews.reduce((sum, review) => sum + review.rating, 0)
  const avgRating = totalRating / gig.reviews.length || 0

  const handleWishlist = async () => {
    if (!user) {
      navigate('/auth/login')
      localStorage.setItem('redirect', String(location.pathname))
    } else {
      await addOrRemoveWishlist(accessToken, gig._id)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.type === 'remove') {
              handleRemoveWishlist(gig)
            } else {
              handleAddWishlist(gig)
            }
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  useEffect(() => {
    const cardEl = document.getElementById(`gig-${type}-${gig?._id}`)
    if (cardEl) {
      const btnPrev = cardEl.querySelector('.swiper-button-prev')
      const btnNext = cardEl.querySelector('.swiper-button-next')
      btnPrev?.classList.add('!opacity-0', '!translate-x-[-20px]', '!transition-all', '!duration-300', '!ease-in')
      btnNext?.classList.add('!opacity-0', '!-translate-x-[-20px]', '!transition-all', '!duration-300', '!ease-in')
      if (hover) {
        btnPrev?.classList.remove('!opacity-0', '!translate-x-[-20px]')
        btnNext?.classList.remove('!opacity-0', '!-translate-x-[-20px]')
      } else {
        btnPrev?.classList.add('!opacity-0', '!translate-x-[-20px]')
        btnNext?.classList.add('!opacity-0', '!-translate-x-[-20px]')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover])

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className='flex flex-col w-full gap-2 cursor-pointer'
      id={`gig-${type}-${gig?._id}`}
    >
      <div className='relative'>
        <Swiper
          style={
            {
              '--swiper-navigation-size': '15px'
            } as CSSProperties
          }
          spaceBetween={30}
          effect='fade'
          navigation
          pagination={{
            clickable: true
          }}
          modules={[EffectFade, Navigation]}
          className={`h-[${height}px] mySwiper`}
        >
          {gig &&
            gig.images &&
            gig.images.length > 0 &&
            gig.images.map((image, ind) => (
              <SwiperSlide key={image + ind}>
                <div className='flex justify-center w-full bg-gray-100 rounded-lg'>
                  <img
                    src={`${process.env.REACT_APP_URL_SERVER}/${image}`}
                    alt={gig?.name}
                    className={`object-contain w-full rounded-lg h-[${height}px]`}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <BsFillSuitHeartFill
          onClick={handleWishlist}
          className={`absolute z-20 w-6 h-6 cursor-pointer stroke-1 ${
            wishlist.filter((wish) => wish._id === gig._id).length > 0 ? 'fill-pink-600' : 'fill-gray-600'
          } stroke-white top-3 right-3 cursor-pointer`}
        />
      </div>
      <div className='flex flex-row items-center gap-2'>
        {gig?.createdBy?.avatar ? (
          <img
            src={
              gig?.createdBy?.avatar.startsWith('upload')
                ? `${process.env.REACT_APP_URL_SERVER}/${gig?.createdBy?.avatar}`
                : gig?.createdBy?.avatar
            }
            alt='avata'
            className='rounded-full h-9 w-9'
          />
        ) : (
          <div className='relative flex items-center justify-center bg-purple-500 rounded-full h-9 w-9'>
            <span className='text-2xl text-white'>{gig && gig?.createdBy?.email[0].toUpperCase()}</span>
          </div>
        )}
        <button type='button' className='text-base font-bold hover:underline'>
          {gig?.createdBy?.name}
        </button>
      </div>
      <div className='flex flex-col gap-1'>
        <span
          onClick={() => navigate(`/gig-detail/${gig?.slug}`)}
          className='text-lg font-semibold text-gray-600 truncate cursor-pointer hover:underline'
        >
          {gig?.name}
        </span>
        <div className='flex flex-row gap-1'>
          <AiOutlineStar className='w-6 h-6 fill-yellow-500' />
          <span className='text-lg font-bold text-yellow-500'>{avgRating.toFixed(1)}</span>
          <span className='text-lg font-semibold text-gray-600'>({gig && gig.reviews && gig.reviews.length})</span>
        </div>
        <span className='text-lg font-bold text-black'>
          From ${gig && gig.packages && gig.packages.length > 0 && gig.packages[0].price}
        </span>
      </div>
    </div>
  )
}

export default GigCard
