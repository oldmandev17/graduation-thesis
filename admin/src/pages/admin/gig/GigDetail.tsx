/* eslint-disable react/no-array-index-key */
import { getGigDetailById } from 'apis/api'
import Carousel from 'components/common/Carousel'
import Fancybox from 'components/common/Fancybox'
import { ICategory } from 'modules/category'
import { GigPackageType, IGig } from 'modules/gig'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'

function GigDetail() {
  const { id } = useParams<{ id?: string }>()
  const [gig, setGig] = useState<IGig>()
  const [grandParentCategory, setGrandParentCategory] = useState<ICategory>()
  const [ratings, setRatings] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [percentagePerStar, setPercentagePerStar] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  })
  const { accessToken } = getToken()

  const getGigDetails = useCallback(async () => {
    await getGigDetailById(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
          setGrandParentCategory(response?.data?.grandParentCategory)
          setRatings(response?.data?.ratings.ratings)
          setTotalReviews(response?.data?.ratings.totalReviews)
          setAverageRating(response?.data?.ratings.averageRating)
          setPercentagePerStar(response?.data?.ratings.percentagePerStar)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (id) {
      getGigDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetails])

  return (
    <div className='grid grid-cols-5 gap-10'>
      <div className='flex flex-col col-span-3 gap-8'>
        <nav
          className='flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
          aria-label='Breadcrumb'
        >
          <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
            <li className='inline-flex items-center'>
              <span className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'>
                <svg
                  className='w-3 h-3 me-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
                </svg>
                Home
              </span>
            </li>
            <li>
              <div className='flex items-center'>
                <svg
                  className='block w-3 h-3 mx-1 text-gray-400 rtl:rotate-180 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <span className='text-sm font-medium text-gray-700 ms-1 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'>
                  {grandParentCategory?.name}
                </span>
              </div>
            </li>
            <li aria-current='page'>
              <div className='flex items-center'>
                <svg
                  className='w-3 h-3 mx-1 text-gray-400 rtl:rotate-180'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <span className='text-sm font-medium text-gray-500 ms-1 md:ms-2 dark:text-gray-400'>
                  {gig?.category?.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-semibold dark:text-white'>{gig?.name}</h2>
          <div className='flex items-center gap-5 mb-4'>
            {gig?.createdBy?.avatar ? (
              <img
                className='w-16 h-16 rounded-full me-4'
                src={`${process.env.REACT_APP_URL_SERVER}/${gig?.createdBy?.avatar}`}
                alt='avatar'
              />
            ) : (
              <div className='relative flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full'>
                <span className='text-2xl text-white'>{gig && gig?.createdBy?.email[0].toUpperCase()}</span>
              </div>
            )}
            <div className='font-medium dark:text-white'>
              <div className='flex items-center gap-5'>
                <span>{gig?.createdBy?.name}</span>|
                <span className='text-sm text-gray-500 dark:text-gray-400'>@{gig?.createdBy?.id}</span>
              </div>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-300 dark:text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 20'
                >
                  <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                </svg>
                <span>{Math.ceil(averageRating)}</span>
                <span className='text-gray-500 underline text-md dark:text-gray-400'>({totalReviews})</span>
              </div>
            </div>
          </div>
          <div>
            <Fancybox
              options={{
                Carousel: {
                  infinite: false
                }
              }}
            >
              <Carousel options={{ infinite: false }}>
                {gig &&
                  gig.images &&
                  gig.images.length > 0 &&
                  gig.images.map((image, index) => (
                    <div
                      key={index}
                      className='f-carousel__slide'
                      data-fancybox='gallery'
                      data-src={`${process.env.REACT_APP_URL_SERVER}/${image}`}
                      data-thumb-src={`${process.env.REACT_APP_URL_SERVER}/${image}`}
                    >
                      <img
                        alt={gig?.name}
                        src={`${process.env.REACT_APP_URL_SERVER}/${image}`}
                        className='!h-[500px] !w-auto'
                      />
                    </div>
                  ))}
              </Carousel>
            </Fancybox>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='text-gray-500 dark:text-gray-400'>{gig?.description}</p>
        </div>
        <div id='detailed-pricing' className='w-full overflow-x-auto'>
          <div className='overflow-hidden min-w-max'>
            <div className='grid grid-cols-4 p-4 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200 gap-x-16 dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <div className='flex items-center'>Package</div>
              <div>{GigPackageType.BASIC}</div>
              <div>{GigPackageType.STANDARD}</div>
              <div>{GigPackageType.PREMIUM}</div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>Name</div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>
                Application UI (
                <a href='/#' className='text-blue-600 hover:underline'>
                  view demo
                </a>
                )
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>Marketing UI pre-order</div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>E-commerce UI pre-order</div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
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
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400' />
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>faq</div>
        <div className='flex flex-col gap-4'>
          <div>
            <div className='flex items-center mb-2'>
              <svg
                className='w-4 h-4 text-yellow-300 me-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 me-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 me-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 me-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-gray-300 me-1 dark:text-gray-500'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>4.95</p>
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>out of</p>
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>5</p>
            </div>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>1,745 global ratings</p>
            <div className='flex items-center mt-4'>
              <a href='/#' className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                5 star
              </a>
              <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-5 bg-yellow-300 rounded' style={{ width: '70%' }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>70%</span>
            </div>
            <div className='flex items-center mt-4'>
              <a href='/#' className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                4 star
              </a>
              <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-5 bg-yellow-300 rounded' style={{ width: '17%' }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>17%</span>
            </div>
            <div className='flex items-center mt-4'>
              <a href='/#' className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                3 star
              </a>
              <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-5 bg-yellow-300 rounded' style={{ width: '8%' }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>8%</span>
            </div>
            <div className='flex items-center mt-4'>
              <a href='/#' className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                2 star
              </a>
              <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-5 bg-yellow-300 rounded' style={{ width: '4%' }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>4%</span>
            </div>
            <div className='flex items-center mt-4'>
              <a href='/#' className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                1 star
              </a>
              <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-5 bg-yellow-300 rounded' style={{ width: '1%' }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>1%</span>
            </div>
          </div>
          <hr className='mx-20 my-5' />
          <ol className='relative border-gray-200 border-s dark:border-gray-700'>
            <li className='mb-10 ms-6'>
              <span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
                <img
                  className='rounded-full shadow-lg'
                  src='/docs/images/people/profile-picture-3.jpg'
                  alt='Bonniecd'
                />
              </span>
              <div className='items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600'>
                <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>just now</time>
                <div className='text-sm font-normal text-gray-500 dark:text-gray-300'>
                  Bonnie moved{' '}
                  <a href='/#' className='font-semibold text-blue-600 dark:text-blue-500 hover:underline'>
                    Jese Leos
                  </a>{' '}
                  to{' '}
                  <span className='bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300'>
                    Funny Group
                  </span>
                </div>
              </div>
            </li>
            <li className='mb-10 ms-6'>
              <span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
                <img
                  className='rounded-full shadow-lg'
                  src='/docs/images/people/profile-picture-5.jpg'
                  alt='Thomas Lean'
                />
              </span>
              <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
                <div className='items-center justify-between mb-3 sm:flex'>
                  <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>2 hours ago</time>
                  <div className='text-sm font-normal text-gray-500 lex dark:text-gray-300'>
                    Thomas Lean commented on{' '}
                    <a href='/#' className='font-semibold text-gray-900 dark:text-white hover:underline'>
                      Flowbite Pro
                    </a>
                  </div>
                </div>
                <div className='p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'>
                  Hi ya'll! I wanted to share a webinar zeroheight is having regarding how to best measure your design
                  system! This is the second session of our new webinar series on #DesignSystems discussions where we'll
                  be speaking about Measurement.
                </div>
              </div>
            </li>
            <li className='ms-6'>
              <span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
                <img
                  className='rounded-full shadow-lg'
                  src='/docs/images/people/profile-picture-1.jpg'
                  alt='Jese Leos'
                />
              </span>
              <div className='items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600'>
                <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>1 day ago</time>
                <div className='text-sm font-normal text-gray-500 lex dark:text-gray-300'>
                  Jese Leos has changed{' '}
                  <a href='/#' className='font-semibold text-blue-600 dark:text-blue-500 hover:underline'>
                    Pricing page
                  </a>{' '}
                  task status to <span className='font-semibold text-gray-900 dark:text-white'>Finished</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div className='col-span-2'>1</div>
    </div>
  )
}

export default GigDetail
