/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { BsShop } from 'react-icons/bs'
import { GiBookmark } from 'react-icons/gi'
import { PiUserCircle } from 'react-icons/pi'
import { SiFreelancer } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'

function SellerOverviewPage() {
  const navigate = useNavigate()

  const overview = [
    {
      icon: <GiBookmark className='w-10 h-10 fill-gray-800' />,
      title: 'Learn what makes a successful profile',
      content: 'Discover the do’s and don’ts to ensure you’re always on the right track.'
    },
    {
      icon: <PiUserCircle className='w-10 h-10 fill-gray-800' />,
      title: 'Create your seller profile',
      content: 'Add your profile picture, description, and professional information.'
    },
    {
      icon: <BsShop className='w-10 h-10 fill-gray-800' />,
      title: 'Publish your Gig',
      content: 'Create a Gig of the service you’re offering and start selling instantly.'
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
        <div className='grid grid-cols-2 gap-10 px-40 py-10'>
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
                      <span className='w-10 h-10'>{over.icon}</span>
                      <div>
                        <p className='text-lg font-semibold'>{over.title}</p>
                        <p className='text-gray-600'>{over.content}</p>
                      </div>
                    </div>
                    <Divider />
                  </Fragment>
                ))}
            </div>
            <div>
              <button
                className='px-5 py-2 text-lg font-semibold text-white bg-green-500 rounded-md'
                type='button'
                onClick={() => navigate('/seller-onboarding/overview-do')}
              >
                Continune
              </button>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <video className='w-[80%]' autoPlay muted controls>
              <source src='/seller_overview.mp4' type='video/mp4' />
            </video>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerOverviewPage
