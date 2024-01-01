/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { Accordion, AccordionDetails, AccordionSummary, Button, Drawer } from '@mui/material'
import axios from 'axios'
import { useMessage } from 'contexts/StateContext'
import { GigPackageType, IGig, Package } from 'modules/gig'
import React, { useEffect, useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'
import { HiRefresh } from 'react-icons/hi'
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io'
import { LuMoveRight } from 'react-icons/lu'
import { MdExpandMore } from 'react-icons/md'
import { TfiPackage } from 'react-icons/tfi'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'

function OrderButton({ type, gig, pack }: { type: string; gig: IGig | undefined; pack: Package | undefined }) {
  const [show, setShow] = useState<boolean>(false)
  const { user } = useAppSelector((state) => state.auth)
  const { handleAddOrder } = useMessage()
  const location = useLocation()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState<number>(1)

  const handleIncrement = () => {
    if (quantity === 10) return
    setQuantity((quan) => quan + 1)
  }

  const handleDecrement = () => {
    if (quantity === 1) return
    setQuantity((quan) => quan - 1)
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setShow(open)
  }

  const handleContinune = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_URL_SERVER}/api/order/create-payment-intent?amount=${(
          ((pack && pack.price) || 1) *
          quantity *
          1.05
        ).toFixed(2)}`
      )
      .then((response) => {
        if (response.status === 200) {
          handleAddOrder({ gig, quantity, pack })
          navigate(`/user/${user?.id}/checkout?paymentID=${response.data.clientSecret}`)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  useEffect(() => {
    if (!user) {
      navigate('/auth/login')
      localStorage.setItem('redirect', String(location.pathname))
    }
  }, [location.pathname, navigate, user])

  if (user?._id === gig?.createdBy?._id) return null

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        className='!capitalize !w-full !mt-3 !p-2 !text-lg !font-semibold !text-white !bg-black !rounded-lg'
      >
        {type === 'select' ? (
          <>Select</>
        ) : (
          <div className='flex w-full p-1'>
            <span className='justify-center w-full'>Continune</span>
            <LuMoveRight className='justify-end mr-5 h-7 w-7 fill-white' />
          </div>
        )}
      </Button>
      <Drawer anchor='right' open={show} onClose={toggleDrawer(false)}>
        <div className='flex flex-col w-[450px] relative h-screen'>
          <div className='flex justify-between p-5'>
            <span className='text-xl font-semibold'>Order Options</span>
            <button onClick={toggleDrawer(false)} type='button'>
              <GrClose className='w-5 h-5' />
            </button>
          </div>
          <hr />
          <div className='flex flex-col gap-10 p-5 mb-32 overflow-y-auto'>
            <div className='flex flex-col gap-3 p-4 border-2 border-black rounded-lg'>
              <div className='flex justify-between'>
                <span className='text-xl font-semibold capitalize'>{pack && pack.type}</span>
                <span className='text-xl font-semibold'>${pack && pack.price}</span>
              </div>
              <p className='text-lg text-gray-600'>
                <span className='font-semibold text-black'>{pack && pack.name}</span> {pack && pack.description}
              </p>
              <hr />
              <div className='flex justify-between text-lg font-medium'>
                <span>Gig Quantity</span>
                <div className='flex gap-3'>
                  <button type='button' onClick={handleDecrement}>
                    <IoIosRemoveCircleOutline className='w-8 h-8 text-gray-600' />
                  </button>
                  <span className='w-4 text-lg font-semibold text-center text-gray-600'>{quantity}</span>
                  <button type='button' onClick={handleIncrement}>
                    <IoIosAddCircleOutline className='w-8 h-8 text-gray-600' />
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-3 p-4 bg-gray-100 rounded-lg'>
              <span className='text-2xl font-semibold'>${quantity * ((pack && pack.price) || 1)}</span>
              <hr />
              <Accordion sx={{ boxShadow: 'none' }} className='!bg-transparent'>
                <AccordionSummary
                  expandIcon={<MdExpandMore className='w-7 h-7' />}
                  aria-controls='panel2a-content'
                  id='panel2a-header'
                  sx={{ padding: '0px' }}
                >
                  <div className='flex items-center gap-3 text-lg font-semibold'>
                    <TfiPackage className='w-6 h-6 ' />
                    <span>
                      {pack && pack.type === GigPackageType.BASIC
                        ? 'Basic'
                        : pack && pack.type === GigPackageType.STANDARD
                        ? 'Standard'
                        : 'Premium'}{' '}
                      package {quantity > 1 && `(x${quantity})`}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {pack &&
                    pack.features &&
                    pack.features
                      .filter((pa) => pa.status === true)
                      .map((pa, index) => (
                        <div className='text-lg font-semibold py-0.5 pl-3' key={index}>
                          {pa && pa.name}
                        </div>
                      ))}
                </AccordionDetails>
              </Accordion>
              <div className='flex items-center gap-3 -mt-3 text-lg font-semibold'>
                <FaRegClock className='w-6 h-6 ' />
                <span>
                  {pack && pack.deliveryTime}-day{((pack && pack.deliveryTime) || 0) > 1 && 's'} delivery
                </span>
              </div>
              <div className='flex items-center gap-3 text-lg font-semibold'>
                <HiRefresh className='w-6 h-6 ' />
                <span>{pack && pack.revisions === 999 ? 'Unlimited' : pack?.revisions} revisions</span>
              </div>
            </div>
          </div>
          <div className='absolute bottom-0 w-full bg-white'>
            <hr />
            <div className='flex flex-col gap-3 p-5'>
              <button
                onClick={handleContinune}
                className='w-full p-3 text-lg font-semibold text-white bg-black rounded-lg'
                type='button'
              >
                Continune (${((pack && pack.price) || 1) * quantity})
              </button>
              <span className='text-center'>You won’t be charged yet</span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default OrderButton
