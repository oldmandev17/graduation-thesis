/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { ChangeEvent } from 'react'

function SelectCustom({
  arrValue,
  children,
  label,
  value,
  setValue
}: {
  arrValue: Array<{ label: string; value: any }>
  children: any
  label: string
  value: any
  setValue: React.Dispatch<React.SetStateAction<any>>
}) {
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value === 'null' ? null : event.target.value)
  }

  return (
    <div className='flex'>
      <div className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'>
        {children}
      </div>
      <label htmlFor='states' className='sr-only'>
        {label}
      </label>
      <select
        id='states'
        value={value === null ? 'null' : value}
        onChange={handleSelectChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        <option value='null'>{label}</option>
        {arrValue?.length &&
          arrValue.map((val, index) => (
            <option key={val.value + index} value={val.value}>
              {val.label}
            </option>
          ))}
      </select>
    </div>
  )
}

export default SelectCustom
