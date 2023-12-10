/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import { arrCategory } from 'assets/data'
import { getAllCategory } from 'apis/api'
import { arrCategory, everythingData, popularServicesData } from 'assets/data'
import { ICategory } from 'modules/category'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

function GuestPage() {
  const [keyword, setKeyword] = useState<string>('')
  const [image, setImage] = useState<number>(1)
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [categoriesLevel3, setCategoriesLevel3] = useState<Array<ICategory>>([])
  const navigate = useNavigate()

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  const handleSearchKeyword = (event: any) => {
    event.preventDefault()
    if (keyword) {
      navigate(`/search?keyword=${keyword.trim()}`)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setImage(image >= 6 ? 1 : image + 1)
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [image])

  const getAllCategories = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'createdAt', 'asc', null, null, '', 1, undefined)
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data.categories)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [])

  const getAllCategoriesLevel3 = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'createdAt', 'asc', null, null, '', 3, undefined)
      .then((response) => {
        if (response.status === 200) {
          setCategoriesLevel3(response.data.categories)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [])

  useEffect(() => {
    getAllCategories()
    getAllCategoriesLevel3()
  }, [getAllCategories, getAllCategoriesLevel3])

  return (
    <div className='relative flex flex-col justify-between'>
      <div className='h-[680px] relative bg-cover'>
        <div className='absolute top-0 right-0 w-[110vw] h-full transition-opacity z-0'>
          <img
            alt='hero'
            src='/banners/bg-hero1.webp'
            className={`${image === 1 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
          <img
            alt='hero'
            src='/banners/bg-hero2.webp'
            className={`${image === 2 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
          <img
            alt='hero'
            src='/banners/bg-hero3.webp'
            className={`${image === 3 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
          <img
            alt='hero'
            src='/banners/bg-hero4.webp'
            className={`${image === 4 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
          <img
            alt='hero'
            src='/banners/bg-hero5.webp'
            className={`${image === 5 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
          <img
            alt='hero'
            src='/banners/bg-hero6.webp'
            className={`${image === 6 ? 'block' : 'hidden'} transition-all duration-1000 w-full`}
          />
        </div>
        <div className='z-10 relative w-[650px] flex justify-center gap-5 flex-col h-full ml-28'>
          <h1 className='text-5xl leading-snug text-white'>
            Find the perfect &nbsp; <i>Freelance</i> <br /> services for your business.
          </h1>
          <form onSubmit={handleSearchKeyword} className='flex align-middle'>
            <div className='relative'>
              <input
                onChange={handleChangeKeyword}
                type='text'
                className='h-14 w-[450px] pl-10 rounded-md rounded-r-none'
                placeholder={`Try "building mobile app"`}
              />
            </div>
            <button type='submit' className='bg-[#10BF73] text-white px-12 text-lg font-semibold rounded-r-md'>
              Search
            </button>
          </form>
          <div className='flex gap-4 text-white'>
            Popular:{' '}
            <ul className='flex gap-5'>
              {categoriesLevel3.length > 0 &&
                categoriesLevel3.slice(0, 4).map((category, index) => (
                  <li key={category._id + index}>
                    <button
                      onClick={() => navigate(`/sub-category/${category.slug}`)}
                      className='px-3 py-1 text-sm transition-all duration-300 border rounded-full cursor-pointer hover:bg-white hover:text-black'
                      type='button'
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center mt-16 text-2xl font-bold text-gray-400'>
        Trusted by: &nbsp;
        <ul className='flex items-center justify-center gap-10 ml-10'>
          {[1, 2, 3, 4, 5].map((num) => (
            <li key={num} className='relative h-[4.5rem] w-[4.5rem] flex items-center justify-center'>
              <img alt='trusted brands' src={`/banners/trusted${num}.png`} />
            </li>
          ))}
        </ul>
      </div>
      <div className='my-16 mx-28'>
        <h2 className='text-4xl mb-10 text-[#404145] font-bold '>Popular Services</h2>
        <ul className='flex flex-wrap justify-center gap-16'>
          <Swiper
            slidesPerView={5}
            spaceBetween={30}
            freeMode
            pagination={{
              clickable: true
            }}
            modules={[FreeMode]}
            className='mySwiper'
          >
            {popularServicesData.map((service, index) => (
              <SwiperSlide key={service.label + index} className='rounded-lg'>
                <li className='relative cursor-pointer'>
                  <div className='absolute z-10 text-white left-5 top-4'>
                    <span>{service.label}</span>
                    <h6 className='text-2xl font-extrabold'>{service.name}</h6>
                  </div>
                  <div className='h-auto'>
                    <img
                      alt='service'
                      onClick={() => navigate(`/sub-category/${service.slug}`)}
                      src={service.image}
                      className='w-full'
                    />
                  </div>
                </li>
              </SwiperSlide>
            ))}
          </Swiper>
        </ul>
      </div>
      <div className='bg-[#f1f5f7] flex py-20 justify-between px-28'>
        <div>
          <h2 className='text-4xl mb-5 text-[#424145] font-bold'>The best part? Everything.</h2>
          <ul className='flex flex-col gap-10'>
            {everythingData.map(({ title, subTitle }) => (
              <li key={title}>
                <div className='flex items-center gap-2 text-xl'>
                  <BsCheckCircle />
                  <h4>{title}</h4>
                </div>
                <p className='text-[#62646a]'>{subTitle}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='relative w-2/4 h-96'>
          <img alt='everything' src='/banners/everything.webp' />
        </div>
      </div>
      <div className='py-16 mx-28'>
        <h2 className='text-4xl mb-10 text-[#404145] font-bold'>You need it, we&apos;re got it</h2>
        <ul className='grid grid-cols-5 gap-10'>
          {categories.map((category, index) => (
            <li
              key={category._id + index}
              className='flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl hover:border-[#1DBF73] border-2 border-transparent p-5 transition-all duration-500'
              onClick={() => navigate(`/category/${category.slug}`)}
            >
              <img src={arrCategory[index]} alt='category' height={50} width={50} />
              <span>{category.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GuestPage
