import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

function DateTimePickerCustom({
  children,
  label,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  setValue
}: {
  children: any
  label: string
  value: any
  setValue: React.Dispatch<React.SetStateAction<any>>
}) {
  return (
    <div className='flex'>
      <div className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'>
        {children}
      </div>
      <label htmlFor='states' className='sr-only'>
        {label}
      </label>
      <div
        id='states'
        className='block w-full text-sm text-gray-900 border border-l-2 border-gray-300 rounded-r-lg bg-gray-50 border-l-gray-100 dark:border-l-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={dayjs(value)}
            onChange={(val) => setValue(val)}
            className='!w-full !text-inherit !h-full'
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default DateTimePickerCustom
