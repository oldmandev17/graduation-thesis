/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
import { getUserById } from 'apis/api'
import GigCard from 'components/common/GigCard'
import SellerTag from 'components/common/SellerTag'
import { IGig } from 'modules/gig'
import { IOrder, OrderStatus } from 'modules/order'
import { IUser } from 'modules/user'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaStar } from 'react-icons/fa'
import { GrSend } from 'react-icons/gr'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import calculateTime from 'utils/calculateTime'

function ProfileUserPage() {
  const location = useLocation()
  const [userDetail, setUserDetail] = useState<IUser>()
  const { id } = useParams<{ id?: string }>()
  const [all, setAll] = useState<boolean>(false)
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Array<IOrder>>([])
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
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const { user } = useAppSelector((state) => state.auth)

  const getUserDetailById = useCallback(async () => {
    await getUserById(id)
      .then((response) => {
        if (response.status === 200) {
          setUserDetail(response.data.user)
          setRatings(response.data.ratings.ratings)
          setTotalReviews(response.data.ratings.totalReviews)
          setAverageRating(response.data.ratings.averageRating)
          setPercentagePerStar(response.data.ratings.percentagePerStar)
          setOrders(response.data.orders)
          setGigs(response.data.gigs)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [id])

  useEffect(() => {
    if (id) {
      getUserDetailById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserDetailById])

  const handleContactMe = () => {
    if (!user) {
      navigate('/auth/login')
      localStorage.setItem('redirect', String(location.pathname))
    } else {
      navigate(`/user/${user?.id}/messages?to=${userDetail?.id}`)
    }
  }

  return (
    <>
      <Helmet>
        <title>{userDetail && userDetail.name ? `${userDetail.name}` : ''} Profile | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-10 py-10 px-28'>
        <div className='grid grid-cols-3 gap-10'>
          <div className='flex flex-col col-span-2 gap-5'>
            <div className='flex gap-5'>
              {userDetail?.avatar ? (
                <img
                  src={
                    userDetail.avatar.startsWith('upload')
                      ? `${process.env.REACT_APP_URL_SERVER}/${userDetail.avatar}`
                      : userDetail.avatar
                  }
                  alt={userDetail?.name}
                  className='object-contain w-40 h-40 rounded-full'
                />
              ) : (
                <div className='relative flex items-center justify-center w-40 h-40 bg-purple-500 rounded-full'>
                  <span className='text-2xl text-white'>{userDetail && userDetail?.email[0].toUpperCase()}</span>
                </div>
              )}
              <div className='flex flex-col justify-center gap-2'>
                <p className='text-xl font-semibold'>
                  {userDetail?.name}
                  <span className='ml-5 text-lg font-normal text-gray-600'>@{userDetail?.id}</span>
                </p>
                <span className='flex flex-row items-center gap-1'>
                  <FaStar className='w-4 h-4 fill-gray-900' />
                  <span className='text-base font-semibold text-gray-900'>{Math.ceil(averageRating).toFixed(1)}</span>
                  <span className='text-base font-semibold text-gray-500 cursor-pointer'>({totalReviews})</span>
                </span>
                <SellerTag total={orders.filter((order) => order.status === OrderStatus.COMPLETE).length} />
              </div>
            </div>
            <div>
              <h6 className='text-xl font-semibold text-gray-700'>About me</h6>
              <p className='mt-3 text-lg text-gray-600'>{userDetail?.description}</p>
            </div>
            <div>
              <h6 className='text-xl font-semibold text-gray-700'>Skill</h6>
              <p className='mt-3 text-lg text-gray-600'>{userDetail?.skill?.replace(',', '')}</p>
            </div>
          </div>
          <div>
            <div className='p-5 border rounded-md shadow-sm border-slate-300'>
              <button
                onClick={handleContactMe}
                type='button'
                className='flex items-center justify-center w-full gap-3 p-3 text-lg font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-500'
              >
                <GrSend className='fill-white' />
                Contact me
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4 className='text-2xl font-semibold text-gray-700'>My Gig</h4>
          <div className='mt-3'>
            <div className='grid grid-cols-4 gap-10'>
              {userDetail &&
                userDetail.gigs.length > 0 &&
                userDetail.gigs
                  .slice(0, all ? userDetail.gigs.length : 4)
                  .map((gig, index) => <GigCard height={200} key={gig?._id + index} gig={gig} type='profile' />)}
            </div>
            {userDetail && userDetail.gigs.length > 4 && !all && (
              <button onClick={() => setAll(true)} className='p-2 border border-black rounded-lg' type='button'>
                View All ({userDetail.gigs.length})
              </button>
            )}
          </div>
        </div>
        <div id='gig_faq' className='flex flex-col w-2/3'>
          <div className='flex items-center mb-2'>
            <p className='mr-2 text-lg font-medium text-gray-800 '>{totalReviews} reviews </p>
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
            <p className='text-lg font-medium text-gray-800 ms-1 '>{averageRating.toFixed(1)}</p>
          </div>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={index} className='flex items-center mt-2'>
              <span className='text-base font-medium text-gray-800 hover:underline'>{star} stars</span>
              <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded '>
                <div className='h-3 bg-gray-500 rounded' style={{ width: `${percentagePerStar[star]}%` }} />
              </div>
              <span className='text-sm font-medium text-gray-500 '>({ratings[star]})</span>
            </div>
          ))}
        </div>
        <hr />
        {gigs &&
          gigs.map((gig, index) => (
            <div key={gig._id + index}>
              {gig.reviews.map((review, ind) => (
                <div className='flex flex-col gap-5'>
                  <div key={review._id + ind} className='grid grid-cols-3 gap-5 divide-x'>
                    <div className='col-span-2'>
                      <article>
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
                            {[1, 2, 3, 4, 5].map((star, indexStar) => (
                              <svg
                                key={indexStar}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-300' : 'text-gray-300'
                                } me-1`}
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
                      </article>
                    </div>
                    <div className='flex flex-col gap-3 px-10 py-5'>
                      <h6>Ordered:</h6>
                      <Link to={`/gig-detail/${gig?.slug}`} target='_blank'>
                        <div className='flex w-full gap-5 p-5 rounded-lg shadow-lg'>
                          <img
                            src={`${process.env.REACT_APP_URL_SERVER}/${
                              gig && gig.images && gig.images.length > 0 && gig.images[0]
                            }`}
                            alt={gig.name}
                            className='w-2/5'
                          />
                          <div className='flex flex-col justify-center text-lg font-semibold'>
                            <p>{gig && gig.category && gig.category.name}</p>
                            <p>From ${gig && gig.packages && gig.packages.length > 0 && gig.packages[0].price}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <hr className='mb-5' />
                </div>
              ))}
            </div>
          ))}
      </div>
    </>
  )
}

export default ProfileUserPage
