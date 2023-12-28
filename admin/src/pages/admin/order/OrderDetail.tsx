/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { PayPalButtons } from '@paypal/react-paypal-js'
import { getOrderDetail, updateOrderStatus } from 'apis/api'
import { IOrder, OrderStatus } from 'modules/order'
import { useCallback, useEffect, useState } from 'react'
import { FcFlashOn } from 'react-icons/fc'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import calculateTime from 'utils/calculateTime'

function OrderDetail() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { accessToken } = getToken()
  const [order, setOrder] = useState<IOrder>()

  const getOrderDetails = useCallback(async () => {
    if (id)
      await getOrderDetail(id, accessToken)
        .then((response) => {
          if (response.status === 200) {
            setOrder(response.data.order)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    getOrderDetails()
  }, [getOrderDetails])

  return (
    <div className='flex flex-col gap-5'>
      {order &&
        (order.status === OrderStatus.CANCEL ||
          order?.status === OrderStatus.PAID ||
          order.status === OrderStatus.BUYER_COMFIRM) && (
          <div>
            <div className='flex gap-10'>
              <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>Comfirm Order</h2>
              <FcFlashOn className='w-8 h-8 p-1 border border-yellow-600 rounded-full animate-bounce' />
            </div>
            <div className='flex flex-col justify-center gap-3 mt-5'>
              {/* <button
                type='button'
                className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                {order.status === OrderStatus.BUYER_COMFIRM ? 'COMPLETE' : 'CONFIRM'}
              </button> */}
              <div className='w-40'>
                <PayPalButtons
                  style={{
                    color: 'silver',
                    layout: 'horizontal',
                    height: 48,
                    tagline: false,
                    shape: 'pill'
                  }}
                  onClick={(data, actions) => {
                    if (!order) {
                      return actions.reject()
                    }
                    return actions.resolve()
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: String(
                              order.status === OrderStatus.COMPLETE ? (order?.price / 105) * 100 : order.quantity
                            )
                          }
                        }
                      ]
                    })
                  }}
                  onApprove={async (data, actions) => {
                    // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars
                    const payment = await actions.order?.capture()
                    if (id) {
                      await updateOrderStatus(
                        [id],
                        order?.status === OrderStatus.BUYER_COMFIRM ? OrderStatus.COMPLETE : OrderStatus.ADMIN_COMFIRM,
                        undefined,
                        accessToken
                      )
                        .then((response) => {
                          if (response.status === 200) {
                            toast.success('Update Completed Successfully!')
                            getOrderDetails()
                          }
                        })
                        .catch((error: any) => {
                          toast.error(error.response.data.error.message)
                        })
                    }
                  }}
                  onCancel={() => {}}
                  onError={(err: any) => {
                    toast.error(err.response.data.error.message)
                  }}
                />
              </div>
              <span className='text-lg font-semibold text-white'>
                Pay and then {order.status === OrderStatus.BUYER_COMFIRM ? 'complete' : 'confirm'} the order.
              </span>
            </div>
          </div>
        )}
      <div>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>Order Detail</h2>
        <div className='grid grid-cols-3 gap-6'>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Code
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.name}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Gig
            </label>
            <button
              type='button'
              onClick={() => navigate(`/gig-detail/${order?.gig._id}`)}
              className='w-full px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'
            >
              {order?.gig.name}
            </button>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Service Fee
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.price && (order?.price / 105) * 5}$
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Buyer
            </label>
            <button
              type='button'
              onClick={() => navigate(`/user-detail/${order?.createdBy._id}`)}
              className='w-full px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'
            >
              {order?.createdBy.name}
            </button>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Package Type
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.type}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Gig Fee
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.price && (order?.price / 105) * 100}$
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Seller
            </label>
            <button
              type='button'
              onClick={() =>
                navigate(`/user-detail/${order && order.gig && order.gig.createdBy && order?.gig.createdBy._id}`)
              }
              className='w-full px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'
            >
              {order && order.gig && order.gig.createdBy && order?.gig.createdBy.name}
            </button>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Quantity
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.quantity}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Total Price
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.price}$
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Method
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.method}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Status
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.status}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Payment Id
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.paymentID}
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Due On
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {calculateTime(order?.dueOn)}
            </div>
          </div>
          <div className='w-full col-span-2'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Reason
            </label>
            <div className='px-1 py-2 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 bg-gray-50'>
              {order?.reason}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
