/* eslint-disable react/no-array-index-key */
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { arrQA, arrStory } from 'assets/data'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { CiDeliveryTruck } from 'react-icons/ci'
import { IoCreateOutline } from 'react-icons/io5'
import { MdExpandMore, MdOutlinePaid } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const arrWork = [
  {
    icon: <IoCreateOutline className='w-16 h-16 text-gray-600' />,
    title: '1. Create a Gig',
    content: 'Sign up for free, set up your Gig, and offer your work to our global audience.'
  },
  {
    icon: <CiDeliveryTruck className='w-16 h-16 text-gray-600' />,
    title: '2. Deliver great work',
    content: 'Get notified when you get an order and use our system to discuss details with customers.'
  },
  {
    icon: <MdOutlinePaid className='w-16 h-16 text-gray-600' />,
    title: '3. Get paid',
    content: 'Get paid on time, every time. Payment is available for withdrawal as soon as it clears.'
  }
]

function BecomeSellerPage() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Start Sellig On Freelancer | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-10'>
        <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
          <div className='max-w-screen-xl px-4 py-24 mx-auto text-center lg:py-56'>
            <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl'>
              Work Your Way
            </h1>
            <p className='mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48'>
              You bring the skill. We'll make earning easy.
            </p>
            <div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0'>
              <button
                type='button'
                onClick={() => navigate('/seller-onboarding/overview')}
                className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-500'
              >
                Become a Seller
                <svg
                  className='w-3.5 h-3.5 ms-2 rtl:rotate-180'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5h12m0 0L9 1m4 4L9 9'
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        <div className='grid grid-cols-3 px-40 gap-x-28 py-10 bg-[#f7f7f7]'>
          <h2 className='text-3xl mb-5 text-[#424145] font-bold text-center col-span-3'>How it works</h2>
          {arrWork.map((work, index) => (
            <div key={index + work.title} className='flex flex-col items-center justify-center gap-3 ite'>
              <span>{work.icon}</span>
              <h3 className='text-2xl font-semibold text-gray-700'>{work.title}</h3>
              <p className='text-lg font-semibold text-center text-gray-600'>{work.content}</p>
            </div>
          ))}
        </div>
        <div className='px-40 gap-x-20 py-10 bg-[#f7f7f7]'>
          <h2 className='text-3xl mb-5 text-[#424145] font-bold text-center '>Buyer stories</h2>
          <div className='grid grid-cols-4'>
            {arrStory?.length &&
              arrStory.map((story, index) => (
                <Fragment key={story.content + index}>
                  {index < 2 ? (
                    <>
                      <figure>
                        <img className='w-full' src={`/banners/story${index + 1}.jpg`} alt='description' />
                      </figure>
                      <figcaption className='flex flex-col items-center justify-center h-full gap-5 p-5 px-4 text-lg text-gray-600'>
                        <p className='text-lg italic font-semibold'>{story.content}</p>
                        <span className='text-lg'>{story.author}</span>
                      </figcaption>
                    </>
                  ) : (
                    <>
                      <figcaption className='flex flex-col items-center justify-center h-full gap-5 p-5 px-4 text-lg text-gray-600'>
                        <p className='text-lg italic font-semibold'>{story.content}</p>
                        <span className='text-lg'>{story.author}</span>
                      </figcaption>
                      <figure>
                        <img className='w-full' src={`/banners/story${index + 1}.jpg`} alt='description' />
                      </figure>
                    </>
                  )}
                </Fragment>
              ))}
          </div>
        </div>
        <div className='grid grid-cols-2 px-40 gap-x-20 py-10 bg-[#f7f7f7]'>
          <h2 className='text-3xl mb-5 text-[#424145] font-bold text-center col-span-2'>Q&A</h2>
          {arrQA?.length &&
            arrQA.map((FAQ, index) => (
              <Accordion key={index} sx={{ boxShadow: 'none', paddingX: '10px', paddingY: '5px' }}>
                <AccordionSummary
                  expandIcon={<MdExpandMore className='w-7 h-7' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                  sx={{ padding: '0px' }}
                >
                  <Typography>{FAQ?.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{FAQ?.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
        <div className='flex flex-col items-center justify-center gap-5 pb-10'>
          <p className='text-xl font-semibold text-gray-600'>Sign up and create your first Gig totday</p>
          <button
            onClick={() => navigate('/seller-onboarding/overview')}
            type='button'
            className='px-10 py-2 text-xl font-semibold text-white bg-green-600 hover:bg-green-500 '
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  )
}

export default BecomeSellerPage
