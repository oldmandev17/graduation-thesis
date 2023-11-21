/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup'
import { createUser, getAllUser, sendMail, updateUserStatus } from 'apis/api'
import { arrLimits, arrUserGender, arrUserProvider, arrUserRole, arrUserStatus, arrUserVerify } from 'assets/data'
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import ModalCustom from 'components/common/ModalCustom'
import SearchCustom from 'components/common/SearchCustom'
import SelectCustom from 'components/common/SelectCustom'
import { EditorState, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import draftToHtml from 'draftjs-to-html'
import useDebounce from 'hooks/useDebounce'
import { IUser, UserGender, UserProvider, UserRole, UserStatus } from 'modules/user'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { FormProvider, useForm } from 'react-hook-form'
import { BiMailSend } from 'react-icons/bi'
import { BsSendCheck } from 'react-icons/bs'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'
import timeAgo from 'utils/timeAgo'
import * as Yup from 'yup'

const userSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  status: Yup.string().oneOf(Object.values(UserStatus), 'Invalid status').required('Status is required')
})

function User() {
  const formHandler = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onSubmit'
  })
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit
  } = formHandler
  const date = new Date()
  const [users, setUsers] = useState<Array<IUser>>([])
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [role, setRole] = useState<Array<UserRole> | null>(null)
  const [gender, setGender] = useState<UserGender | null>(null)
  const [provider, setProvider] = useState<UserProvider | null>(null)
  const [verify, setVerify] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [keyword, setKeyword] = useState<string>('')
  const keywordDebounce = useDebounce(keyword, 500)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [roles, setRoles] = useState<Array<UserRole>>([])
  const navigate = useNavigate()
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [title, setTitle] = useState<string>('')

  const handleAddRole = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value && !roles.includes(event.target.value as UserRole)) {
      setRoles([...roles, event.target.value as UserRole])
    }
  }

  const handleRemoveRole = (index: number) => {
    const clonedRoles = [...roles]
    clonedRoles.splice(index, 1)
    setRoles(clonedRoles)
  }

  const { accessToken } = getToken()

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.warning(String(arrErroes[0]?.message))
    }
  }, [errors])

  const handleAddUser = () => {
    setOpenModal(true)
  }

  const getAllUsers = useCallback(async () => {
    const adjustedStartDay = new Date(startDay)
    adjustedStartDay.setHours(0, 0, 0, 0)
    const adjustedEndDay = new Date(endDay)
    adjustedEndDay.setHours(23, 59, 59, 999)
    await getAllUser(
      page,
      limit,
      status,
      keywordDebounce,
      sortBy,
      orderBy,
      adjustedStartDay,
      adjustedEndDay,
      gender,
      provider,
      verify,
      role,
      accessToken
    )
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data.users)
          setCount(Math.ceil(response.data.filteredCount / limit))
          setFilteredCount(response.data.filteredCount)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [
    accessToken,
    endDay,
    gender,
    keywordDebounce,
    limit,
    orderBy,
    page,
    provider,
    role,
    sortBy,
    startDay,
    status,
    verify
  ])

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

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

  const columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Birthday', key: 'birthday', width: 30 },
    { header: 'Gender', key: 'gender', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 30 },
    { header: 'Provider', key: 'provider', width: 30 },
    { header: 'Verify', key: 'verify', width: 30 },
    { header: 'Role', key: 'role', width: 30 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Avatar', key: 'image', width: 30 },
    { header: 'Created At', key: 'createdAt', width: 30 },
    { header: 'Created By', key: 'createdBy', width: 30 },
    { header: 'Updated At', key: 'updatedAt', width: 30 },
    { header: 'Updated Admin At', key: 'updatedAdminAt', width: 30 },
    { header: 'Updated Admin By', key: 'updatedAdminBy', width: 30 }
  ]

  const handleUpdateStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (getCheckedInputIds().length < 1) {
      toast.warning('Select a row to edit, please.')
    } else {
      await updateUserStatus(getCheckedInputIds(), event.target.value, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Update Completed Successfully!')
            getAllUsers()
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const createNewUser = async (values: any) => {
    if (roles.length === 0) {
      toast.warning('Role is required')
    } else {
      // eslint-disable-next-line no-param-reassign
      values.role = roles
      await createUser(values, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Create Completed Successfully!')
            getAllUsers()
            setOpenModal(false)
            reset()
          }
        })
        .catch((error) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const handleSendMail = () => {
    if (getCheckedInputIds().length < 1) {
      toast.warning('Select a user send email, please.')
    } else {
      setOpenDialog(true)
    }
  }

  const sendMails = async () => {
    const data: any = {}
    data.title = title
    data.content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    data.ids = getCheckedInputIds()
    if (!data.title) {
      toast.warning('Enter the title, please.')
    } else if (data.content === '<p></p>\n') {
      toast.warning('Enter the content, please.')
    } else {
      await sendMail(data, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Send Email Completed Successfully!')
            setOpenDialog(false)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='inline-flex justify-end rounded-md shadow-sm' role='group'>
        <button
          onClick={handleAddUser}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <HiOutlineViewGridAdd className='w-[14px] h-[14px] mr-2' style={{ strokeWidth: '2.5' }} />
          Add User
        </button>
        <button
          onClick={handleSendMail}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <BiMailSend className='w-[16px] h-[16px] mr-2' style={{ strokeWidth: '1' }} />
          Send Mail
        </button>
        <button
          type='button'
          disabled={!users.length}
          onClick={() =>
            generateExcel(
              columns,
              users.map((user) => ({ ...user, image: user.avatar, avatar: undefined })),
              'User Sheet',
              'User'
            )
          }
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
            <SelectCustom arrValue={arrUserRole} label='Choose the role' value={role} setValue={setRole}>
              Role
            </SelectCustom>
            <SelectCustom
              arrValue={arrUserProvider}
              label='Choose the provider'
              value={provider}
              setValue={setProvider}
            >
              Provider
            </SelectCustom>
          </div>
          <div className='grid grid-cols-4 gap-10'>
            <SelectCustom arrValue={arrUserGender} label='Choose the gender' value={gender} setValue={setGender}>
              Gender
            </SelectCustom>

            <SelectCustom arrValue={arrUserVerify} label='Choose the verify' value={verify} setValue={setVerify}>
              Verify
            </SelectCustom>
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
                  Email
                  <button type='button' onClick={() => handleSort('email')}>
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
                <div className='flex items-center'>Phone</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className='flex items-center'>
                  Gender
                  <button type='button' onClick={() => handleSort('gender')}>
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
                <div className='flex items-center'>Role</div>
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
                  Verify
                  <button type='button' onClick={() => handleSort('verify')}>
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
                  Provider
                  <button type='button' onClick={() => handleSort('provider')}>
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
                <div className='flex items-center'>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user: IUser) => (
                <tr
                  key={user._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        onClick={handleCheckElement}
                        id={user._id}
                        name='checkbox-table-search'
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label htmlFor={user._id} className='sr-only'>
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{user.name}</td>
                  <td className='px-6 py-4'>{user.email}</td>
                  <td className='px-6 py-4'>{user.phone}</td>
                  <td className='px-6 py-4'>{user.gender}</td>
                  <td className='px-6 py-4'>{user.role.toString()}</td>
                  <td className='px-6 py-4'>{user.status}</td>
                  <td className='px-6 py-4'>{String(user.verify).toString()}</td>
                  <td className='px-6 py-4'>{user.provider}</td>
                  <td className='px-6 py-4'>{timeAgo(new Date(user.createdAt))}</td>
                  <td className='flex items-center px-6 py-4 space-x-3'>
                    <span
                      onClick={() => navigate(`/user-detail/${user._id}`)}
                      className='font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline'
                    >
                      View
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
          ${limit * page < (filteredCount || users.length) ? limit * page : filteredCount || users.length}`}{' '}
            </span>{' '}
            of <span className='font-semibold text-gray-900 dark:text-white'>{filteredCount || users.length}</span>
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
      <ModalCustom onCancel={() => {}} open={openModal} setOpen={setOpenModal}>
        <FormProvider {...formHandler}>
          <form
            onSubmit={handleSubmit(createNewUser)}
            className='relative w-full h-full max-w-4xl min-w-[768px] md:h-auto'
          >
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              <div className='flex justify-between mb-4 rounded-t sm:mb-5'>
                <div className='text-lg text-gray-900 md:text-xl dark:text-white'>
                  <h3 className='ftext-center ont-semibold '>User Details</h3>
                </div>
                <div>
                  <button
                    type='button'
                    onClick={() => {
                      setOpenModal(false)
                      reset()
                    }}
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
              <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2'>
                <div className='sm:col-span-2 md:col-span-2'>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Name</dt>
                  <input
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    type='text'
                    placeholder='Type the name ...'
                    {...register('name')}
                  />
                </div>
                <div className='sm:col-span-2 md:col-span-2'>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Email</dt>
                  <input
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    type='text'
                    placeholder='Type the email ...'
                    {...register('email')}
                  />
                </div>
                <div>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Status</dt>
                  <select
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    {...register('status')}
                  >
                    {arrUserStatus.length > 0 &&
                      arrUserStatus.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Role</dt>
                  <select
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    onChange={handleAddRole}
                  >
                    {arrUserRole.length > 0 &&
                      arrUserRole.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                  </select>
                  <ul className='flex flex-wrap gap-2'>
                    {roles.map((role, index) => (
                      <li
                        key={index + role}
                        className='flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none bg-gray-50 hover:bg-gray-100 hover:text-red-700 hover:border-red-200'
                      >
                        <span className='text-gray-900'>{role}</span>
                        <span className='text-red-700 cursor-pointer' onClick={() => handleRemoveRole(index)}>
                          X
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </dl>
              <div className='flex items-center justify-between'>
                <button
                  type='submit'
                  className='text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                >
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5 mr-1 -ml-1'
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
                  Create
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalCustom>
      <ModalCustom onCancel={() => {}} open={openDialog} setOpen={setOpenDialog}>
        <FormProvider {...formHandler}>
          <form
            onSubmit={handleSubmit(createNewUser)}
            className='relative w-full h-full max-w-4xl min-w-[768px] md:h-auto'
          >
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              <div className='flex justify-between mb-4 rounded-t sm:mb-5'>
                <div className='text-lg text-gray-900 md:text-xl dark:text-white'>
                  <h3 className='ftext-center ont-semibold '>Send Mail</h3>
                </div>
                <div>
                  <button
                    type='button'
                    onClick={() => {
                      setOpenDialog(false)
                    }}
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
              <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2'>
                <div className='sm:col-span-2 md:col-span-2'>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Title</dt>
                  <input
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    type='text'
                    placeholder='Type the title ...'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                  />
                </div>
                <div className='sm:col-span-2 md:col-span-2'>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Content</dt>
                  <Editor
                    defaultEditorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName='border border-gray-300 mb-4 sm:mb-5 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 bg-gray-50 text-gray-500 dark:text-gray-300'
                    editorClassName='dark:bg-gray-700 hover:bg-gray-100 p-2 bg-gray-50 dark:hover:bg-gray-600 rounded-b-md'
                    toolbarClassName='border border-gray-300 !rounded-t-md'
                    placeholder='Type the content ...'
                  />
                </div>
              </dl>
              <div className='flex items-center justify-between'>
                <button
                  type='button'
                  onClick={sendMails}
                  className='text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                >
                  <BsSendCheck className='text-lg mr-2' />
                  Send
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalCustom>
    </div>
  )
}

export default User
