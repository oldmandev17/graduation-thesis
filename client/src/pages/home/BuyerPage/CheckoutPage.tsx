/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Divider, FormControlLabel, Radio, RadioGroup, Step, StepLabel, Stepper } from '@mui/material'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createOrder, getOrderDetail } from 'apis/api'
import CardIcon from 'components/common/CardIcon'
import PayPalIcon from 'components/common/PayPalIcon'
import { useMessage } from 'contexts/StateContext'
import { IOrder, OrderMethod } from 'modules/order'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AiOutlineStar } from 'react-icons/ai'
import { FaCheck, FaRegClock } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { SiFreelancer } from 'react-icons/si'
import { TfiPackage } from 'react-icons/tfi'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

const stripePromise = loadStripe(
  'pk_test_51NpqrlIi5UcP2vQDErVonLo8Nw5NRfmtQqJ8BJPrJuREJe6BgBEqSHaZgSbJWBjJgizOTA8H344Geyf3XlxwtsH600B9hqkxWv'
)

const steps = ['Order Details', 'Confirm & Pay', 'Review Order']

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { order } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  const [paymentMethod, setPaymentMethod] = useState<OrderMethod>(OrderMethod.STRIPE)
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrderStrip = async () => {
    if (!stripe || !elements) return
    setIsProcessing(true)
    await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/user/${user?.id}/completion`
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    setIsProcessing(false)
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod((event.target as HTMLInputElement).value as OrderMethod)
  }

  return (
    <form className='pb-10 px-28'>
      <div className='grid grid-cols-5 gap-32 py-10'>
        <div className='flex flex-col col-span-3 gap-10'>
          <div className='border border-gray-300'>
            <div className='p-4 text-xl font-semibold bg-gray-100'>Billing Information</div>
            <div className='flex flex-col gap-3 p-4'>
              <p className='text-lg text-gray-600'>Your invoice will be issued according to the details listed here.</p>
              <p className='text-lg text-gray-600'>
                <span className='font-semibold'>Buyer: </span>
                {user?.name}
              </p>
            </div>
          </div>
          <div className='border border-gray-300'>
            <div className='p-4 text-xl font-semibold bg-gray-100'>Payment Options</div>
            <div className='flex flex-col gap-3'>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                value={paymentMethod}
                name='radio-buttons-group'
                onChange={handleRadioChange}
              >
                <div className='flex items-center p-4 py-3 text-lg font-semibold'>
                  <FormControlLabel
                    value={OrderMethod.STRIPE}
                    control={
                      <Radio
                        sx={{
                          color: '#000',
                          '&.Mui-checked': {
                            color: '#000'
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: 28
                          }
                        }}
                      />
                    }
                    label=''
                  />
                  <span className='pr-4'>Credit & Debit Cards</span>
                  <CardIcon />
                </div>
                {paymentMethod === OrderMethod.STRIPE && (
                  <div className='p-8 shadow-inner '>
                    <div className='w-3/4 mx-auto'>
                      <PaymentElement id='payment-element' />
                    </div>
                  </div>
                )}
                <hr />
                <div className='flex items-center p-4 py-3 text-lg font-semibold'>
                  <FormControlLabel
                    value={OrderMethod.PAYPAL}
                    control={
                      <Radio
                        sx={{
                          color: '#000',
                          '&.Mui-checked': {
                            color: '#000'
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: 28
                          }
                        }}
                      />
                    }
                    label=''
                  />
                  <PayPalIcon />
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className='col-span-2 '>
          <div className='border border-gray-300'>
            <div className='flex flex-col gap-4 p-4 px-8 bg-gray-100'>
              <div className='flex gap-4'>
                <div className='w-1/3 h-24'>
                  <img
                    className='object-contain w-full h-full bg-white rounded-md'
                    src={`${process.env.REACT_APP_URL_SERVER}/${order.gig && order.gig.images && order.gig.images[0]}`}
                    alt={order.gig && order.gig.name}
                  />
                </div>
                <p className='text-lg font-semibold'>{order.gig && order.gig.name}</p>
              </div>
              <hr />
              <div className='flex justify-between text-xl font-semibold text-gray-600'>
                <span className='text-black'>{order.pack && order.pack.name}</span>
                {order.quantity > 0 && <span>x{order.quantity}</span>}
                <span>${order.quantity * ((order.pack && order.pack.price) || 1)}</span>
              </div>
              <div>
                {order.pack &&
                  order.pack.features &&
                  order.pack.features
                    .filter((feature) => feature.status === true)
                    .map((feature, index) => (
                      <div key={index} className='flex flex-row items-center gap-2'>
                        <FaCheck className='w-4 h-4 fill-black' />
                        <span className='text-lg font-semibold text-gray-600'>{feature.name}</span>
                      </div>
                    ))}
              </div>
            </div>
            <hr />
            <div className='flex flex-col gap-4 p-4 px-8'>
              <div className='flex justify-between text-lg font-semibold text-gray-600'>
                <span>Service fee</span>
                <span>${order.quantity * ((order.pack && order.pack.price) || 1) * 0.05}</span>
              </div>
              <hr />
              <div className='flex justify-between text-xl font-bold text-gray-600'>
                <span>Total</span>
                <span>${order.quantity * ((order.pack && order.pack.price) || 1) * 1.05}</span>
              </div>
              <div className='flex justify-between text-lg font-semibold text-gray-600'>
                <span>Total delivery time</span>
                <span>
                  {order.pack && order.pack.deliveryTime} day
                  {((order.pack && order.pack.deliveryTime) || 0) > 1 && 's'}
                </span>
              </div>
              <div className='flex flex-col gap-3'>
                {paymentMethod === OrderMethod.STRIPE ? (
                  <button
                    onClick={handlePlaceOrderStrip}
                    className='w-full p-3 py-4 text-xl font-semibold text-white bg-black rounded-lg'
                    type='button'
                  >
                    {isProcessing ? (
                      <div role='status'>
                        <svg
                          aria-hidden='true'
                          className='inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                          />
                        </svg>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    ) : (
                      <> Confirm & Pay</>
                    )}
                  </button>
                ) : (
                  <PayPalButtons
                    style={{
                      color: 'silver',
                      layout: 'horizontal',
                      height: 48,
                      tagline: false,
                      shape: 'pill'
                    }}
                    onClick={(data, actions) => {
                      if (!order.gig || !order.pack) {
                        return actions.reject()
                      }
                      return actions.resolve()
                    }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: String(order.quantity * ((order.pack && order.pack.price) || 1) * 1.05)
                            }
                          }
                        ]
                      })
                    }}
                    onApprove={async (data, actions) => {
                      const payment = await actions.order?.capture()
                      if (payment && payment?.status === 'COMPLETED') {
                        navigate(`/user/${user?.id}/completion?payment_intent=${payment?.id}`)
                      }
                    }}
                    onCancel={() => {}}
                    onError={(err: any) => {
                      toast.error(err.response.data.error.message)
                    }}
                  />
                )}
                <span className='text-center'>
                  You will be charged ${order.quantity * ((order.pack && order.pack.price) || 1) * 1.05}.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

function CheckoutPage() {
  const [search] = useSearchParams()
  const location = useLocation()
  const { order, handleAddOrder, handleRemoveOrder } = useMessage()
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const [orderDetail, setOrderDetail] = useState<IOrder>()
  const { user } = useAppSelector((state) => state.auth)
  const { accessToken } = getToken()

  const createOrderDetail = async () => {
    const data: any = {}
    data.paymentID = search.get('payment_intent')
    data.method = search.get('payment_intent')?.startsWith('pi_') ? OrderMethod.STRIPE : OrderMethod.PAYPAL
    data.price = ((order.pack && order.pack.price) || 1) * order.quantity * 1.05
    data.quantity = order.quantity
    data.dueOn = new Date(new Date().getTime() + ((order.pack && order.pack.deliveryTime) || 0) * 24 * 60 * 60 * 1000)
    data.gig = order.gig && order.gig._id
    data.type = order.pack && order.pack.type
    await createOrder(data, accessToken)
      .then((response) => {
        if (response.status === 201) {
          navigate(`${location.pathname}?order=${response.data.order._id}`)
          handleRemoveOrder()
          sessionStorage.removeItem('order')
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  useEffect(() => {
    if (order.gig !== undefined && !location.pathname.includes('completion')) {
      setActiveStep(1)
    }
    if (location.pathname.includes('completion')) {
      setActiveStep(2)
    }
    if (order.gig !== undefined && location.pathname.includes('completion')) {
      createOrderDetail()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.gig, location.pathname])

  useEffect(() => {
    if (order.gig) {
      sessionStorage.setItem('order', JSON.stringify(order))
    }
  }, [order])

  const getOrderDetails = useCallback(async () => {
    await getOrderDetail(search.get('order') as string, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setOrderDetail(response.data.order)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.get('order')])

  useEffect(() => {
    if (search.get('order')) {
      getOrderDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrderDetails])

  useEffect(() => {
    if (orderDetail && user && orderDetail.createdBy._id !== user?._id) {
      navigate('/auth/un-authorize')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail, user])

  useEffect(() => {
    if (sessionStorage.getItem('order') !== null) {
      handleAddOrder(JSON.parse(sessionStorage.getItem('order') as string))
      setActiveStep(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Helmet>
        <title>Secure Checkout | Freelancer</title>
      </Helmet>
      <div>
        <div className='flex flex-row items-center gap-10 py-5 px-28 '>
          <SiFreelancer onClick={() => navigate('/')} className='w-12 h-12 cursor-pointer fill-green-600' />
          <Stepper sx={{ width: '100%', paddingY: '15px' }} activeStep={activeStep}>
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: {
                optional?: ReactNode
              } = {}
              return (
                <Step
                  sx={{
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: '#00b14f'
                    },
                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                      color: '#fff'
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: '#00b14f'
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                      color: '#fff'
                    },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                      fill: '#fff'
                    }
                  }}
                  key={label}
                  {...stepProps}
                >
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </div>
        <Divider />
        {activeStep === 0 && (
          <div className='flex flex-col items-center justify-center w-full h-screen'>
            <p className='text-lg font-semibold text-gray-600'>Complete Order Detail First, Please </p>
            <button
              className='p-2 px-10 mt-3 text-lg font-semibold text-white capitalize bg-black rounded-lg'
              onClick={() => navigate(-1)}
              type='button'
            >
              Back
            </button>
          </div>
        )}
        {activeStep === 1 && search.get('paymentID') && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret: search.get('paymentID') as any }}>
            <CheckoutForm />
          </Elements>
        )}
        {activeStep === 2 && (
          <div className='flex flex-col gap-5 py-10 px-28'>
            <div className='flex flex-row justify-between'>
              <span className='text-4xl font-semibold text-gray-600'>
                Order Detail ({orderDetail && orderDetail.name})
              </span>
              <button
                onClick={() => navigate(`/user/${user?.id}/buyer-orders`)}
                type='button'
                className='bg-[#00b14f] text-lg font-bold text-white rounded-lg px-3 py-1 uppercase'
              >
                All Order
              </button>
            </div>
            <table className='w-full border border-slate-300'>
              <thead>
                <tr>
                  <th className='py-4 text-xl font-semibold bg-gray-100 border border-slate-300'>Seller Info</th>
                  <th className='py-4 text-xl font-semibold bg-gray-100 border border-slate-300'>Buyer Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='w-1/2 gap-10 p-5 bg-white border border-slate-300'>
                    <div className='flex flex-row items-center gap-4'>
                      {orderDetail?.gig?.createdBy?.avatar ? (
                        <img
                          src={
                            orderDetail?.gig?.createdBy?.avatar.startsWith('upload')
                              ? `${process.env.REACT_APP_URL_SERVER}/${orderDetail?.gig?.createdBy?.avatar}`
                              : orderDetail?.gig?.createdBy?.avatar
                          }
                          alt='avata'
                          className='w-20 h-20 rounded-full'
                        />
                      ) : (
                        <div className='relative flex items-center justify-center w-20 h-20 bg-purple-500 rounded-full'>
                          <span className='text-2xl text-white'>
                            {orderDetail?.gig && orderDetail?.gig?.createdBy?.email[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className='flex flex-col gap-1'>
                        <div id='userInfor' className='flex flex-col gap-1'>
                          <Link to='/' target='_blank' className='text-base font-bold text-gray-700 hover:underline'>
                            {orderDetail?.gig?.createdBy?.name}
                          </Link>
                          <span className='text-base font-semibold text-gray-400'>
                            @{orderDetail?.gig?.createdBy?.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/user/${user?.id}/messages?to=${
                            orderDetail && orderDetail.gig && orderDetail.gig.createdBy && orderDetail.gig.createdBy.id
                          }`
                        )
                      }
                      type='button'
                      className='px-5 py-2 mt-4 text-lg font-semibold border border-gray-800 rounded-md hover:text-white hover:bg-gray-800'
                    >
                      Contact me
                    </button>
                  </td>
                  <td className='w-1/2 p-5 bg-white border border-slate-300'>
                    <div className='flex flex-row items-center gap-4'>
                      {orderDetail?.createdBy?.avatar ? (
                        <img
                          src={
                            orderDetail?.createdBy?.avatar.startsWith('upload')
                              ? `${process.env.REACT_APP_URL_SERVER}/${orderDetail?.createdBy?.avatar}`
                              : orderDetail?.createdBy?.avatar
                          }
                          alt='avata'
                          className='w-20 h-20 rounded-full'
                        />
                      ) : (
                        <div className='relative flex items-center justify-center w-20 h-20 bg-purple-500 rounded-full'>
                          <span className='text-2xl text-white'>
                            {orderDetail && orderDetail?.createdBy?.email[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className='flex flex-col gap-1'>
                        <div id='userInfor' className='flex flex-col gap-1'>
                          <span className='text-base font-bold text-gray-700'>{orderDetail?.createdBy?.name}</span>
                          <span className='text-base font-semibold text-gray-400'>@{orderDetail?.createdBy?.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className='w-full border border-slate-300'>
              <thead>
                <tr>
                  <th className='py-4 text-xl font-semibold bg-gray-100 border border-slate-300'>Gig Info</th>
                  <th className='py-4 text-xl font-semibold bg-gray-100 border border-slate-300'>
                    Order Info (
                    {orderDetail &&
                      orderDetail.gig &&
                      orderDetail.gig.packages &&
                      orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.type}
                    )
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='w-1/2 gap-10 p-5 bg-white border border-slate-300'>
                    <div className='flex flex-row items-center gap-4'>
                      <img
                        src={`${process.env.REACT_APP_URL_SERVER}/${
                          orderDetail && orderDetail.gig && orderDetail.gig.images && orderDetail?.gig?.images[0]
                        }`}
                        alt={orderDetail && orderDetail.name}
                        className='object-contain w-48 h-24'
                      />
                      <div className='flex flex-col gap-1'>
                        <div id='userInfor' className='flex flex-col gap-1'>
                          <Link
                            to={`/gig-detail/${orderDetail && orderDetail.gig && orderDetail.gig.slug}`}
                            target='_blank'
                            className='text-base font-bold hover:underline'
                          >
                            {orderDetail?.gig?.name}
                          </Link>
                          <div className='flex flex-row gap-1'>
                            <AiOutlineStar className='w-6 h-6 fill-yellow-500' />
                            <span className='text-lg font-bold text-yellow-500'>
                              {(
                                (orderDetail &&
                                  orderDetail.gig &&
                                  orderDetail.gig.reviews &&
                                  orderDetail.gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
                                    (orderDetail && orderDetail.gig && orderDetail.gig.reviews.length)) ||
                                0
                              ).toFixed(1)}
                            </span>
                            <span className='text-lg font-semibold text-gray-600'>
                              ({orderDetail && orderDetail.gig && orderDetail.gig.reviews.length})
                            </span>
                          </div>
                          <span className='text-lg font-bold text-black'>
                            From $
                            {orderDetail &&
                              orderDetail.gig &&
                              orderDetail.gig.packages &&
                              orderDetail.gig.packages.length > 0 &&
                              orderDetail.gig.packages[0].price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='w-1/2 p-5 bg-white border border-slate-300'>
                    <div className='grid grid-cols-2'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-3 text-lg font-semibold'>
                          <TfiPackage className='w-6 h-6 ' />
                          <span>
                            {orderDetail &&
                              orderDetail.gig &&
                              orderDetail.gig.packages &&
                              orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.name}{' '}
                            package{' '}
                            {orderDetail && orderDetail.quantity > 1 && `(x${orderDetail && orderDetail.quantity})`}
                          </span>
                        </div>
                        <div className='flex items-center gap-3 text-lg font-semibold'>
                          <FaRegClock className='w-6 h-6 ' />
                          <span>
                            {orderDetail &&
                              orderDetail.gig &&
                              orderDetail.gig.packages &&
                              orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]
                                ?.deliveryTime}
                            -day
                            {((orderDetail &&
                              orderDetail.gig &&
                              orderDetail.gig.packages &&
                              orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]
                                ?.deliveryTime) ||
                              0) > 1 && 's'}{' '}
                            delivery
                          </span>
                        </div>
                        <div className='flex items-center gap-3 text-lg font-semibold'>
                          <HiRefresh className='w-6 h-6 ' />
                          <span>
                            {orderDetail &&
                            orderDetail.gig &&
                            orderDetail.gig.packages &&
                            orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.revisions ===
                              999
                              ? 'Unlimited'
                              : orderDetail &&
                                orderDetail.gig &&
                                orderDetail.gig.packages &&
                                orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]
                                  ?.revisions}{' '}
                            revisions
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='pr-3 text-lg font-semibold'>
                          Gig fee: {orderDetail && (orderDetail.price / 105) * 100}$
                        </p>
                        <p className='pr-3 text-lg font-semibold'>
                          Service fee: {orderDetail && (orderDetail.price / 105) * 5}$
                        </p>
                        <p className='pr-3 text-xl font-bold'>Total: {orderDetail && orderDetail.price}$</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default CheckoutPage
