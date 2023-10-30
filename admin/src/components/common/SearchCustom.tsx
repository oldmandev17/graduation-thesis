import React, { ChangeEvent } from 'react'

function SearchCustom({
  children,
  label,
  value,
  setValue
}: {
  children: any
  label: string
  value: any
  setValue: React.Dispatch<React.SetStateAction<any>>
}) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <div className='flex'>
      <div className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'>
        {children}
      </div>
      <label htmlFor='states' className='sr-only'>
        {label}
      </label>
      <div className='relative w-full h-[43px]'>
        <input
          type='text'
          className='h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='Search'
          value={value}
          onChange={handleInputChange}
        />
        <span className='absolute top-0 right-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          <svg
            className='w-4 h-4'
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
        </span>
      </div>
    </div>
  )
}

export default SearchCustom
