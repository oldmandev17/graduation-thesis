/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { Fade, Menu, MenuItem } from '@mui/material'
import { getOrderDetail, updateOrderStatus } from 'apis/api'
import OrderStatusTag from 'components/common/OrderStatusTag'
import { IOrder, OrderStatus } from 'modules/order'
import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AiOutlineStar } from 'react-icons/ai'
import { FaRegClock } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { MdMoreVert } from 'react-icons/md'
import { TfiPackage } from 'react-icons/tfi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function OrderDetailPage() {
  const { id } = useParams<{ id?: string }>()
  const { accessToken } = getToken()
  const [orderDetail, setOrderDetail] = useState<IOrder>()
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [reason, setReason] = useState<string | undefined>()
  const [reload, setReload] = useState<boolean>(false)
  const [anchorActionEl, setAnchorActionEl] = useState<null | HTMLElement>(null)
  const openAction = Boolean(anchorActionEl)

  const handleClickAction = (event: MouseEvent<HTMLElement>) => {
    setAnchorActionEl(event.currentTarget)
  }
  const handleCloseAction = () => {
    setAnchorActionEl(null)
  }

  const getOrderDetails = useCallback(async () => {
    await getOrderDetail(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setOrderDetail(response.data.order)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpdateStatus = async (status: OrderStatus) => {
    const reasonEl = document.getElementById('reason') as HTMLTextAreaElement
    if (!reason && (status === OrderStatus.CANCEL || status === OrderStatus.PAID)) {
      reasonEl.classList.remove('hidden')
      toast.warning('Enter the reason, please!')
    } else if (id) {
      await updateOrderStatus([id], status, reason, accessToken)
        .then((response) => {
          if (response.status === 200) {
            setReason(undefined)
            setReload((prev) => !prev)
            toast.success('Update Completed Successfully!')
            reasonEl.classList.add('hidden')
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
          if (error.response.status === 406) {
            setReload((prev) => !prev)
          }
        })
    }
  }

  useEffect(() => {
    if (id) {
      getOrderDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrderDetails, reload])

  useEffect(() => {
    if (
      user &&
      orderDetail &&
      orderDetail.gig.createdBy &&
      user?._id !== orderDetail.createdBy._id &&
      user?._id !== orderDetail.gig.createdBy._id
    ) {
      navigate('/auth/un-authorize')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, orderDetail])

  return (
    <>
      <Helmet>
        <title>Order Detail | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-5 py-10 px-28'>
        <div className='flex flex-row justify-between'>
          <div className='flex gap-10'>
            <span className='text-4xl font-semibold text-gray-600'>
              Order Detail ({orderDetail && orderDetail.name})
            </span>
            <OrderStatusTag status={orderDetail && orderDetail.status} />
          </div>
          <div className='flex gap-10'>
            <button
              onClick={() => navigate(`/user/${user?.id}/buyer-orders`)}
              type='button'
              className='bg-[#00b14f] text-lg font-bold text-white rounded-lg px-3 py-1 uppercase'
            >
              All Order
            </button>
            <button
              type='button'
              id='action'
              aria-controls={openAction ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openAction ? 'true' : undefined}
              onClick={handleClickAction}
              className='px-2 py-1 bg-white border border-gray-300'
            >
              <MdMoreVert className='cursor-pointer' />
            </button>
            <Menu
              id='fade-menu'
              MenuListProps={{
                'aria-labelledby': 'action'
              }}
              anchorEl={anchorActionEl}
              open={openAction}
              onClose={handleCloseAction}
              TransitionComponent={Fade}
            >
              <MenuItem
                className='!pr-20 !py-2'
                onClick={() => {
                  navigate(
                    `/user/${user?.id}/messages?to=${
                      user?._id === orderDetail?.createdBy._id
                        ? orderDetail && orderDetail.gig && orderDetail.gig.createdBy && orderDetail.gig.createdBy.id
                        : orderDetail?.createdBy.id
                    }`
                  )
                  handleCloseAction()
                }}
              >
                Send Message
              </MenuItem>
              {user?._id === orderDetail?.createdBy._id ? (
                <div>
                  {orderDetail && orderDetail.status === OrderStatus.PENDING && (
                    <MenuItem
                      className='!pr-20 !py-2'
                      onClick={() => {
                        handleUpdateStatus(OrderStatus.CANCEL)
                        handleCloseAction()
                      }}
                    >
                      Cancel
                    </MenuItem>
                  )}
                  {orderDetail && orderDetail.status === OrderStatus.SELLER_COMFIRM && (
                    <MenuItem
                      className='!pr-20 !py-2'
                      onClick={() => {
                        handleUpdateStatus(OrderStatus.BUYER_COMFIRM)
                        handleCloseAction()
                      }}
                    >
                      Confirm
                    </MenuItem>
                  )}
                </div>
              ) : (
                <div>
                  {orderDetail && orderDetail.status === OrderStatus.PENDING && (
                    <>
                      <MenuItem
                        className='!pr-20 !py-2'
                        onClick={() => {
                          handleUpdateStatus(OrderStatus.PAID)
                          handleCloseAction()
                        }}
                      >
                        Refuse
                      </MenuItem>
                      <MenuItem
                        className='!pr-20 !py-2'
                        onClick={() => {
                          handleUpdateStatus(OrderStatus.ACCEPT)
                          handleCloseAction()
                        }}
                      >
                        Accept
                      </MenuItem>
                    </>
                  )}
                  {orderDetail && orderDetail.status === OrderStatus.ACCEPT && (
                    <MenuItem
                      className='!pr-20 !py-2'
                      onClick={() => {
                        handleUpdateStatus(OrderStatus.SELLER_COMFIRM)
                        handleCloseAction()
                      }}
                    >
                      Confirm
                    </MenuItem>
                  )}
                </div>
              )}
            </Menu>
          </div>
        </div>
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
              <td className='w-1/3 gap-10 p-5 bg-white border border-slate-300'>
                <div className='flex flex-row items-center gap-4 mb-5'>
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
                <hr />
                <div className='flex gap-10 mt-5'>
                  <span className='text-lg font-semibold'>
                    {user?._id === orderDetail?.createdBy?._id ? 'Created By' : 'Order By'}
                  </span>
                  <div className='flex flex-row items-center gap-4'>
                    {user?._id === orderDetail?.createdBy?._id ? (
                      orderDetail?.gig?.createdBy?.avatar ? (
                        <img
                          src={
                            orderDetail?.gig?.createdBy?.avatar.startsWith('upload')
                              ? `${process.env.REACT_APP_URL_SERVER}/${orderDetail?.gig?.createdBy?.avatar}`
                              : orderDetail?.gig?.createdBy?.avatar
                          }
                          alt='avata'
                          className='w-16 h-16 rounded-full'
                        />
                      ) : (
                        <div className='relative flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full'>
                          <span className='text-2xl text-white'>
                            {orderDetail?.gig && orderDetail?.gig?.createdBy?.email[0].toUpperCase()}
                          </span>
                        </div>
                      )
                    ) : orderDetail?.createdBy?.avatar ? (
                      <img
                        src={
                          orderDetail?.createdBy?.avatar.startsWith('upload')
                            ? `${process.env.REACT_APP_URL_SERVER}/${orderDetail?.createdBy?.avatar}`
                            : orderDetail?.createdBy?.avatar
                        }
                        alt='avata'
                        className='w-16 h-16 rounded-full'
                      />
                    ) : (
                      <div className='relative flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full'>
                        <span className='text-2xl text-white'>
                          {orderDetail?.gig && orderDetail?.createdBy?.email[0].toUpperCase()}
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
                </div>
              </td>
              <td className='w-2/3 p-5 bg-white border border-slate-300'>
                <div className='grid grid-cols-2'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-3 text-base font-semibold'>
                      <TfiPackage className='w-6 h-6 ' />
                      <span>
                        {orderDetail &&
                          orderDetail.gig &&
                          orderDetail.gig.packages &&
                          orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.name}{' '}
                        package {orderDetail && orderDetail.quantity > 1 && `(x${orderDetail && orderDetail.quantity})`}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-base font-semibold'>
                      <FaRegClock className='w-6 h-6 ' />
                      <span>
                        {orderDetail &&
                          orderDetail.gig &&
                          orderDetail.gig.packages &&
                          orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.deliveryTime}
                        -day
                        {((orderDetail &&
                          orderDetail.gig &&
                          orderDetail.gig.packages &&
                          orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.deliveryTime) ||
                          0) > 1 && 's'}{' '}
                        delivery
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-base font-semibold'>
                      <HiRefresh className='w-6 h-6 ' />
                      <span>
                        {orderDetail &&
                        orderDetail.gig &&
                        orderDetail.gig.packages &&
                        orderDetail.gig.packages.filter((pack) => pack.type === orderDetail.type)[0]?.revisions === 999
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
                    <p className='pr-3 text-base font-semibold'>
                      Gig fee: {orderDetail && (orderDetail.price / 105) * 100}$
                    </p>
                    <p className='pr-3 text-base font-semibold'>
                      Service fee: {orderDetail && (orderDetail.price / 105) * 5}$
                    </p>
                    <p className='pr-3 text-lg font-bold'>Total: {orderDetail && orderDetail.price}$</p>
                  </div>
                  <textarea
                    className='hidden w-full col-span-2 px-1 py-2 mt-5 text-gray-600 border border-gray-300 rounded-md bg-gray-50'
                    placeholder='Type the reason ...'
                    id='reason'
                    rows={4}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value)}
                  />
                  {orderDetail && orderDetail.reason && (
                    <div className='flex col-span-2 gap-5 mt-5'>
                      <span className='text-lg font-semibold'>Note:</span>
                      <div className='w-full px-1 py-2 mt-5 text-lg text-gray-600 border border-gray-300 rounded-md bg-gray-50 '>
                        <p>{orderDetail && orderDetail.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default OrderDetailPage
