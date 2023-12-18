/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import { getAllCategory, getAllLandingGigByUser, getProfile, updateProfile } from 'apis/api'
import GigCard from 'components/common/GigCard'
import ModalCustom from 'components/common/ModalCustom'
import { ICategory } from 'modules/category'
import { IGig } from 'modules/gig'
import { IUser } from 'modules/user'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineNavigateNext } from 'react-icons/md'
import { PiMagicWandDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { EffectCards, FreeMode, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getToken } from 'utils/auth'

function UserPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>()
  const [targets, setTargets] = useState<Array<string>>([])
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const { accessToken } = getToken()
  const navigate = useNavigate()
  const [latestGigs, setLatestGigs] = useState<Array<IGig>>()
  const [likeGigs, setLikeGigs] = useState<Array<IGig>>()
  const [popularGigs, setPopularGigs] = useState<Array<IGig>>()

  const pagination = {
    clickable: true,
    renderBullet(index: number, className: string) {
      return `<span class="${className}">${index + 1}</span>`
    }
  }

  const getUserProfile = useCallback(async () => {
    await getProfile(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.profile)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken])

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  const getAllLandingGigByUsers = useCallback(async () => {
    await getAllLandingGigByUser(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setLatestGigs(response.data.latestGigs)
          setLikeGigs(response.data.likeGigs)
          setPopularGigs(response.data.popularGigs)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      getAllLandingGigByUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllLandingGigByUsers])

  const getAllCategories = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'createdAt', 'asc', null, null, '', 1, undefined)
      .then((response) => {
        if (response.status === 200) {
          setCategories([...response.data.categories])
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [])

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  useEffect(() => {
    if (user) {
      const idTemp: any = []
      user.target.forEach((tar) => idTemp.push(tar._id))
      setTargets(idTemp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleUpdateTarget = async () => {
    const data: any = {}
    data.target = targets
    await updateProfile(data, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setOpenModal(false)
          setTargets([])
          getUserProfile()
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  const handleTarget = (id: string) => {
    if (targets.includes(id)) {
      const updatedTargets = targets.filter((targetId) => targetId !== id)
      setTargets(updatedTargets)
    } else if (targets.length < 10) {
      setTargets([...targets, id])
    }
  }

  return (
    <>
      <Helmet>
        <title>Freelancer Services Marketplace | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-8 py-10 px-28'>
        <div className='pt-2 text-3xl font-bold'>How's it going, {user?.name}?</div>
        {user?.target && user.target.length > 0 ? (
          <div className='flex flex-col justify-between w-full gap-6 p-8 border border-gray-300 rounded-lg'>
            <div className='flex justify-between w-full'>
              <h3 className='text-xl font-bold'>Here's what you need for your e‑commerce business</h3>
              <span onClick={() => setOpenModal(true)} className='text-lg font-semibold underline cursor-pointer'>
                Change
              </span>
            </div>
            <div>
              <Swiper
                slidesPerView={4}
                spaceBetween={20}
                freeMode
                pagination={{
                  clickable: true
                }}
                modules={[FreeMode]}
                className='mySwiper'
              >
                {user?.target &&
                  user.target.length > 0 &&
                  user.target.map((target, index) => (
                    <SwiperSlide key={target._id + index} className='rounded-lg'>
                      <div
                        onClick={() => navigate(`/sub-category/${target.slug}`)}
                        className='flex flex-row items-center w-full gap-4 p-4 truncate border border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-black'
                      >
                        <img
                          className='w-10 h-10 rounded-lg'
                          src={`${process.env.REACT_APP_URL_SERVER}/${target.image}`}
                          alt={target.name}
                        />
                        <span className='font-medium ext-lg '>{target.name}</span>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setOpenModal(true)}
            className='flex flex-row justify-between w-1/2 px-5 py-4 border border-gray-300 rounded-lg hover:cursor-pointer hover:shadow-lg'
          >
            <div className='flex flex-row gap-3'>
              <span className='flex items-center '>
                <PiMagicWandDuotone className='w-10 h-10 fill-green-500 ' />
              </span>
              <div className='flex flex-col '>
                <span className='text-lg font-semibold text-slate-600'>
                  Create a brief to get proposals from sellers
                </span>
                <span className='text-lg text-slate-600'>Let us do the searching. </span>
              </div>
            </div>
            <span className='flex items-center '>
              <MdOutlineNavigateNext className='w-8 h-8 fill-slate-500 ' />
            </span>
          </div>
        )}
        <div className='flex flex-row gap-2 text-2xl font-bold'>
          <span className='text-gray-800'>Most popular Gigs in </span>
          <span className='text-[#787de7]'>
            {popularGigs && popularGigs.length > 0 && popularGigs[0].category && popularGigs[0].category.name}
          </span>
        </div>
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
          {popularGigs &&
            popularGigs.length > 0 &&
            popularGigs.map((gig, index) => (
              <SwiperSlide key={gig._id + index} className='rounded-lg'>
                <GigCard user={user} type='popular' gig={gig} />
              </SwiperSlide>
            ))}
        </Swiper>
        {likeGigs && likeGigs.length > 0 && (
          <>
            <span className='text-2xl font-bold text-gray-800 '>Gigs you may like</span>
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
              {likeGigs &&
                likeGigs.length > 0 &&
                likeGigs.map((gig, index) => (
                  <SwiperSlide key={gig._id + index} className='rounded-lg'>
                    <GigCard user={user} type='like' gig={gig} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </>
        )}
        <span className='text-2xl font-bold text-gray-800 '>Gigs latest</span>
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
          {latestGigs &&
            latestGigs.length > 0 &&
            latestGigs.map((gig, index) => (
              <SwiperSlide key={gig._id + index} className='rounded-lg'>
                <GigCard user={user} type='latest' gig={gig} />
              </SwiperSlide>
            ))}
        </Swiper>
        <ModalCustom onCancel={() => {}} open={openModal} setOpen={setOpenModal}>
          <div className='p-3'>
            <span className='text-base font-semibold t-2'>You have selected {targets.length}/10 categories</span>
            <Swiper
              effect='cards'
              pagination={pagination}
              grabCursor
              modules={[EffectCards, Pagination]}
              className='mySwiper'
            >
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <SwiperSlide key={index}>
                    <div className='grid w-full h-full grid-cols-2 gap-2 p-5 bg-white'>
                      <h5 className='col-span-2 text-xl font-semibold text-center'>{category.name}</h5>
                      {category.subCategories.length > 0 &&
                        category.subCategories.map((subCategory, subIndex) => (
                          <Fragment key={subCategory._id + subIndex}>
                            {subCategory.subCategories.length > 0 &&
                              subCategory.subCategories.map((subSubCategory, subSubIndex) => (
                                <div
                                  onClick={() => handleTarget(subSubCategory._id)}
                                  key={subSubCategory._id + subSubIndex}
                                  className={`flex flex-row items-center w-full gap-4 p-4 border ${
                                    targets?.includes(subSubCategory._id) && 'bg-green-300'
                                  } border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-black h-[90px]`}
                                >
                                  <img
                                    className='w-10 h-10 rounded-lg'
                                    src={`${process.env.REACT_APP_URL_SERVER}/${subSubCategory.image}`}
                                    alt={subSubCategory.name}
                                  />
                                  <span className='text-lg font-medium'>{subSubCategory.name}</span>
                                </div>
                              ))}
                          </Fragment>
                        ))}
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
            <div className='flex flex-end'>
              <button
                type='submit'
                className='text-black inline-flex items-center bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                onClick={handleUpdateTarget}
              >
                <svg
                  aria-hidden='true'
                  className='w-5 h-5 mr-1 -ml-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                  <path
                    fillRule='evenodd'
                    d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                    clipRule='evenodd'
                  />
                </svg>
                Save
              </button>
            </div>
          </div>
        </ModalCustom>
      </div>
    </>
  )
}

export default UserPage
