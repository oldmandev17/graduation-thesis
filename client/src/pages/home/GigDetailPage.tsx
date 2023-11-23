import React from 'react'
import { IoHomeOutline } from 'react-icons/io5'
import { FaStar, FaCheck, FaRegClock } from 'react-icons/fa'
import Fancybox from 'components/Fancybox'
import Carousel from 'components/Carousel'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { MdExpandMore } from 'react-icons/md'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { HiRefresh } from 'react-icons/hi'

function GigDetailPage() {
  const [value, setValue] = React.useState(1)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <div className='grid grid-cols-5 gap-20 py-10 px-32'>
      <div className='flex gap-10 flex-col col-span-3'>
        <div id='path' className='flex flex-row gap-2 mb-3'>
          <IoHomeOutline className='h-5 w-5' />
          <span className='text-sm text-gray-400 font-semibold'>/</span>
          <span className='text-base '>Category</span>
          <span className='text-sm text-gray-400 font-semibold'>/</span>
          <span className='text-base '>Sub-category</span>
        </div>
        <div id='gig_title' className='text-2xl font-bold text-gray-700'>
          I will do a subtle minimalist logo design
        </div>
        <div id='summary' className='flex flex-row gap-4 items-center'>
          <img src='/image/roses.jpg' alt='avata' className='h-14 w-14 rounded-full' />
          <div className='flex flex-col gap-1'>
            <div id='userInfor' className='flex flex-row gap-1'>
              <span className='text-base font-bold text-gray-700'>Ruby Jane</span>
              <span className='text-base font-semibold text-gray-400'>@id_user</span>
            </div>
            <span className='flex flex-row gap-1 items-center'>
              <FaStar className='h-4 w-4 fill-gray-900' />
              <span className='text-gray-900 text-base font-semibold'>5</span>
              <span className='text-base text-gray-500 font-semibold  cursor-pointer'>(627)</span>
            </span>
          </div>
        </div>
        <div id='image'>
          <Fancybox
            // Sample options
            options={{
              Carousel: {
                infinite: false
              }
            }}
          >
            <Carousel
              // Sample options
              options={{ infinite: false }}
            >
              <div
                className='f-carousel__slide'
                data-fancybox='gallery'
                data-src='https://lipsum.app/id/60/1600x1200'
                data-thumb-src='https://lipsum.app/id/60/200x150'
              >
                <img alt='' src='https://lipsum.app/id/60/400x300' width='400' height='300' />
              </div>
              <div
                className='f-carousel__slide'
                data-fancybox='gallery'
                data-src='https://lipsum.app/id/61/1600x1200'
                data-thumb-src='https://lipsum.app/id/61/200x150'
              >
                <img alt='' src='https://lipsum.app/id/61/400x300' width='400' height='300' />
              </div>
              <div
                className='f-carousel__slide'
                data-fancybox='gallery'
                data-src='https://lipsum.app/id/62/1600x1200'
                data-thumb-src='https://lipsum.app/id/62/200x150'
              >
                <img alt='' src='https://lipsum.app/id/62/400x300' width='400' height='300' />
              </div>
              <div
                className='f-carousel__slide'
                data-fancybox='gallery'
                data-src='https://lipsum.app/id/63/1600x1200'
                data-thumb-src='https://lipsum.app/id/63/200x150'
              >
                <img alt='' src='https://lipsum.app/id/63/400x300' width='400' height='300' />
              </div>
              <div
                className='f-carousel__slide'
                data-fancybox='gallery'
                data-src='https://lipsum.app/id/64/1600x1200'
                data-thumb-src='https://lipsum.app/id/64/200x150'
              >
                <img alt='' src='https://lipsum.app/id/64/400x300' width='400' height='300' />
              </div>
            </Carousel>
          </Fancybox>
        </div>
        <div id='gig_about' className='flex flex-col gap-5'>
          <span className='text-2xl font-bold text-gray-700'>About this gig</span>
          <span className='text-base font-medium text-gray-600'>
            If you're seeking a logo that embodies the essence of your brand through clean and minimalistic design,
            while still leaving a lasting impression, you've come to the right place. I specialize in creating visually
            compelling logos that convey your brand's message with precision and effectiveness. By employing sleek
            lines, strategic typography, and thoughtful simplicity, I'll craft a logo that speaks volumes while
            maintaining an elegant and timeless aesthetic.
            <br />
            With me, you'll not only receive a stunning logo but also full ownership rights, ensuring that your brand's
            identity remains exclusively yours. I prioritize excellent communication, actively involving you in the
            design process, listening to your ideas, providing regular updates and video call. Together, we'll create a
            logo that surpasses expectations and has the potential to skyrocket your business.
          </span>
        </div>
        <div id='gig_package_compare' className='flex flex-col gap-5'>
          <span className='text-2xl font-bold text-gray-700'>Compare packages</span>
          <table className=' border-slate-300 w-full max-w-3xl'>
            <thead>
              <tr className='bg-white border'>
                <th className=' text-gray-500 font-normal semibold p-5'>
                  <span className='text-base text-left'>Package</span>
                </th>
                <th className=' gap-2 border border-slate-300 text-gray-600  text-left p-5'>
                  <p className=' pt-1 text-xl font-normal'>120$ </p>
                  <p className='pt-1 text-xl font-bold'> Basic </p>
                  <p className='pt-1 text-sm font-semibold uppercase'> Basic</p>
                  <p className='pt-1 text-sm font-normal'>
                    1 logo concept including vector & source files + 3 revisions
                  </p>
                </th>
                <th className=' gap-2 border border-slate-300 text-gray-600  text-left p-5'>
                  <p className=' pt-1 text-xl font-normal'>220$ </p>
                  <p className='pt-1 text-xl font-bold'> Standard </p>
                  <p className='pt-1 text-sm font-semibold uppercase'> Standard</p>
                  <p className='pt-1 text-sm font-normal'>
                    1 logo concept including vector & source files + 3 revisions
                  </p>
                </th>
                <th className=' gap-2 border border-slate-300 text-gray-600  text-left p-5'>
                  <p className=' pt-1 text-xl font-normal'>320$ </p>
                  <p className='pt-1 text-xl font-bold'> Premium </p>
                  <p className='pt-1 text-sm font-semibold uppercase'> Premium</p>
                  <p className='pt-1 text-sm font-normal'>
                    1 logo concept including vector & source files + 3 revisions
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='text-base text-left p-2 text-gray-500  border border-slate-300'> Logo transparency</td>
                <td className=' border border-slate-300 p-5'>
                  <FaCheck className='h-5 w-5' />
                </td>
                <td className='p-5 border border-slate-300 '>
                  <FaCheck className='h-5 w-5' />
                </td>
                <td className='p-5 border border-slate-300 '>
                  <FaCheck className='h-5 w-5' />
                </td>
              </tr>
              <tr>
                <td className='text-base text-left p-2 text-gray-500  border border-slate-300'> Revisions</td>
                <td className='p-5 border border-slate-300 '>1</td>
                <td className='p-5 border border-slate-300 '>1</td>
                <td className='p-5 border border-slate-300 '>1</td>
              </tr>

              <tr className='text-gray-600'>
                <td className='text-base text-left text-gray-500 p-2 border border-slate-300'> Delivery Time</td>
                <td className='p-5 border border-slate-300 '>4 days</td>
                <td className='p-5 border border-slate-300 '>6 days</td>
                <td className='p-5 border border-slate-300 '>7 days</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className='text-gray-600 text-lg '>
                <td className=' border-slate-300 border border-b-0'> </td>
                <td className='p-5 border border-slate-300 border-b-0 '>120$</td>
                <td className='p-5 border border-slate-300  border-b-0'>220$</td>
                <td className='p-5 border border-slate-300 border-b-0'>320$</td>
              </tr>
              <tr className='text-gray-600 text-lg '>
                <td className='border border-slate-300 border-t-0 '> </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
                <td className='p-5 border border-slate-300 border-t-0 text-center'>
                  <button
                    type='button'
                    className='bg-black rounded-md px-8 py-1 text-white font-semibold hover:bg-gray-900'
                  >
                    Select
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div id='gig_faq' className='flex flex-col'>
          <span className='text-2xl font-bold text-gray-700'>FAQ</span>
          <Accordion sx={{ boxShadow: 'none' }}>
            <AccordionSummary
              expandIcon={<MdExpandMore className='w-7 h-7' />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              sx={{ padding: '0px' }}
            >
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <hr />
        </div>
        <div id='gig_faq' className='flex flex-col'>
          <span className='text-2xl font-bold text-gray-700'>Reviews</span>

          <div className='flex items-center mb-2'>
            <svg
              className='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-gray-300 me-1 dark:text-gray-500'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>4.95</p>
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>out of</p>
            <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>5</p>
          </div>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>1,745 global ratings</p>
          <div className='flex items-center mt-2'>
            <span className='text-base font-medium  dark:text-blue-500 hover:underline'>5 star</span>
            <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
              <div className='h-3 bg-gray-500 rounded' style={{ width: '70%' }} />
            </div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>70%</span>
          </div>
          <div className='flex items-center mt-2'>
            <span className='text-base font-medium  dark:text-blue-500 hover:underline'>4 star</span>
            <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
              <div className='h-3 bg-gray-500 rounded' style={{ width: '17%' }} />
            </div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>17%</span>
          </div>
          <div className='flex items-center mt-2'>
            <span className='text-base font-medium  dark:text-blue-500 hover:underline'>3 star</span>
            <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
              <div className='h-3 bg-gray-500 rounded' style={{ width: '8D%' }} />
            </div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>8%</span>
          </div>
          <div className='flex items-center mt-2'>
            <span className='text-base font-medium  dark:text-blue-500 hover:underline'>2 star</span>
            <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
              <div className='h-3 bg-gray-500 rounded' style={{ width: '4%' }} />
            </div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>4%</span>
          </div>
          <div className='flex items-center mt-2'>
            <span className='text-base font-medium  dark:text-blue-500 hover:underline'>1 star</span>
            <div className='w-2/4 h-3 mx-4 bg-gray-200 rounded dark:bg-gray-700'>
              <div className='h-3 bg-gray-500 rounded' style={{ width: '1%' }} />
            </div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>1%</span>
          </div>
        </div>

        <div className='relative w-1/2'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
          </div>
          <input
            type='search'
            id='default-search'
            className='block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search Mockups, Logos...'
          />
          <button
            type='submit'
            className='text-white absolute end-2.5 bottom-1 bg-gray-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Search
          </button>
        </div>
        <article>
          <div className='flex items-center mb-4'>
            <img className='w-10 h-10 me-4 rounded-full' src='/docs/images/people/profile-picture-5.jpg' alt='' />
            <div className='font-medium dark:text-white'>
              <p>
                Jese Leos{' '}
                <time dateTime='2014-08-16 19:00' className='block text-sm text-gray-500 dark:text-gray-400'>
                  Joined on August 2014
                </time>
              </p>
            </div>
          </div>
          <div className='flex items-center mb-1 space-x-1 rtl:space-x-reverse'>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <svg
              className='w-4 h-4 text-gray-300 dark:text-gray-500'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <h3 className='ms-2 text-sm font-semibold text-gray-900 dark:text-white'>Thinking to buy another one!</h3>
          </div>
          <footer className='mb-5 text-sm text-gray-500 dark:text-gray-400'>
            <p>
              Reviewed in the United Kingdom on <time dateTime='2017-03-03 19:00'>March 3, 2017</time>
            </p>
          </footer>
          <p className='mb-2 text-gray-500 dark:text-gray-400'>
            This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and
            the first thing I did was set the time, popped on an identical strap from another Invicta and went in the
            shower with it to test the waterproofing.... No problems.
          </p>
          <p className='text-gray-500 dark:text-gray-400'>
            It is obviously not the same build quality as those very expensive watches. But that is like comparing a
            Citroën to a Ferrari. This watch was well under £100! An absolute bargain.
          </p>
        </article>
        <hr />
      </div>

      <div className='col-span-2'>
        <Box className='border border-gray-300' sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={String(value)}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList className='bg-gray-50' onChange={handleChange} aria-label='lab API tabs example'>
                <Tab className='!font-bold' label='Basic' value='1' />
                <Tab className='!font-bold ' label='Standard' value='2' />
                <Tab className='!font-bold ' label='Premium' value='3' />
              </TabList>
            </Box>
            <TabPanel className='flex flex-col gap-2' value='1'>
              <span className='font-bold text-2xl text-gray-600'>$120</span>
              <p className='text-gray-600'>
                <span className='font-bold uppercase text-gray-600'>BASIC </span>1 logo concept including vector &
                source files + 3 revisions
              </p>
              <div className='flex flex-row gap-3'>
                <div className='flex flex-row gap-2  items-center text-gray-600'>
                  <FaRegClock />
                  <span className='font-medium'>4 Days Delivery</span>
                </div>
                <div className='flex flex-row gap-2  items-center text-gray-600'>
                  <HiRefresh className='h-5 w-5' />
                  <span className='font-medium'>3 Revisions</span>
                </div>
              </div>
              <div className='flex flex-col '>
                <div className='flex flex-row gap-2 items-center'>
                  <FaCheck className='h-4 w-4 fill-gray-600' />
                  <span className='text-gray-600'>gssdf</span>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <FaCheck className='h-4 w-4 fill-gray-600' />
                  <span className='text-gray-600'>gssdf</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel value='2'>Item Two</TabPanel>
            <TabPanel value='3'>Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  )
}

export default GigDetailPage
