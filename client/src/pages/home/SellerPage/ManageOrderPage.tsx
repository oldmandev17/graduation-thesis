/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { Fade, Menu, MenuItem } from '@mui/material'
import { getAllOrderByUser } from 'apis/api'
import { arrOrderStatus } from 'assets/data'
import OrderStatusTag from 'components/common/OrderStatusTag'
import useDebounce from 'hooks/useDebounce'
import { IOrder, OrderStatus } from 'modules/order'
import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { IoIosArrowDown } from 'react-icons/io'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import calculateTime from 'utils/calculateTime'

function Row({ order }: { order: IOrder }) {
  const { user } = useAppSelector((state) => state.auth)
  const [anchorActionEl, setAnchorActionEl] = useState<null | HTMLElement>(null)
  const openAction = Boolean(anchorActionEl)
  const navigate = useNavigate()

  const handleClickAction = (event: MouseEvent<HTMLElement>) => {
    setAnchorActionEl(event.currentTarget)
  }
  const handleCloseAction = () => {
    setAnchorActionEl(null)
  }

  return (
    <>
      <td className='p-4 text-sm font-medium text-gray-500'>{order.name}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{order.createdBy.name}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{order.gig.name}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{calculateTime(order.dueOn)}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{order.quantity}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>${order.price}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>
        <OrderStatusTag status={order.status} />
      </td>
      <td>
        <button
          type='button'
          id='action'
          aria-controls={openAction ? 'fade-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={openAction ? 'true' : undefined}
          onClick={handleClickAction}
          className='px-2 py-1 border border-gray-300'
        >
          <IoIosArrowDown className='cursor-pointer' />
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
              navigate(`/user/${user?.id}/orders/${order?._id}`)
              handleCloseAction()
            }}
          >
            View
          </MenuItem>
          <MenuItem
            className='!pr-20 !py-2'
            onClick={() => {
              navigate(`/user/${user?.id}/messages?to=${order.createdBy.id}`)
              handleCloseAction()
            }}
          >
            Send Message
          </MenuItem>
        </Menu>
      </td>
    </>
  )
}

function ManageOrderPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { accessToken } = getToken()
  const [keyword, setKeyword] = useState<string>('')
  const keywordDebounce = useDebounce(keyword, 500)
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const [status, setStatus] = useState<OrderStatus | undefined>()
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const getAllOrderByUsers = useCallback(async () => {
    await getAllOrderByUser(accessToken, status, keywordDebounce, sortBy, orderBy, 'seller')
      .then((response) => {
        if (response.status === 200) {
          setOrders(response.data.orders)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken, status, sortBy, orderBy, keywordDebounce])

  useEffect(() => {
    getAllOrderByUsers()
  }, [getAllOrderByUsers])

  const handleSort = (sortByField: string) => {
    setSortBy(sortByField)
    if (sortByField === sortBy) {
      setOrderBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderBy('desc')
    }
  }

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  return (
    <>
      <Helmet>
        <title>Manage Sales | Freelancer</title>
      </Helmet>
      <div className='flex flex-col h-screen gap-5 py-10 px-28'>
        <div className='flex flex-row justify-between'>
          <span className='text-4xl font-semibold text-gray-600'>Manage Orders</span>
          <input
            type='text'
            onChange={handleChangeKeyword}
            className='w-1/4 h-12 py-0 pl-5 text-lg text-gray-900 border border-gray-300 rounded-lg border-1 focus:rounded-none'
            placeholder='Type the order code'
          />
        </div>
        <div>
          <table className='w-full my-5 bg-white'>
            <thead>
              <tr className='bg-gray-100 border border-gray-300'>
                <th className='py-5 text-base font-semibold text-gray-400'>CODE</th>
                <th className='py-5 text-base font-semibold text-gray-400'>BUYER</th>
                <th className='py-5 text-base font-semibold text-gray-400'>GIG</th>
                <th
                  className='flex items-center justify-center gap-2 py-5 text-base font-semibold text-gray-400 cursor-pointer'
                  onClick={() => handleSort('dueOn')}
                >
                  DUE ON
                  {sortBy === 'dueOn' &&
                    (orderBy === 'desc' ? (
                      <TiArrowSortedDown className='w-5 h-5' />
                    ) : (
                      <TiArrowSortedUp className='w-5 h-5' />
                    ))}
                </th>
                <th className='py-5 text-base font-semibold text-gray-400'>QUANTITY</th>
                <th className='py-5 text-base font-semibold text-gray-400'>TOTAL PRICE</th>
                <th>
                  <div className='flex flex-row items-center justify-center gap-2 font-semibold text-gray-400'>
                    <span>STATUS</span>
                    <button
                      type='button'
                      id='filter'
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      <IoIosArrowDown className='cursor-pointer' />
                    </button>
                    <Menu
                      id='fade-menu'
                      MenuListProps={{
                        'aria-labelledby': 'filter'
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}
                    >
                      <MenuItem
                        className='!pr-20 !py-2'
                        onClick={() => {
                          setStatus(undefined)
                          handleClose()
                        }}
                      >
                        All
                      </MenuItem>
                      {arrOrderStatus.length > 0 &&
                        arrOrderStatus.map((sta, index) => (
                          <MenuItem
                            key={sta.label + index}
                            className='!pr-20 !py-2'
                            onClick={() => {
                              setStatus(sta.value)
                              handleClose()
                            }}
                          >
                            {sta.label}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                </th>
                <th className='py-5 text-base font-semibold text-gray-500'> </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders.map((order, index) => (
                  <tr key={order._id + index} className='p-3 text-center border-b border-gray-300 border-x'>
                    <Row order={order} />
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ManageOrderPage
