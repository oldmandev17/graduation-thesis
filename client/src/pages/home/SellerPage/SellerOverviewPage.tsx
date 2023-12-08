/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import React, { Fragment } from 'react'
import { BsShop } from 'react-icons/bs'
import { GiBookmark } from 'react-icons/gi'
import { PiUserCircle } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

function SellerOverviewPage() {
  const navigate = useNavigate()

  const overview = [
    {
      icon: <GiBookmark className='h-10 w-10 fill-gray-800' />,
      title: 'Learn what makes a successful profile',
      content: 'Discover the do’s and don’ts to ensure you’re always on the right track.'
    },
    {
      icon: <PiUserCircle className='h-10 w-10 fill-gray-800' />,
      title: 'Create your seller profile',
      content: 'Add your profile picture, description, and professional information.'
    },
    {
      icon: <BsShop className='h-10 w-10 fill-gray-800' />,
      title: 'Publish your Gig',
      content: 'Create a Gig of the service you’re offering and start selling instantly.'
    }
  ]

  return (
    <div className='grid grid-cols-2 gap-10 py-10 px-40'>
      <div className='flex flex-col gap-10'>
        <h4 className='text-2xl font-semibold text'>
          Ready to start selling on Freelancer?
          <br /> Here’s the breakdown:
        </h4>
        <div className='flex flex-col gap-3'>
          <Divider />
          {overview.length > 0 &&
            overview.map((over, index) => (
              <Fragment key={over.title + index}>
                <div className='flex gap-6'>
                  <span className='h-10 w-10'>{over.icon}</span>
                  <div>
                    <p className='font-semibold text-lg'>{over.title}</p>
                    <p className='text-gray-600'>{over.content}</p>
                  </div>
                </div>
                <Divider />
              </Fragment>
            ))}
        </div>
        <div>
          <button
            className='text-lg font-semibold bg-green-500 text-white py-2 px-5 rounded-md'
            type='button'
            onClick={() => navigate('/seller-onboarding/overview-do')}
          >
            Continune
          </button>
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <video className='w-[80%]' autoPlay muted controls>
          <source src='/seller_overview.mp4' type='video/mp4' />
        </video>
      </div>
    </div>
  )
}

export default SellerOverviewPage
