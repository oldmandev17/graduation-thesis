/* eslint-disable react/no-array-index-key */
import React from 'react'
import { BsInfoCircle, BsWindowStack } from 'react-icons/bs'
import { MdCardMembership, MdPayment } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function SellerOverviewDontPage() {
  const navigate = useNavigate()

  const overviewDont = [
    {
      icon: <BsInfoCircle className='h-12 w-12 fill-gray-800' />,
      content: 'Providing any misleading or inaccurate information about your identity.'
    },
    {
      icon: <BsWindowStack className='h-12 w-12 fill-gray-800' />,
      content: 'Opening duplicate accounts. Remember, you can always create more Gigs.'
    },
    {
      icon: <MdCardMembership className='h-12 w-12 fill-gray-800' />,
      content: 'Soliciting other community members for work on Fiverr.'
    },
    {
      icon: <MdPayment className='h-12 w-12 fill-gray-800' />,
      content: 'Requesting to take communication and payment outside of Fiverr.'
    }
  ]

  return (
    <div className='grid grid-cols-3 gap-20 py-10 px-40'>
      <div>
        <img className='w-full' src='/seller_overview_dont.png' alt='Seller overview dont' />
      </div>
      <div className='flex justify-center items-center col-span-2 w-full'>
        <div className='flex flex-col gap-10 w-full'>
          <div className='flex flex-col gap-3'>
            <h4 className='text-2xl font-semibold text'>What makes a successful Freelancer profile?</h4>
            <p className='text-gray-600'>
              Your first impression matters! Create a profile that will stand out from the crowd on Freelancer.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            {overviewDont.length > 0 &&
              overviewDont.map((over, index) => (
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
              onClick={() => navigate('/seller-onboarding/personal-info')}
            >
              Continune
            </button>
            <button
              className='text-lg text-blue-600'
              type='button'
              onClick={() => navigate('/seller-onboarding/overview-do')}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerOverviewDontPage
