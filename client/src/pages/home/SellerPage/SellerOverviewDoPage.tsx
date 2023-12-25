/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { BsPersonVcard } from 'react-icons/bs'
import { LiaNewspaper, LiaUserPlusSolid } from 'react-icons/lia'
import { SiFreelancer } from 'react-icons/si'
import { TfiLock } from 'react-icons/tfi'
import { VscLink } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

function SellerOverviewDoPage() {
  const navigate = useNavigate()

  const overviewDo = [
    {
      icon: <BsPersonVcard className='w-12 h-12 fill-gray-800' />,
      content: 'Take your time in creating your profile so it’s exactly as you want it to be.'
    },
    {
      icon: <VscLink className='w-12 h-12 fill-gray-800' />,
      content: 'Add credibility by linking out to your relevant professional networks.'
    },
    {
      icon: <LiaNewspaper className='w-12 h-12 fill-gray-800' />,
      content: 'Accurately describe your professional skills to help you get more work.'
    },
    {
      icon: <LiaUserPlusSolid className='w-12 h-12 fill-gray-800' />,
      content: 'Put a face to your name! Upload a profile picture that clearly shows your face.'
    },
    {
      icon: <TfiLock className='w-12 h-12 fill-gray-800' />,
      content: 'To keep our community secure for everyone, we may ask you to verify your ID.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Seller Overview | Freelancer</title>
      </Helmet>
      <div>
        <div className='flex flex-row items-center gap-5 py-5 px-28 '>
          <SiFreelancer onClick={() => navigate('/')} className='w-12 h-12 cursor-pointer fill-green-600' />
        </div>
        <Divider />
        <div className='grid grid-cols-3 gap-20 px-40 py-10'>
          <div>
            <img src='/seller_overview_do.png' className='w-full' alt='Seller overview do' />
          </div>
          <div className='flex items-center justify-center w-full col-span-2'>
            <div className='flex flex-col w-full gap-10'>
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
                      <span className='w-12 h-12'>{over.icon}</span>
                      <p className='text-gray-600 max-w-[200px]'>{over.content}</p>
                    </div>
                  ))}
              </div>
              <div className='flex items-center gap-6'>
                <button
                  className='px-5 py-2 text-lg font-semibold text-white bg-green-500 rounded-md'
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
      </div>
    </>
  )
}

export default SellerOverviewDoPage
