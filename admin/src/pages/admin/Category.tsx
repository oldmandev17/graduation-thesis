/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import { deleteCategory, getAllCategory } from 'apis/api'
import { arrCategoryStatus, arrLimits } from 'assets/data'
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import DialogCustom from 'components/common/DialogCustom'
import SearchCustom from 'components/common/SearchCustom'
import SelectCustom from 'components/common/SelectCustom'
import useDebounce from 'hooks/useDebounce'
import { CategoryStatus, ICategory } from 'modules/category'
import React, { useCallback, useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'
import timeAgo from 'utils/timeAgo'

function Category() {
  const date = new Date()
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<CategoryStatus | null>(null)
  const [keyword, setKeyword] = useState<string>('')
  const keywordDebounce = useDebounce(keyword, 500)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState(20)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [arrayIds, setArrayIds] = useState<Array<string>>([])

  const { accessToken } = getToken()

  const getAllCategories = useCallback(async () => {
    endDay.setHours(0, 0, 0, 0)
    await getAllCategory(
      page,
      limit,
      status,
      keywordDebounce,
      sortBy,
      orderBy,
      startDay,
      new Date(endDay.getTime() + 24 * 60 * 60 * 1000),
      accessToken
    )
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data.categories)
          setCount(Math.ceil(response.data.filteredCount / limit))
          setFilteredCount(response.data.filteredCount)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDay, keywordDebounce, orderBy, sortBy, startDay, status, page, limit])

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  const handleCheckAll = () => {
    document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.checked = !input.checked // Toggle the checked state
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

  const [open, setOpen] = useState<boolean>(false)

  const handleDelete = async (arrIds: Array<string>) => {
    if (arrIds.length === 0) {
      toast.warning('Select a row to delete, please.')
    } else {
      setArrayIds(arrIds)
      setOpen(true)
    }
  }

  const handleConfirmDelete = async (arrIds: Array<string>) => {
    if (arrIds.length === 0) {
      toast.warning('Select a row to delete, please.')
    } else {
      await deleteCategory(arrIds, accessToken)
        .then((response) => {
          if (response.status === 204) {
            toast.success('Deletion Successful')
            getAllCategories()
            document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
              if (input) {
                // eslint-disable-next-line no-param-reassign
                input.checked = false
              }
            })
            const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
            if (checkedAll) {
              checkedAll.checked = false
            }
          }
        })
        .catch((error) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const handleCheckElement = () => {
    const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
    if (checkedAll) {
      if (getCheckedInputIds().length === categories.length) {
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

  return (
    <div className='flex flex-col gap-5'>
      <div className='inline-flex justify-end rounded-md shadow-sm' role='group'>
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <HiOutlineViewGridAdd className='w-[14px] h-[14px] mr-2' style={{ strokeWidth: '2.5' }} />
          Add Category
        </button>
        <button
          type='button'
          onClick={() => handleDelete(getCheckedInputIds())}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <BsTrash className='w-3 h-3 mr-2' style={{ strokeWidth: '0.5' }} />
          Delete
        </button>
        <button
          type='button'
          disabled={!categories.length}
          onClick={() => generateExcel(columns, categories, 'Log Sheet', 'Log')}
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
      <AccordionCustom title='Refine Categories: Curate Your Records with Precision.'>
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-3 gap-10'>
            <div className='col-span-2'>
              <SearchCustom value={keyword} setValue={setKeyword} label='Search by name'>
                Search By Name
              </SearchCustom>
            </div>
            <SelectCustom arrValue={arrCategoryStatus} label='Choose the status' value={status} setValue={setStatus}>
              Status
            </SelectCustom>
          </div>
          <div className='grid grid-cols-3 gap-10'>
            <DateTimePickerCustom value={startDay} setValue={setStartDay} label='Choose the start day'>
              Start Day
            </DateTimePickerCustom>
            <DateTimePickerCustom value={endDay} setValue={setEndDay} label='Choose the end day'>
              End Day
            </DateTimePickerCustom>
            <SelectCustom arrValue={arrLimits} label='Choose the dispaly limit' value={limit} setValue={setLimit}>
              Display Limit
            </SelectCustom>
          </div>
        </div>
      </AccordionCustom>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='p-4'>
                <div className='flex items-center'>
                  <input
                    onClick={handleCheckAll}
                    id='checkbox-all-search'
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label htmlFor='checkbox-all-search' className='sr-only'>
                    checkbox
                  </label>
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>
                  Name
                  <button type='button' onClick={() => handleSort('name')}>
                    <svg
                      className='w-3 h-3 ml-1.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                    </svg>
                  </button>
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>
                  Status
                  <button type='button' onClick={() => handleSort('status')}>
                    <svg
                      className='w-3 h-3 ml-1.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                    </svg>
                  </button>
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>
                  Created At
                  <button type='button' onClick={() => handleSort('createdAt')}>
                    <svg
                      className='w-3 h-3 ml-1.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                    </svg>
                  </button>
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Created By</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>
                  Updated At
                  <button type='button' onClick={() => handleSort('updatedAt')}>
                    <svg
                      className='w-3 h-3 ml-1.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                    </svg>
                  </button>
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Updated By</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length ? (
              categories.map((category: ICategory) => (
                <tr
                  key={category._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        onClick={handleCheckElement}
                        id={category._id}
                        name='checkbox-table-search'
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label htmlFor={category._id} className='sr-only'>
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                    {category.name}
                  </td>
                  <td className='px-6 py-4'>{category.status}</td>
                  <td className='px-6 py-4'>{timeAgo(new Date(category.createdAt))}</td>
                  <td className='px-6 py-4'>{category.createdBy.name}</td>
                  <td className='px-6 py-4'>{category?.updatedAt && timeAgo(new Date(category.updatedAt))}</td>
                  <td className='px-6 py-4'>{category && category.updatedBy?.name}</td>
                  <td className='flex items-center px-6 py-4 space-x-3'>
                    <span className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>Edit</span>
                    <span
                      onClick={() => handleDelete([category._id])}
                      className='font-medium text-red-600 cursor-pointer dark:text-red-500 hover:underline'
                    >
                      Remove
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        <nav className='flex items-center justify-between p-5' aria-label='Table navigation'>
          <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
            Showing{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>
              {`${filteredCount === 0 ? '0' : limit * (page - 1) + 1} - 
          ${
            limit * page < (filteredCount || categories.length) ? limit * page : filteredCount || categories.length
          }`}{' '}
            </span>{' '}
            of <span className='font-semibold text-gray-900 dark:text-white'>{filteredCount || categories.length}</span>
          </span>
          <ul className='inline-flex h-8 -space-x-px text-sm'>
            <li>
              <button
                type='button'
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || filteredCount < 1}
                className='flex items-center justify-center h-8 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              >
                Previous
              </button>
            </li>
            {new Array(count).fill(1).map((number, index) => (
              <li key={number + index}>
                <button
                  type='button'
                  onClick={() => setPage(index + 1)}
                  className={`flex items-center justify-center h-8 px-3 leading-tight ${
                    page !== index + 1
                      ? 'text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white'
                  } hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                type='submit'
                disabled={page === count || filteredCount < 1}
                onClick={() => setPage(page + 1)}
                className='flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <DialogCustom open={open} setOpen={setOpen} onAgree={() => handleConfirmDelete(arrayIds)} onCancel={() => {}} />
    </div>
  )
}

export default Category
