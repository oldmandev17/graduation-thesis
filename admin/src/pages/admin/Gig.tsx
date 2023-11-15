/* eslint-disable jsx-a11y/label-has-associated-control */
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import SearchCustom from 'components/common/SearchCustom'
import useDebounce from 'hooks/useDebounce'
import { GigStatus, IGig } from 'modules/gig'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { BiMailSend } from 'react-icons/bi'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'

function Gig() {
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const date = new Date()
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<GigStatus | null>(null)
  const [keyword, setKeyword] = useState<string>('')
  const keywordDebounce = useDebounce(keyword, 500)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const navigate = useNavigate()
  const { accessToken } = getToken()

  const getAllGigs = useCallback(async () => {}, [])

  useEffect(() => {
    getAllGigs()
  }, [getAllGigs])

  const handleCheckAll = () => {
    document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
      const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
      // eslint-disable-next-line no-param-reassign
      input.checked = checkedAll?.checked as boolean
    })
  }

  const getCheckedInputIds = () => {
    const checkedIds: string[] = []

    document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
      if (input.checked) {
        checkedIds.push(input.id)
      }
    })

    return checkedIds
  }

  const handleCheckElement = () => {
    const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
    if (checkedAll) {
      if (
        getCheckedInputIds().length ===
        document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').length
      ) {
        checkedAll.checked = true
      } else {
        checkedAll.checked = false
      }
    }
  }

  const handleSort = (sortByField: string) => {
    setSortBy(sortByField)
    if (sortByField === sortBy) {
      setOrderBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderBy('desc')
    }
  }

  const columns = [{ header: 'Name', key: 'name', width: 30 }]

  const handleUpdateStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (getCheckedInputIds().length < 1) {
      toast.warning('Select a row to edit, please.')
    } else {
      console.log(event)
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='inline-flex justify-end rounded-md shadow-sm' role='group'>
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <HiOutlineViewGridAdd className='w-[14px] h-[14px] mr-2' style={{ strokeWidth: '2.5' }} />
          Add User
        </button>
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <BiMailSend className='w-[16px] h-[16px] mr-2' style={{ strokeWidth: '1' }} />
          Send Mail
        </button>
        <button
          type='button'
          disabled={!gigs.length}
          onClick={() => generateExcel(columns, gigs, 'User Sheet', 'User')}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <svg
            className='w-3 h-3 mr-2'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z' />
            <path d='M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' />
          </svg>
          Exports
        </button>
      </div>
      <AccordionCustom title='Refine Users: Curate Your Records with Precision.'>
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-4 gap-10'>
            <div className='col-span-2'>
              <SearchCustom value={keyword} setValue={setKeyword} label='Search by name'>
                Search By Name
              </SearchCustom>
            </div>
          </div>
          <div className='grid grid-cols-4 gap-10'>
            <SelectCustom arrValue={arrUserStatus} label='Choose the status' value={status} setValue={setStatus}>
              Status
            </SelectCustom>
            <SelectCustom arrValue={arrLimits} label='Choose the dispaly limit' value={limit} setValue={setLimit}>
              Display Limit
            </SelectCustom>
          </div>
          <div className='grid grid-cols-4 gap-10'>
            <DateTimePickerCustom value={startDay} setValue={setStartDay} label='Choose the start day'>
              Start Day
            </DateTimePickerCustom>
            <DateTimePickerCustom value={endDay} setValue={setEndDay} label='Choose the end day'>
              End Day
            </DateTimePickerCustom>
            <div className='flex'>
              <div className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'>
                Update Status
              </div>
              <label htmlFor='states' className='sr-only'>
                update Status
              </label>
              <select
                id='states'
                onChange={handleUpdateStatus}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              >
                {arrUserStatus?.length &&
                  arrUserStatus.map((val, index) => (
                    <option key={val.value + index} value={val.value}>
                      {val.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </AccordionCustom>
    </div>
  )
}

export default Gig
