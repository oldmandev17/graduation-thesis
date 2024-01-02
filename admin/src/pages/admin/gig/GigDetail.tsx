/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { getGigDetailById, updateGigStatus } from 'apis/api'
import AccordionCustom from 'components/common/AccordionCustom'
import Carousel from 'components/common/Carousel'
import Fancybox from 'components/common/Fancybox'
import { ICategory } from 'modules/category'
import { GigPackageType, GigStatus, IGig } from 'modules/gig'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { FcFlashOn } from 'react-icons/fc'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import timeAgo from 'utils/timeAgo'

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
  const [reason, setReason] = useState<string>()

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

  const handleRefuse = async () => {
    const reasonEl = document.getElementById('reason') as HTMLTextAreaElement
    if (!reason) {
      reasonEl.classList.remove('hidden')
      toast.warning('Enter the reason, please!')
    } else if (id) {
      await updateGigStatus([gig?._id as string], GigStatus.BANNED, reason, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Update Completed Successfully!')
            getGigDetails()
            setReason('')
            reasonEl.classList.add('hidden')
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const handleAccept = async () => {
    if (id) {
      await updateGigStatus([gig?._id as string], GigStatus.ACTIVE, undefined, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Update Completed Successfully!')
            getGigDetails()
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      {gig?.status === GigStatus.WAITING && (
        <div>
          <div className='flex gap-10'>
            <h2 className='mb-2 text-2xl font-bold text-gray-600 dark:text-white'>Request Public Gig</h2>
            <FcFlashOn className='w-8 h-8 p-1 border border-yellow-600 rounded-full animate-bounce' />
          </div>
          <div className='flex items-center w-full gap-10 mt-5'>
            <button
              type='button'
              onClick={handleAccept}
              className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              Accept
            </button>
            <div className='flex items-center w-full gap-2'>
              <div>
                <button
                  type='button'
                  onClick={handleRefuse}
                  className='text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                >
                  Deny
                </button>
              </div>
              <textarea
                className='hidden w-full px-1 py-2 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-50'
                placeholder='Type the reason ...'
                id='reason'
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value)}
              />
            </div>
          </div>
        </div>
      )}
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
              src={
                gig?.createdBy?.avatar.startsWith('upload')
                  ? `${process.env.REACT_APP_URL_SERVER}/${gig?.createdBy?.avatar}`
                  : gig?.createdBy?.avatar
              }
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
        <div className='overflow-hidden min-w-min'>
          <div className='grid grid-cols-4 p-4 text-sm font-medium text-gray-600 bg-gray-100 border-t border-b border-gray-200 gap-x-16 dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
            <div className='flex items-center'>Package</div>
            <div>{GigPackageType.BASIC}</div>
            <div>{GigPackageType.STANDARD}</div>
            <div>{GigPackageType.PREMIUM}</div>
          </div>
          <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
            <div className='text-gray-500 dark:text-gray-400'>Name</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>{gig && gig.packages && gig?.packages[0]?.name}</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>{gig && gig.packages && gig?.packages[1]?.name}</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>{gig && gig.packages && gig?.packages[2]?.name}</div>
          </div>
          <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
            <div className='text-gray-500 dark:text-gray-400'>Description</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[0]?.description}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[1]?.description}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[2]?.description}
            </div>
          </div>
          <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
            <div className='text-gray-500 dark:text-gray-400'>Price</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              ${gig && gig.packages && gig?.packages[0]?.price}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              ${gig && gig.packages && gig?.packages[1]?.price}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              ${gig && gig.packages && gig?.packages[2]?.price}
            </div>
          </div>
          {gig &&
            gig?.packages &&
            gig?.packages?.length > 0 &&
            gig?.packages[0]?.features &&
            gig?.packages[0]?.features?.length > 0 &&
            gig?.packages[0]?.features.map((feature, index) => (
              <div
                key={index}
                className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'
              >
                <div className='text-gray-500 dark:text-gray-400'>{feature.name}</div>
                <div>
                  {feature.status ? (
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
                  ) : (
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
                  )}
                </div>
                <div>
                  {gig &&
                  gig?.packages &&
                  gig?.packages?.length > 0 &&
                  gig?.packages[1]?.features &&
                  gig?.packages[1]?.features?.length > 0 &&
                  gig?.packages[1]?.features[index]?.status ? (
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
                  ) : (
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
                  )}
                </div>
                <div>
                  {gig &&
                  gig?.packages &&
                  gig?.packages?.length > 0 &&
                  gig?.packages[2]?.features &&
                  gig?.packages[2]?.features?.length > 0 &&
                  gig?.packages[2]?.features[index]?.status ? (
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
                  ) : (
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
                  )}
                </div>
              </div>
            ))}
          <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
            <div className='text-gray-500 dark:text-gray-400'>Revisions</div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[0]?.revisions !== 999 ? gig?.packages[0]?.revisions : 'Unlimited'}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[0]?.revisions !== 999 ? gig?.packages[1]?.revisions : 'Unlimited'}
            </div>
            <div className='p-1 text-gray-500 dark:text-gray-400'>
              {gig && gig.packages && gig?.packages[0]?.revisions !== 999 ? gig?.packages[2]?.revisions : 'Unlimited'}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {gig &&
          gig?.FAQs?.map((FAQ, index) => (
            <AccordionCustom key={index} title={FAQ?.question as string}>
              {FAQ.answer}
            </AccordionCustom>
          ))}
      </div>
      {gig?.status !== GigStatus.NONE && gig?.status !== GigStatus.WAITING && (
        <div className='flex flex-col gap-4'>
          <div>
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
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>{averageRating}</p>
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>out of</p>
              <p className='text-sm font-medium text-gray-500 ms-1 dark:text-gray-400'>5</p>
            </div>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{totalReviews} reviews for this Gig</p>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={index} className='flex items-center mt-4'>
                <span className='text-base font-medium dark:text-blue-500 hover:underline'>{star} star</span>
                <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
                  <div className='h-3 bg-yellow-300 rounded' style={{ width: `${percentagePerStar[star]}%` }} />
                </div>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>({ratings[star]})</span>
              </div>
            ))}
          </div>
          <hr className='mx-20 my-5' />
          <ol className='relative border-gray-200 border-s dark:border-gray-700'>
            {gig &&
              gig?.reviews?.map((review, index) => (
                <li key={index} className='mb-10 ms-6'>
                  <span className='absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
                    {review.reviewer.avatar ? (
                      <img
                        className='w-10 h-10 rounded-full shadow-lg'
                        src={`${process.env.REACT_APP_URL_SERVER}/${review.reviewer.avatar}`}
                        alt={review.reviewer.name}
                      />
                    ) : (
                      <span className='w-10 h-10 text-2xl text-white'>{review.reviewer.email[0].toUpperCase()}</span>
                    )}
                  </span>
                  <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
                    <div className='items-center justify-between mb-3 sm:flex'>
                      <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>
                        {timeAgo(new Date(review.createdAt))}
                      </time>
                      <div className='text-sm font-normal text-gray-500 lex dark:text-gray-300'>
                        <span className='mr-5 font-semibold text-gray-600 dark:text-white hover:underline'>
                          {review.reviewer.name}
                        </span>
                        {review.reviewer.id}
                      </div>
                    </div>
                    <div className='p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'>
                      {review.reviewText}
                    </div>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default GigDetail
