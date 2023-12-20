/* eslint-disable no-underscore-dangle */
import { Button, Drawer } from '@mui/material'
import { IGig } from 'modules/gig'
import React, { useEffect, useState } from 'react'
import { LuMoveRight } from 'react-icons/lu'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'

function OrderButton({ type, gig }: { type: string; gig: IGig | undefined }) {
  const [show, setShow] = useState<boolean>(false)
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log('🚀 ~ file: OrderButton.tsx:15 ~ toggleDrawer ~ open:', open)
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setShow(open)
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
          <div className='flex w-full'>
            <span className='justify-center w-full'>Continune</span>
            <LuMoveRight className='justify-end mr-5 h-7 w-7 fill-white' />
          </div>
        )}
      </Button>
      <Drawer anchor='right' open={show} onClose={toggleDrawer(false)}>
        <button type='button' className='px-8 py-1 font-semibold text-white bg-black rounded-md w-52 hover:bg-gray-900'>
          Select
        </button>
      </Drawer>
    </>
  )
}

export default OrderButton
