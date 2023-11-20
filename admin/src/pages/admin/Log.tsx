/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { deleteLog, getAllLog } from 'apis/api'
import { arrLimits, arrLogMethods, arrLogNames, arrLogStatus } from 'assets/data'
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import DialogCustom from 'components/common/DialogCustom'
import ModalCustom from 'components/common/ModalCustom'
import SelectCustom from 'components/common/SelectCustom'
import { ILog, LogMethod, LogName, LogStatus } from 'modules/log'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'
import sortByField from 'utils/sortByField'
import timeAgo from 'utils/timeAgo'

function Log() {
  const date = new Date()
  const [logs, setLogs] = useState<Array<ILog>>([])
  const [logDetail, setLogDetail] = useState<ILog>()
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<LogStatus | null>(null)
  const [method, setMethod] = useState<LogMethod | null>(null)
  const [name, setName] = useState<LogName | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState(20)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [arrayIds, setArrayIds] = useState<Array<string>>([])

  const { accessToken } = getToken()

  const getAllLogs = useCallback(async () => {
    const adjustedStartDay = new Date(startDay)
    adjustedStartDay.setHours(0, 0, 0, 0)
    const adjustedEndDay = new Date(endDay)
    adjustedEndDay.setHours(23, 59, 59, 999)
    await getAllLog(page, limit, status, method, name, sortBy, orderBy, adjustedStartDay, adjustedEndDay, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setLogs(response.data.logs)
          setCount(Math.ceil(response.data.filteredCount / limit))
          setFilteredCount(response.data.filteredCount)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDay, method, name, orderBy, sortBy, startDay, status, page, limit])

  useEffect(() => {
    getAllLogs()
  }, [getAllLogs])

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

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleDelete = async (arrIds: Array<string>) => {
    if (arrIds.length === 0) {
      toast.warning('Select a row to delete, please.')
    } else {
      setArrayIds(arrIds)
      setOpenDialog(true)
    }
  }

  const handleConfirmDelete = async (arrIds: Array<string>) => {
    if (arrIds.length === 0) {
      toast.warning('Select a row to delete, please.')
    } else {
      await deleteLog(arrIds, accessToken)
        .then((response) => {
          if (response.status === 204) {
            toast.success('Deletion Successful')
            getAllLogs()
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
      if (getCheckedInputIds().length === logs.length) {
        checkedAll.checked = true
      } else {
        checkedAll.checked = false
      }
    }
  }

  const handleSort = (sortByNameField: string) => {
    setSortBy(sortByNameField)
    if (sortByNameField === sortBy) {
      setOrderBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderBy('desc')
    }
  }

  const [openModal, setOpenModal] = useState<boolean>(false)

  const columns = [
    { header: 'Id', key: '_id', width: 20 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Method', key: 'method', width: 30 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Url', key: 'url', width: 30 },
    { header: 'User', key: 'user', width: 30 },
    { header: 'Error Message', key: 'errorMessage', width: 30 },
    { header: 'Content', key: 'content', width: 30 },
    { header: 'Created At', key: 'createdAt', width: 30 }
  ]

  const handleView = (log: ILog) => {
    if (!log) {
      toast.warning('Select a row to view, please.')
    } else {
      setLogDetail(log)
      setOpenModal(true)
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='inline-flex justify-end rounded-md shadow-sm' role='group'>
        <button
          type='button'
          onClick={() => handleDelete(getCheckedInputIds())}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <BsTrash className='w-3 h-3 mr-2' style={{ strokeWidth: '0.5' }} />
          Delete
        </button>
        <button
          type='button'
          disabled={!logs.length}
          onClick={() => generateExcel(columns, logs, 'Log Sheet', 'Log')}
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
      <AccordionCustom title='Refine Logs: Curate Your Records with Precision.'>
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-3 gap-10'>
            <SelectCustom
              arrValue={sortByField(arrLogNames, 'label')}
              label='Choose the name'
              value={name}
              setValue={setName}
            >
              Name
            </SelectCustom>
            <SelectCustom
              arrValue={sortByField(arrLogMethods, 'label')}
              label='Choose the method'
              value={method}
              setValue={setMethod}
            >
              Method
            </SelectCustom>
            <SelectCustom
              arrValue={sortByField(arrLogStatus, 'label')}
              label='Choose the status'
              value={status}
              setValue={setStatus}
            >
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
                  Method
                  <button type='button' onClick={() => handleSort('method')}>
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
                  Url
                  <button type='button' onClick={() => handleSort('url')}>
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
                <div className='flex items-center'>User</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Error Message</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>Content</div>
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
                <div className='flex items-center'>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((log: ILog) => (
                <tr
                  key={log._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        onClick={handleCheckElement}
                        id={log._id}
                        name='checkbox-table-search'
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label htmlFor={log._id} className='sr-only'>
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{log.name}</td>
                  <td className='px-6 py-4'>{log.method}</td>
                  <td className='px-6 py-4'>{log.status}</td>
                  <td className='px-6 py-4'>{log.url?.substring(0, 20)}</td>
                  <td className='px-6 py-4'>{log.user?.name}</td>
                  <td className='px-6 py-4'>{log.errorMessage?.substring(0, 20)}</td>
                  <td className='px-6 py-4'>
                    {String(log?.content) !== '' && JSON.stringify(log?.content)?.substring(0, 20)}
                  </td>
                  <td className='px-6 py-4'>{timeAgo(new Date(log.createdAt))}</td>
                  <td className='flex items-center px-6 py-4 space-x-3'>
                    <span
                      onClick={() => handleView(log)}
                      className='font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline'
                    >
                      View
                    </span>
                    <span
                      onClick={() => handleDelete([log._id])}
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
          ${limit * page < (filteredCount || logs.length) ? limit * page : filteredCount || logs.length}`}{' '}
            </span>{' '}
            of <span className='font-semibold text-gray-900 dark:text-white'>{filteredCount || logs.length}</span>
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
      <DialogCustom
        open={openDialog}
        setOpen={setOpenDialog}
        onAgree={() => handleConfirmDelete(arrayIds)}
        onCancel={() => {}}
      />
      <ModalCustom onCancel={() => {}} open={openModal} setOpen={setOpenModal}>
        <div className='relative w-full h-full max-w-4xl md:h-auto'>
          <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
            <div className='flex justify-between mb-4 rounded-t sm:mb-5'>
              <div className='text-lg text-gray-900 md:text-xl dark:text-white'>
                <h3 className='ftext-center ont-semibold '>Log Details</h3>
              </div>
              <div>
                <button
                  type='button'
                  onClick={() => setOpenModal(false)}
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white'
                  data-modal-toggle='readProductModal'
                >
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
            </div>
            <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
              <div className='sm:col-span-2 md:col-span-3'>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Name</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {logDetail?.name}
                </dd>
              </div>
              <div className='sm:col-span-2 md:col-span-3'>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Url</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {logDetail?.url}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Method</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {logDetail?.method}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Status</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {logDetail?.status}
                </dd>
              </div>

              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Created At</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {moment(logDetail?.createdAt).format('MM/DD/YYYY HH:MM:SS')}
                </dd>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 sm:col-span-2 md:col-span-3'>
                <div>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>User</dt>
                  <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                    <pre className='overflow-auto'>{JSON.stringify(logDetail?.user, null, 2)}</pre>
                  </dd>
                </div>
                <div>
                  <div>
                    <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Content</dt>
                    <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                      <pre className='overflow-auto'>{JSON.stringify(logDetail?.content, null, 2)}</pre>
                    </dd>
                  </div>
                  <div>
                    <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Error Message</dt>
                    <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50 min-h-[40px]'>
                      {logDetail?.errorMessage}
                    </dd>
                  </div>
                </div>
              </div>
            </dl>
            <div className='flex items-center justify-end'>
              <button
                type='button'
                onClick={() => handleDelete([logDetail?._id as string])}
                className='inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900'
              >
                <svg
                  aria-hidden='true'
                  className='w-5 h-5 mr-1.5 -ml-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  )
}

export default Log
