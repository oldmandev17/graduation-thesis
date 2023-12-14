/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async'
import { FaUserAlt } from 'react-icons/fa'

function AnalyticPage() {
  const totalOrder = 6

  return (
    <>
      <Helmet>
        <title>Analytics | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-5 py-10 px-28'>
        <span className='mb-4 text-4xl font-semibold text-gray-500 '>Analytics</span>
        <div className='flex flex-row w-full py-3 border border-gray-300 rounded-lg'>
          <div className='flex flex-col items-center justify-center w-full gap-2 border-r border-gray-300'>
            <span className='text-base font-semibold text-gray-600'>Earning to date</span>
            <span className='text-xl font-semibold text-gray-500'>$0</span>
          </div>
          <div className='flex flex-col items-center justify-center w-full gap-2'>
            <span className='text-base font-semibold text-gray-600'>Avg. selling price</span>
            <span className='text-xl font-semibold text-gray-500'>$0</span>
          </div>
          <div className='flex flex-col items-center justify-center w-full gap-2 border-l border-gray-300'>
            <span className='text-base font-semibold text-gray-600'>Orders completed</span>
            <span className='text-xl font-semibold text-gray-500'>0</span>
          </div>
        </div>
        <span className='text-xl font-semibold text-gray-500 '>Overview</span>
        <div>show the gap here! please</div>
        <div className='flex flex-col gap-3 p-4 mb-5 border border-gray-300 rounded-xl'>
          <div className='text-lg font-semibold text-gray-700'>Your Seller Level</div>
          <div className='flex flex-row items-center justify-center gap-2'>
            <span className='flex items-center justify-center w-16 h-16 bg-gray-400 rounded-full'>
              <FaUserAlt className='w-6 h-6 fill-gray-100' />
            </span>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                className='h-5 bg-[#00b14f] rounded'
                style={{ width: `${totalOrder >= 5 ? '100' : (totalOrder / 5) * 100}%` }}
              />
            </div>
            <div className='rounded-full h-16 w-16 bg-[#91d8d9] flex flex-col justify-center items-center text-xs text-white font-bold'>
              <span>LEVEL</span>
              <span> ONE</span>
            </div>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                style={{ width: `${totalOrder <= 5 ? '0' : totalOrder > 10 ? '100' : ((totalOrder - 5) / 5) * 100}%` }}
                className='h-5 bg-[#00b14f] rounded'
              />
            </div>
            <div className='rounded-full h-16 w-16  bg-[#deabf8] flex flex-col justify-center items-center text-xs text-white font-bold'>
              <span>LEVEL</span>
              <span> TWO</span>
            </div>
            <div className='w-[200px] h-5 bg-gray-200 rounded dark:bg-gray-500'>
              <div
                style={{
                  width: `${totalOrder <= 10 ? '0' : totalOrder > 15 ? '100' : ((totalOrder - 10) / 15) * 100}%`
                }}
                className='h-5 bg-[#00b14f] rounded'
              />
            </div>
            <img src='/image/top_rated.png' alt='top_rated' className='w-16 h-16' />
          </div>
        </div>
      </div>
    </>
  )
}

export default AnalyticPage
