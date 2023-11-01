/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import { deleteService, getAllService } from 'apis/api'
import { arrServiceStatus, arrLimits } from 'assets/data'
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import DialogCustom from 'components/common/DialogCustom'
import ModalCustom from 'components/common/ModalCustom'
import SearchCustom from 'components/common/SearchCustom'
import SelectCustom from 'components/common/SelectCustom'
import useDebounce from 'hooks/useDebounce'
import { IService, ServiceStatus } from 'modules/service'
import React, { useCallback, useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'
import timeAgo from 'utils/timeAgo'

function Service() {
  const date = new Date()
  const [services, setServices] = useState<Array<IService>>([])
  const [serviceDetail, setServiceDetail] = useState<IService>()
  const [parent, setParent] = useState<string>('')
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<ServiceStatus | null>(null)
  const [keyword, setKeyword] = useState<string>('')
  const keywordDebounce = useDebounce(keyword, 500)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState(20)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [arrayIds, setArrayIds] = useState<Array<string>>([])

  const { accessToken } = getToken()

  const getAllServices = useCallback(async () => {
    endDay.setHours(0, 0, 0, 0)
    await getAllService(
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
          setServices(response.data.services)
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
    getAllServices()
  }, [getAllServices])

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
      await deleteService(arrIds, accessToken)
        .then((response) => {
          if (response.status === 204) {
            toast.success('Deletion Successful')
            getAllServices()
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
      if (getCheckedInputIds().length === services.length) {
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

  const [openModal, setOpenModal] = useState<boolean>(true)

  const handleEdit = (service: IService) => {
    if (!service) {
      toast.warning('Select a row to edit, please.')
    } else {
      setServiceDetail(service)
      setOpenModal(true)
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
          Add Service
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
          disabled={!services.length}
          onClick={() => generateExcel(columns, services, 'Service Sheet', 'Service')}
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
      <AccordionCustom title='Refine Services: Curate Your Records with Precision.'>
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-3 gap-10'>
            <SelectCustom arrValue={arrServiceStatus} label='Choose the grand parent' value={status} setValue={setStatus}>
              Grand Parent
            </SelectCustom>
            <SelectCustom arrValue={arrServiceStatus} label='Choose the status' value={status} setValue={setStatus}>
              Parent
            </SelectCustom>
            <SearchCustom value={keyword} setValue={setKeyword} label='Search by name'>
              Search By Name
            </SearchCustom>
          </div>
          <div className='grid grid-cols-3 gap-10'>
            <SelectCustom arrValue={arrServiceStatus} label='Choose the status' value={status} setValue={setStatus}>
              Status
            </SelectCustom>
            <DateTimePickerCustom value={startDay} setValue={setStartDay} label='Choose the start day'>
              Start Day
            </DateTimePickerCustom>
            <DateTimePickerCustom value={endDay} setValue={setEndDay} label='Choose the end day'>
              End Day
            </DateTimePickerCustom>
          </div>
          <div className='grid grid-cols-3 gap-10'>
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
            {services.length ? (
              services.map((service: IService) => (
                <tr
                  key={service._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        onClick={handleCheckElement}
                        id={service._id}
                        name='checkbox-table-search'
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label htmlFor={service._id} className='sr-only'>
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                    {service.name}
                  </td>
                  <td className='px-6 py-4'>{service.status}</td>
                  <td className='px-6 py-4'>{timeAgo(new Date(service.createdAt))}</td>
                  <td className='px-6 py-4'>{service.createdBy.name}</td>
                  <td className='px-6 py-4'>{service?.updatedAt && timeAgo(new Date(service.updatedAt))}</td>
                  <td className='px-6 py-4'>{service && service.updatedBy?.name}</td>
                  <td className='flex items-center px-6 py-4 space-x-3'>
                    <span
                      onClick={() => handleEdit(service)}
                      className='font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline'
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => handleDelete([service._id])}
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
          ${limit * page < (filteredCount || services.length) ? limit * page : filteredCount || services.length}`}{' '}
            </span>{' '}
            of <span className='font-semibold text-gray-900 dark:text-white'>{filteredCount || services.length}</span>
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
      <ModalCustom open={openModal} setOpen={setOpenModal}>
        <div className='relative w-full h-full max-w-2xl md:h-auto'>
          <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
            <div className='flex justify-between mb-4 rounded-t sm:mb-5'>
              <div className='text-lg text-gray-900 md:text-xl dark:text-white'>
                <h3 className='ftext-center ont-semibold '>Service Details</h3>
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
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Name</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {logDetail?.name} */}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Method</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {logDetail?.method} */}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Status</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {logDetail?.status} */}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Url</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {logDetail?.url} */}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>User</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {logDetail && logDetail.user?.name} */}
                </dd>
              </div>
              <div>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Created At</dt>
                <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* {moment(logDetail?.createdAt).format('MM/DD/YYYY HH:MM:SS')} */}
                </dd>
              </div>
              <div className='sm:col-span-2 md:col-span-3'>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>User</dt>
                <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* <pre>{JSON.stringify(logDetail?.user, null, 2)}</pre> */}
                </dd>
              </div>
              <div className='sm:col-span-2 md:col-span-3'>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Content</dt>
                <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                  {/* <pre>{JSON.stringify(logDetail?.content, null, 2)}</pre> */}
                </dd>
              </div>
              <div className='sm:col-span-2 md:col-span-3'>
                <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Error Message</dt>
                <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50 min-h-[40px]'>
                  {/* {logDetail?.errorMessage} */}
                </dd>
              </div>
            </dl>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                className='text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                <svg
                  aria-hidden='true'
                  className='mr-1 -ml-1 w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                  <path
                    fillRule='evenodd'
                    d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                    clipRule='evenodd'
                  />
                </svg>
                Edit
              </button>
              <button
                type='button'
                // onClick={() => handleDelete([logDetail?._id as string])}
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

export default Service
