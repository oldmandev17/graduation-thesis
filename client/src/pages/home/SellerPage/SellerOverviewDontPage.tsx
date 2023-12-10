/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import { BsInfoCircle, BsWindowStack } from 'react-icons/bs'
import { MdCardMembership, MdPayment } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function SellerOverviewDontPage() {
  const navigate = useNavigate()

  const overviewDont = [
    {
      icon: <BsInfoCircle className='w-12 h-12 fill-gray-800' />,
      content: 'Providing any misleading or inaccurate information about your identity.'
    },
    {
      icon: <BsWindowStack className='w-12 h-12 fill-gray-800' />,
      content: 'Opening duplicate accounts. Remember, you can always create more Gigs.'
    },
    {
      icon: <MdCardMembership className='w-12 h-12 fill-gray-800' />,
      content: 'Soliciting other community members for work on Fiverr.'
    },
    {
      icon: <MdPayment className='w-12 h-12 fill-gray-800' />,
      content: 'Requesting to take communication and payment outside of Fiverr.'
    }
  ]

  return (
    <div>
      <div className='flex flex-row items-center gap-5 py-5 px-28 '>
        <img
          onClick={() => navigate('/')}
          src='/images/Fiverr-Logo.png'
          alt='logo'
          width='80'
          height='80'
          className='cursor-pointer'
        />
      </div>
      <Divider />
      <div className='grid grid-cols-3 gap-20 px-40 py-10'>
        <div>
          <img className='w-full' src='/seller_overview_dont.png' alt='Seller overview dont' />
        </div>
        <div className='flex items-center justify-center w-full col-span-2'>
          <div className='flex flex-col w-full gap-10'>
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
                    <span className='w-12 h-12'>{over.icon}</span>
                    <p className='text-gray-600 max-w-[200px]'>{over.content}</p>
                  </div>
                ))}
            </div>
            <div className='flex items-center gap-6'>
              <button
                className='px-5 py-2 text-lg font-semibold text-white bg-green-500 rounded-md'
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
    </div>
  )
}

export default SellerOverviewDontPage
