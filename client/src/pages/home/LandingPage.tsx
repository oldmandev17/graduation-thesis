/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import { getAllCategory, updateProfile } from 'apis/api'
import ModalCustom from 'components/common/ModalCustom'
import { ICategory } from 'modules/category'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { AiOutlineStar } from 'react-icons/ai'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { MdOutlineNavigateNext } from 'react-icons/md'
import { PiMagicWandDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { EffectCards, FreeMode, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getToken } from 'utils/auth'
import GuessPage from './GuestPage'

function LandingPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { user } = useAppSelector((state) => state.auth)
  const [targets, setTargets] = useState<Array<string>>([])
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const { accessToken } = getToken()
  const navigate = useNavigate()

  const pagination = {
    clickable: true,
    renderBullet(index: number, className: string) {
      return `<span class="${className}">${index + 1}</span>`
    }
  }

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
          window.location.reload()
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

  return user ? (
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
                      className='flex flex-row items-center w-full gap-4 p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-black'
                    >
                      <img
                        className='w-10 h-10 rounded-lg'
                        src={`${process.env.REACT_APP_URL_SERVER}/${target.image}`}
                        alt={target.name}
                      />
                      <span className='text-lg font-medium'>{target.name}</span>
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
              <span className='text-lg font-semibold text-slate-600'>Create a brief to get proposals from sellers</span>
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
        <span className='text-[#787de7]'>Web Developer</span>
      </div>
      <div className='grid grid-cols-5 gap-10'>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />
            <div className='tooltip' data-tip='hello'>
              <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-pink-600 stroke-white top-3 right-3' />
            </div>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
      </div>
      <span className='text-2xl font-bold text-gray-800 '>Gigs you may like</span>
      <div className='grid grid-cols-5 gap-10'>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
            <span className='text-base font-bold text-yellow-500'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
      </div>
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
                                } border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-black`}
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
  ) : (
    <GuessPage />
  )
}

export default LandingPage
