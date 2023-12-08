/* eslint-disable react/no-array-index-key */
import React from 'react'
import { BsPersonVcard } from 'react-icons/bs'
import { VscLink } from 'react-icons/vsc'
import { LiaNewspaper, LiaUserPlusSolid } from 'react-icons/lia'
import { TfiLock } from 'react-icons/tfi'
import { useNavigate } from 'react-router-dom'

function SellerOverviewDoPage() {
  const navigate = useNavigate()

  const overviewDo = [
    {
      icon: <BsPersonVcard className='h-12 w-12 fill-gray-800' />,
      content: 'Take your time in creating your profile so it’s exactly as you want it to be.'
    },
    {
      icon: <VscLink className='h-12 w-12 fill-gray-800' />,
      content: 'Add credibility by linking out to your relevant professional networks.'
    },
    {
      icon: <LiaNewspaper className='h-12 w-12 fill-gray-800' />,
      content: 'Accurately describe your professional skills to help you get more work.'
    },
    {
      icon: <LiaUserPlusSolid className='h-12 w-12 fill-gray-800' />,
      content: 'Put a face to your name! Upload a profile picture that clearly shows your face.'
    },
    {
      icon: <TfiLock className='h-12 w-12 fill-gray-800' />,
      content: 'To keep our community secure for everyone, we may ask you to verify your ID.'
    }
  ]

  return (
    <div className='grid grid-cols-3 gap-20 py-10 px-40'>
      <div>
        <img src='/seller_overview_do.png' className='w-full' alt='Seller overview do' />
      </div>
      <div className='flex justify-center items-center col-span-2 w-full'>
        <div className='flex flex-col gap-10 w-full'>
          <div className='flex flex-col gap-3'>
            <h4 className='text-2xl font-semibold text'>What makes a successful Freelancer profile?</h4>
            <p className='text-gray-600'>
              Your first impression matters! Create a profile that will stand out from the crowd on Freelancer.
            </p>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            {overviewDo.length > 0 &&
              overviewDo.map((over, index) => (
                <div className='flex flex-col gap-3' key={over.content + index}>
                  <span className='h-12 w-12'>{over.icon}</span>
                  <p className='text-gray-600 max-w-[200px]'>{over.content}</p>
                </div>
              ))}
          </div>
          <div className='flex items-center gap-6'>
            <button
              className='text-lg font-semibold bg-green-500 text-white py-2 px-5 rounded-md'
              type='button'
              onClick={() => navigate('/seller-onboarding/overview-dont')}
            >
              Continune
            </button>
            <button
              className='text-lg text-blue-600'
              type='button'
              onClick={() => navigate('/seller-onboarding/overview')}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerOverviewDoPage
