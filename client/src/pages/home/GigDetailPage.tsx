/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react'
import { IoHomeOutline } from 'react-icons/io5'
import { FaStar, FaCheck, FaRegClock } from 'react-icons/fa'
import Fancybox from 'components/Fancybox'
import Carousel from 'components/Carousel'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { MdExpandMore } from 'react-icons/md'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { HiRefresh } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import { IGig } from 'modules/gig'
// import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import { getGigDetail } from 'apis/api'
import { toast } from 'react-toastify'
import { ICategory } from 'modules/category'
import { IReview } from 'modules/review'
import search from 'searchjs'

function GigDetailPage() {
  const [value, setValue] = React.useState(1)
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const [gig, setGig] = useState<IGig>()
  const [grandParentCategory, setGrandParentCategory] = useState<ICategory>()
  const { accessToken } = getToken()
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
  const [filteredReviews, setFilteredReviews] = useState<Array<IReview>>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  // const { user } = useAppSelector((state) => state.auth)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const getGigDetails = useCallback(async () => {
    await getGigDetail(slug, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
          setGrandParentCategory(response?.data?.grandParentCategory)
          setRatings(response?.data?.ratings.ratings)
          setTotalReviews(response?.data?.ratings.totalReviews)
          setAverageRating(response?.data?.ratings.averageRating)
          setPercentagePerStar(response?.data?.ratings.percentagePerStar)
          setFilteredReviews(response?.data?.gig.reviews)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, accessToken])

  useEffect(() => {
    if (slug) {
      getGigDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetails])

  useEffect(() => {
    if (gig && searchQuery) {
      const filterTemp = gig.reviews?.filter((review) => search.matchObject({ reviewText: review.re }))
    }
  }, [])

  return (
    <div className='grid grid-cols-5 gap-20 py-10 px-32'>
      <div className='flex gap-10 flex-col col-span-3'>
        <div id='path' className='flex flex-row gap-2 mb-3'>
          <IoHomeOutline className='h-5 w-5 cursor-pointer' onClick={() => navigate('/')} />
          <span className='text-sm text-gray-400 font-semibold'>/</span>
          <span className='text-base cursor-pointer' onClick={() => navigate(`/category/${grandParentCategory?.slug}`)}>
            {grandParentCategory?.name}
          </span>
          <span className='text-sm text-gray-400 font-semibold'>/</span>
          <span className='text-base cursor-pointer' onClick={() => navigate(`/category/${gig?.category?.slug}`)}>
            {gig?.category?.name}
          </span>
        </div>
        <div id='gig_title' className='text-2xl font-bold text-gray-700'>
          {gig?.name}
        </div>
        <div id='summary' className='flex flex-row gap-4 items-center'>
          <img src='/image/roses.jpg' alt='avata' className='h-14 w-14 rounded-full' />
          <div className='flex flex-col gap-1'>
            <div id='userInfor' className='flex flex-row gap-1'>
              <span className='text-base font-bold text-gray-700'>{gig?.createdBy?.name}</span>
              <span className='text-base font-semibold text-gray-400'>@{gig?.createdBy?.id}</span>
            </div>
            <span className='flex flex-row gap-1 items-center'>
              <FaStar className='h-4 w-4 fill-gray-900' />
              <span className='text-gray-900 text-base font-semibold'>{Math.ceil(averageRating)}</span>
              <span className='text-base text-gray-500 font-semibold  cursor-pointer'>({totalReviews})</span>
            </span>
          </div>
        </div>
        <div id='image'>
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
                    data-src={process.env.REACT_APP_URL_SERVER + image}
                    data-thumb-src={process.env.REACT_APP_URL_SERVER + image}
                  >
                    <img alt={gig?.name} src={process.env.REACT_APP_URL_SERVER + image} width='400' height='300' />
                  </div>
                ))}
            </Carousel>
          </Fancybox>
        </div>
        <div id='gig_about' className='flex flex-col gap-5'>
          <span className='text-2xl font-bold text-gray-700'>About this gig</span>
          <span className='text-base font-medium text-gray-600'>{gig?.description}</span>
        </div>
        <div id='gig_package_compare' className='flex flex-col gap-5'>
          <span className='text-2xl font-bold text-gray-700'>Compare packages</span>
          <table className=' border-slate-300 w-full max-w-3xl'>
            <thead>
              <tr className='bg-white border'>
                <th className=' text-gray-500 font-normal semibold p-5'>
                  <span className='text-base text-left'>Package</span>
                </th>
                {gig &&
                  gig.packages &&
                  gig?.packages?.length > 0 &&
                  gig?.packages?.map((pack, index) => (
                    <th key={index} className=' gap-2 border border-slate-300 text-gray-600  text-left p-5'>
                      <p className=' pt-1 text-xl font-normal'>{pack.price}$ </p>
                      <p className='pt-1 text-xl font-bold capitalize'>{pack.type}</p>
                      <p className='pt-1 text-sm font-semibold uppercase'>{pack.name}</p>
                      <p className='pt-1 text-sm font-normal'>{pack.description}</p>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {gig &&
                gig?.packages &&
                gig?.packages?.length > 0 &&
                gig?.packages[0]?.features &&
                gig?.packages[0]?.features?.length > 0 &&
                gig?.packages[0]?.features.map((feature, index) => (
                  <tr key={index}>
                    <td className='text-base text-left p-2 text-gray-500  border border-slate-300'>{feature.name}</td>
                    <td className=' border border-slate-300 p-5'>
                      <FaCheck className={`h-5 w-5 ${feature.status ? 'fill-black' : 'fill-gray-600'}`} />
                    </td>
                    <td className='p-5 border border-slate-300 '>
                      <FaCheck
                        className={`h-5 w-5 ${
                          gig &&
                          gig?.packages &&
                          gig?.packages?.length > 0 &&
                          gig?.packages[1]?.features &&
                          gig?.packages[1]?.features?.length > 0 &&
                          gig?.packages[1]?.features[index]?.status
                            ? 'fill-black'
                            : 'fill-gray-600'
                        }`}
                      />
                    </td>
                    <td className='p-5 border border-slate-300 '>
                      <FaCheck
                        className={`h-5 w-5 ${
                          gig &&
                          gig?.packages &&
                          gig?.packages?.length > 0 &&
                          gig?.packages[2]?.features &&
                          gig?.packages[2]?.features?.length > 0 &&
                          gig?.packages[2]?.features[index]?.status
                            ? 'fill-black'
                            : 'fill-gray-600'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              <tr>
                <td className='text-base text-left p-2 text-gray-500  border border-slate-300'> Revisions</td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.revisions !== 999
                    ? gig?.packages[0]?.revisions
                    : 'Unlimited'}
                </td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.revisions !== 999
                    ? gig?.packages[1]?.revisions
                    : 'Unlimited'}
                </td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.revisions !== 999
                    ? gig?.packages[2]?.revisions
                    : 'Unlimited'}
                </td>
              </tr>
              <tr className='text-gray-600'>
                <td className='text-base text-left text-gray-500 p-2 border border-slate-300'> Delivery Time</td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.deliveryTime} days
                </td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.deliveryTime} days
                </td>
                <td className='p-5 border border-slate-300'>
                  {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.deliveryTime} days
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className='text-gray-600 text-lg '>
                <td className=' border-slate-300 border border-b-0'> </td>
                <td className='p-5 border border-slate-300 border-b-0 '>
                  ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.price}
                </td>
                <td className='p-5 border border-slate-300  border-b-0'>
                  ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.price}
                </td>
                <td className='p-5 border border-slate-300 border-b-0'>
                  ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.price}
                </td>
              </tr>
              <tr className='text-gray-600 text-lg '>
                <td className='border border-slate-300 border-t-0 '> </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div id='gig_faq' className='flex flex-col'>
          <span className='text-2xl font-bold text-gray-700'>FAQ</span>
          {gig &&
            gig.FAQs &&
            gig?.FAQs?.length &&
            gig.FAQs.map((FAQ, index) => (
              <Accordion key={index} sx={{ boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<MdExpandMore className='w-7 h-7' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                  sx={{ padding: '0px' }}
                >
                  <Typography>{FAQ?.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{FAQ?.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          <hr />
        </div>
        <div id='gig_faq' className='flex flex-col'>
          <span className='text-2xl font-bold text-gray-700'>Reviews</span>
          <div className='flex items-center mb-2'>
            {[1, 2, 3, 4, 5].map((star, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${star <= averageRating ? 'text-yellow-300' : 'text-gray-300'} me-1`}
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
            ))}
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>{averageRating}</p>
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>out of</p>
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>5</p>
          </div>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{totalReviews} reviews for this Gig</p>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={index} className='flex items-center mt-2'>
              <span className='text-base font-medium  dark:text-blue-500 hover:underline'>{star} star</span>
              <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                <div className='h-3 bg-gray-500 rounded' style={{ width: `${percentagePerStar[star]}%` }} />
              </div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>({ratings[star]})</span>
            </div>
          ))}
        </div>
        <div className='relative w-1/2'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
          </div>
          <input
            type='search'
            id='default-search'
            className='block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search Mockups, Logos...'
          />
          <button
            type='submit'
            className='text-white absolute end-2.5 bottom-1 bg-gray-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Search
          </button>
        </div>
        <article>
          <div className='flex items-center mb-4'>
            <img className='w-10 h-10 me-4 rounded-full' src='/docs/images/people/profile-picture-5.jpg' alt='' />
            <div className='font-medium dark:text-white'>
              <p>
                Jese Leos{' '}
                <time dateTime='2014-08-16 19:00' className='block text-sm text-gray-500 dark:text-gray-400'>
                  Joined on August 2014
                </time>
              </p>
            </div>
          </div>
          <div className='flex items-center mb-1 space-x-1 rtl:space-x-reverse'>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-gray-300 dark:text-gray-500'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <h3 className='ms-2 text-sm font-semibold text-gray-900 dark:text-white'>Thinking to buy another one!</h3>
          </div>
          <footer className='mb-5 text-sm text-gray-500 dark:text-gray-400'>
            <p>
              Reviewed in the United Kingdom on <time dateTime='2017-03-03 19:00'>March 3, 2017</time>
            </p>
          </footer>
          <p className='mb-2 text-gray-500 dark:text-gray-400'>
            This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and
            the first thing I did was set the time, popped on an identical strap from another Invicta and went in the
            shower with it to test the waterproofing.... No problems.
          </p>
          <p className='text-gray-500 dark:text-gray-400'>
            It is obviously not the same build quality as those very expensive watches. But that is like comparing a
            Citroën to a Ferrari. This watch was well under £100! An absolute bargain.
          </p>
        </article>
        <hr />
      </div>

      <div className='col-span-2'>
        <Box className='border border-gray-300' sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={String(value)}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList className='bg-gray-50' onChange={handleChange} aria-label='lab API tabs example'>
                <Tab className='!font-bold' label='Basic' value='1' />
                <Tab className='!font-bold ' label='Standard' value='2' />
                <Tab className='!font-bold ' label='Premium' value='3' />
              </TabList>
            </Box>
            {gig &&
              gig.packages &&
              gig?.packages?.length > 0 &&
              gig?.packages?.map((pack, index) => (
                <TabPanel key={index} className='flex flex-col gap-2' value={String(index + 1)}>
                  <div className='flex flex-row justify-between w-full'>
                    <span className='font-bold text-gray-600 uppercase'>{pack.name}</span>
                    <span className='font-bold text-2xl text-gray-600'>${pack.price}</span>
                  </div>
                  <p className='text-gray-600'>{pack.description}</p>
                  <div className='flex flex-row gap-3'>
                    <div className='flex flex-row gap-2  items-center text-gray-600'>
                      <FaRegClock />
                      <span className='font-medium'>{pack.deliveryTime} Days Delivery</span>
                    </div>
                    <div className='flex flex-row gap-2  items-center text-gray-600'>
                      <HiRefresh className='h-5 w-5' />
                      <span className='font-medium'>
                        {pack.revisions !== 999 ? pack.revisions : 'Unlimited'} Revisions
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col '>
                    {pack.features &&
                      pack.features?.length > 0 &&
                      pack?.features?.map((feature, index) => (
                        <div key={index} className='flex flex-row gap-2 items-center'>
                          <FaCheck className={`h-4 w-4 ${feature.status ? 'fill-black' : 'fill-gray-600'}`} />
                          <span className='text-gray-600'>{feature.name}</span>
                        </div>
                      ))}
                  </div>
                </TabPanel>
              ))}
          </TabContext>
        </Box>
      </div>
    </div>
  )
}

export default GigDetailPage
