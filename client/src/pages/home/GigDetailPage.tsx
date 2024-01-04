/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Carousel from 'components/common/Carousel'
import Fancybox from 'components/common/Fancybox'
import { IGig } from 'modules/gig'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { FaCheck, FaRegClock, FaStar } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { IoHomeOutline } from 'react-icons/io5'
import { MdExpandMore } from 'react-icons/md'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
// import { useAppSelector } from 'stores/hooks'
import { Rating } from '@mui/material'
import { createReview, getGigDetailById, getGigDetailBySlug } from 'apis/api'
import OrderButton from 'components/common/OrderButton'
import { ICategory } from 'modules/category'
import { IOrder } from 'modules/order'
import { IReview } from 'modules/review'
import { Helmet } from 'react-helmet-async'
import { AiOutlineSearch } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import calculateTime from 'utils/calculateTime'

function GigDetailPage() {
  const location = useLocation()
  const [value, setValue] = useState(1)
  const navigate = useNavigate()
  const { slug, id } = useParams<{ slug?: string; id?: string }>()
  const [gig, setGig] = useState<IGig>()
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const { accessToken } = getToken()
  const [rating, setRating] = useState<number | null>(0)
  const [reviewText, setReviewText] = useState<string>()
  const ref = useRef<HTMLDivElement | null>(null)
  const [grandParentCategory, setGrandParentCategory] = useState<ICategory>()
  const [page, setPage] = useState<number>(1)
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
  const { user } = useAppSelector((state) => state.auth)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleContactMe = () => {
    if (!user) {
      navigate('/auth/login')
      localStorage.setItem('redirect', String(location.pathname))
    } else {
      navigate(`/user/${user?.id}/messages?to=${gig && gig?.createdBy?.id}`)
    }
  }

  const getGigDetails = useCallback(async () => {
    await getGigDetailBySlug(slug)
      .then((response) => {
        if (response.status === 200) {
          setGrandParentCategory(response.data.grandParentCategory)
          setGig(response.data.gig)
          setOrders(response.data.orders)
          setRatings(response.data.ratings.ratings)
          setTotalReviews(response.data.ratings.totalReviews)
          setAverageRating(response.data.ratings.averageRating)
          setPercentagePerStar(response.data.ratings.percentagePerStar)
          setFilteredReviews(response.data.gig.reviews)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const getGigDetailsById = useCallback(async () => {
    await getGigDetailById(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGrandParentCategory(response.data.grandParentCategory)
          setGig(response.data.gig)
          setRatings(response.data.ratings.ratings)
          setTotalReviews(response.data.ratings.totalReviews)
          setAverageRating(response.data.ratings.averageRating)
          setPercentagePerStar(response.data.ratings.percentagePerStar)
          setFilteredReviews(response.data.gig.reviews)
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          navigate('/auth/un-authorize')
        } else {
          toast.error(error.response.data.error.message)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  useEffect(() => {
    if (id && accessToken) {
      getGigDetailsById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetailsById])

  useEffect(() => {
    if (slug) {
      getGigDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetails])

  const handleSearchReview = () => {
    if (gig) {
      const filterTemp = gig.reviews?.filter(
        (review) => review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredReviews(filterTemp || [])
    }
  }

  const handleCreateReview = async () => {
    if (rating === 0 || rating === null) {
      toast.warning('Please select the number rating.')
    } else if (!reviewText) {
      toast.warning('Please type the message review.')
    } else if (gig?._id) {
      const data: any = {}
      data.rating = rating
      data.reviewText = reviewText
      await createReview(gig._id, data, accessToken)
        .then((response) => {
          if (response.status === 201) {
            toast.success('Create review successfull.')
            getGigDetails()
            setRating(0)
            setReviewText('')
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  return (
    <>
      <Helmet>
        <title className='capitalize'>{`${gig ? `${gig?.name} by ${gig?.createdBy?.id}` : ''} `} | Freelancer</title>
      </Helmet>
      <div className='grid grid-cols-5 gap-32 py-10 px-28'>
        <div className='flex flex-col col-span-3 gap-10'>
          <div id='path' className='flex flex-row gap-2'>
            <IoHomeOutline className='w-5 h-5 cursor-pointer' onClick={() => navigate('/')} />
            <span className='text-sm font-semibold text-gray-400'>/</span>
            <span
              className='text-base cursor-pointer'
              onClick={() => navigate(`/category/${grandParentCategory?.slug}`)}
            >
              {grandParentCategory && grandParentCategory.name}
            </span>
            <span className='text-sm font-semibold text-gray-400'>/</span>
            <span className='text-base cursor-pointer' onClick={() => navigate(`/sub-category/${gig?.category?.slug}`)}>
              {gig?.category?.name}
            </span>
          </div>
          <div id='gig_title' className='text-2xl font-bold text-gray-700'>
            {gig?.name}
          </div>
          <div id='summary' className='flex flex-row items-center gap-4'>
            {gig?.createdBy?.avatar ? (
              <img
                src={
                  gig?.createdBy?.avatar.startsWith('upload')
                    ? `${process.env.REACT_APP_URL_SERVER}/${gig?.createdBy?.avatar}`
                    : gig?.createdBy?.avatar
                }
                alt='avata'
                className='rounded-full h-14 w-14'
              />
            ) : (
              <div className='relative flex items-center justify-center bg-purple-500 rounded-full h-14 w-14'>
                <span className='text-2xl text-white'>{gig && gig?.createdBy?.email[0].toUpperCase()}</span>
              </div>
            )}
            <div className='flex flex-col gap-1'>
              <div id='userInfor' className='flex flex-row gap-1'>
                <Link
                  to={`/user-detail/${gig?.createdBy?.id}`}
                  target='_blank'
                  className='text-base font-bold text-gray-700 hover:underline'
                >
                  {gig?.createdBy?.name}
                </Link>
                <span className='text-base font-semibold text-gray-400'>@{gig?.createdBy?.id}</span>
              </div>
              <span className='flex flex-row items-center gap-1'>
                <FaStar className='w-4 h-4 fill-gray-900' />
                <span className='text-base font-semibold text-gray-900'>{Math.ceil(averageRating).toFixed(1)}</span>
                <span className='text-base font-semibold text-gray-500 cursor-pointer'>({totalReviews})</span>
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
          <div id='gig_about' className='flex flex-col gap-5'>
            <span className='text-2xl font-bold text-gray-700'>About this gig</span>
            <span className='text-base font-medium text-gray-600'>{gig?.description}</span>
          </div>
          <div id='gig_package_compare' ref={ref} className='flex flex-col gap-5'>
            <span className='text-2xl font-bold text-gray-700'>Compare packages</span>
            <table className='w-full border-slate-300'>
              <thead>
                <tr className='bg-white border'>
                  <th className='w-1/4 p-5 font-normal text-gray-500 semibold'>
                    <span className='text-base text-left'>Package</span>
                  </th>
                  {gig &&
                    gig.packages &&
                    gig?.packages?.length > 0 &&
                    gig?.packages?.map((pack, index) => (
                      <th key={index} className='w-1/4 gap-2 p-5 text-left text-gray-600 border border-slate-300'>
                        <p className='pt-1 text-xl font-normal '>${pack.price}</p>
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
                    <tr key={index} className={`${index % 2 === 0 && 'bg-gray-50'}`}>
                      <td className='p-2 text-base text-left text-gray-500 border border-slate-300'>{feature.name}</td>
                      <td className='p-5 text-center border border-slate-300'>
                        <FaCheck className={`mx-auto h-5 w-5 ${feature.status ? 'fill-black' : 'fill-gray-300'}`} />
                      </td>
                      <td className='p-5 text-center border border-slate-300'>
                        <FaCheck
                          className={`mx-auto h-5 w-5 ${
                            gig &&
                            gig?.packages &&
                            gig?.packages?.length > 0 &&
                            gig?.packages[1]?.features &&
                            gig?.packages[1]?.features?.length > 0 &&
                            gig?.packages[1]?.features[index]?.status
                              ? 'fill-black'
                              : 'fill-gray-300'
                          }`}
                        />
                      </td>
                      <td className='p-5 text-center border border-slate-300'>
                        <FaCheck
                          className={`mx-auto h-5 w-5 ${
                            gig &&
                            gig?.packages &&
                            gig?.packages?.length > 0 &&
                            gig?.packages[2]?.features &&
                            gig?.packages[2]?.features?.length > 0 &&
                            gig?.packages[2]?.features[index]?.status
                              ? 'fill-black'
                              : 'fill-gray-300'
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                <tr
                  className={`${
                    gig &&
                    gig.packages &&
                    gig.packages.length > 0 &&
                    gig.packages[2].features &&
                    gig.packages[2].features.length % 2 === 0 &&
                    'bg-gray-50'
                  } text-gray-600`}
                >
                  <td className='p-2 text-base text-left text-gray-500 border border-slate-300'> Revisions</td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.revisions !== 999
                      ? gig?.packages[0]?.revisions
                      : 'Unlimited'}
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.revisions !== 999
                      ? gig?.packages[1]?.revisions
                      : 'Unlimited'}
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.revisions !== 999
                      ? gig?.packages[2]?.revisions
                      : 'Unlimited'}
                  </td>
                </tr>
                <tr
                  className={`${
                    gig &&
                    gig.packages &&
                    gig.packages.length > 0 &&
                    gig.packages[2].features &&
                    gig.packages[2].features.length % 2 === 1 &&
                    'bg-gray-50'
                  } text-gray-600`}
                >
                  <td className='p-2 text-base text-left text-gray-500 border border-slate-300'> Delivery Time</td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.deliveryTime} days
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.deliveryTime} days
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    {gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.deliveryTime} days
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr
                  className={`${
                    gig &&
                    gig.packages &&
                    gig.packages.length > 0 &&
                    gig.packages[2].features &&
                    gig.packages[2].features.length % 2 === 0 &&
                    'bg-gray-50'
                  } text-gray-600 text-xl font-bold`}
                >
                  <td className='border border-slate-300'> </td>
                  <td className='p-5 text-center border border-slate-300'>
                    <span className='inline-block w-full'>
                      ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[0]?.price}
                    </span>
                    <OrderButton pack={gig && gig.packages && gig.packages[0]} gig={gig} type='select' />
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    <span className='inline-block w-full'>
                      ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[1]?.price}
                    </span>
                    <OrderButton pack={gig && gig.packages && gig.packages[1]} gig={gig} type='select' />
                  </td>
                  <td className='p-5 text-center border border-slate-300'>
                    <span className='inline-block w-full'>
                      ${gig && gig?.packages && gig?.packages?.length > 0 && gig?.packages[2]?.price}
                    </span>
                    <OrderButton pack={gig && gig.packages && gig.packages[2]} gig={gig} type='select' />
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
              <p className='text-sm font-medium text-gray-500 ms-1 '>{averageRating.toFixed(1)}</p>
              <p className='text-sm font-medium text-gray-500 ms-1 '>out of</p>
              <p className='text-sm font-medium text-gray-500 ms-1 '>5</p>
            </div>
            <p className='text-sm font-medium text-gray-500 '>{totalReviews} reviews for this Gig</p>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={index} className='flex items-center mt-2'>
                <span className='text-base font-medium hover:underline'>{star} stars</span>
                <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded '>
                  <div className='h-3 bg-gray-500 rounded' style={{ width: `${percentagePerStar[star]}%` }} />
                </div>
                <span className='text-sm font-medium text-gray-500 '>({ratings[star]})</span>
              </div>
            ))}
          </div>
          <div className='relative w-1/2'>
            <div className='flex flex-row w-full'>
              <input
                type='text'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                className='w-full h-12 py-0 pl-5 text-lg text-gray-900 border border-gray-300 rounded-lg rounded-r-none border-1 focus:rounded-none'
                placeholder='Search review'
              />
              <button
                type='button'
                className='flex flex-col justify-center w-16 pl-5 bg-black rounded-l-none rounded-r-lg cursor-pointer '
                onClick={handleSearchReview}
              >
                <AiOutlineSearch className='w-6 h-6 fill-white' />
              </button>
            </div>
          </div>
          {user && orders.length > 0 && orders.filter((order) => order.createdBy._id === user._id).length > 0 && (
            <div className='p-5 border rounded-lg shadow-lg border-slate-300'>
              <Rating
                name='simple-controlled'
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue)
                }}
              />
              <textarea
                className='w-full col-span-2 px-1 py-2 mt-5 text-gray-600 border border-gray-300 rounded-md bg-gray-50'
                placeholder='Type the mesage review ...'
                rows={4}
                value={reviewText}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setReviewText(event.target.value)}
              />
              <button
                type='button'
                onClick={handleCreateReview}
                className='p-2 px-5 mt-5 text-lg font-semibold text-white capitalize bg-black rounded-lg '
              >
                Create Review
              </button>
            </div>
          )}
          <hr />
          <div className='flex flex-col gap-5'>
            {filteredReviews.length > 0 &&
              filteredReviews.slice(0, page * 5).map((review, index) => (
                <article key={index + review._id}>
                  <div className='flex items-center'>
                    {review?.reviewer?.avatar ? (
                      <img
                        src={
                          review?.reviewer?.avatar.startsWith('upload')
                            ? `${process.env.REACT_APP_URL_SERVER}/${review?.reviewer?.avatar}`
                            : review?.reviewer?.avatar
                        }
                        alt='avata'
                        className='w-12 h-12 rounded-full'
                      />
                    ) : (
                      <div className='relative flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full'>
                        <span className='text-2xl text-white'>
                          {review && review?.reviewer?.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className='ml-4 font-medium'>
                      <p>
                        {review.reviewer.name}
                        <span className='block text-sm text-gray-500'>@{review.reviewer.id}</span>
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 mb-1 space-x-1 rtl:space-x-reverse'>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map((star, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-300' : 'text-gray-300'} me-1`}
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 22 20'
                        >
                          <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                        </svg>
                      ))}{' '}
                    </div>
                    |
                    <div className='text-sm text-gray-500 '>
                      <p>{calculateTime(review.createdAt)}</p>
                    </div>
                  </div>
                  <p className='mb-5 text-gray-500 '>{review.reviewText}</p>
                  {filteredReviews.length !== index + 1 && <hr />}
                </article>
              ))}
            {page * 5 < filteredReviews.length && (
              <div>
                <button
                  onClick={() => setPage((page) => page + 1)}
                  className='p-2 px-5 border border-black rounded-lg'
                  type='button'
                >
                  More ({filteredReviews.length})
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='col-span-2 '>
          <div className='sticky top-0 overflow-clip'>
            <Box className='border border-gray-300 ' sx={{ width: '100%', typography: 'body1' }}>
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
                    <TabPanel key={index} className=' !p-0' value={String(index + 1)}>
                      <div className='flex flex-col gap-2 p-10'>
                        <div className='flex flex-row justify-between w-full'>
                          <span className='font-bold text-gray-600 uppercase'>{pack.name}</span>
                          <span className='text-2xl font-bold text-gray-600'>${pack.price}</span>
                        </div>
                        <p className='text-gray-600'>{pack.description}</p>
                        <div className='flex flex-row gap-3'>
                          <div className='flex flex-row items-center gap-2 text-gray-600'>
                            <FaRegClock />
                            <span className='font-medium'>{pack.deliveryTime} Days Delivery</span>
                          </div>
                          <div className='flex flex-row items-center gap-2 text-gray-600'>
                            <HiRefresh className='w-5 h-5' />
                            <span className='font-medium'>
                              {pack.revisions !== 999 ? pack.revisions : 'Unlimited'} Revisions
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col '>
                          {pack.features &&
                            pack.features.length > 0 &&
                            pack.features.map((feature, index) => (
                              <div key={index} className='flex flex-row items-center gap-2'>
                                <FaCheck
                                  className={`h-4 w-4 ${feature.status === true ? 'fill-black' : 'fill-gray-300'}`}
                                />
                                <span className='text-gray-600'>{feature.name}</span>
                              </div>
                            ))}
                        </div>
                        <OrderButton pack={pack} gig={gig} type='continune' />
                        <div className='flex justify-center'>
                          <button
                            onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className='mt-2 text-lg'
                            type='button'
                          >
                            Compare packages
                          </button>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
              </TabContext>
            </Box>
            <div className='w-full p-5 mt-10'>
              <button
                onClick={handleContactMe}
                type='button'
                className='w-full p-2 text-lg font-normal text-center border border-black rounded-md hover:bg-gray-700 hover:text-white'
              >
                Contact me
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GigDetailPage
