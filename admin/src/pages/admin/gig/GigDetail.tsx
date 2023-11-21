import React from 'react'

function GigDetail() {
  return (
    <div className='grid grid-cols-5 gap-10'>
      <div className='col-span-3 flex flex-col gap-8'>
        <nav
          className='flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
          aria-label='Breadcrumb'
        >
          <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
            <li className='inline-flex items-center'>
              <a
                href='/#'
                className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
              >
                <svg
                  className='w-3 h-3 me-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className='flex items-center'>
                <svg
                  className='rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <a
                  href='/#'
                  className='ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                >
                  Templates
                </a>
              </div>
            </li>
            <li aria-current='page'>
              <div className='flex items-center'>
                <svg
                  className='rtl:rotate-180  w-3 h-3 mx-1 text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <span className='ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400'>Flowbite</span>
              </div>
            </li>
          </ol>
        </nav>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-semibold dark:text-white'>Payments tool for companies</h2>
          <div className='flex items-center mb-4'>
            <img className='w-16 h-16 me-4 rounded-full' src='/docs/images/people/profile-picture-5.jpg' alt='' />
            <div className='font-medium dark:text-white'>
              <div className='flex items-center gap-5'>
                <span>Jese Leos</span>|<span className='text-sm text-gray-500 dark:text-gray-400'>@</span>
              </div>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-300 dark:text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 20'
                >
                  <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                </svg>
                <span>4,9</span>
                <span className='text-md text-gray-500 dark:text-gray-400 underline'>(123)</span>
              </div>
            </div>
          </div>
          <hr className='mx-10' />
          <div>image</div>
        </div>
        <div className='flex flex-col gap-4'>description</div>
        <div className='flex flex-col gap-4'>profile</div>
        <div className='flex flex-col gap-4'>package</div>
        <div className='flex flex-col gap-4'>faq</div>
        <div className='flex flex-col gap-4'>rating</div>
      </div>
      <div className='col-span-2'>1</div>
    </div>
  )
}

export default GigDetail
