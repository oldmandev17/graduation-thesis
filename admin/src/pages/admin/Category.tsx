/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import { yupResolver } from '@hookform/resolvers/yup'
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryDetail,
  updateCategory,
  updateCategoryStatus
} from 'apis/api'
import { arrCategoryLevel, arrCategoryStatus, arrLimits } from 'assets/data'
import AccordionCustom from 'components/common/AccordionCustom'
import DateTimePickerCustom from 'components/common/DateTimePickerCustom'
import DialogCustom from 'components/common/DialogCustom'
import ImageCustom from 'components/common/ImageCustom'
import ModalCustom from 'components/common/ModalCustom'
import SearchCustom from 'components/common/SearchCustom'
import SelectCustom from 'components/common/SelectCustom'
import useDebounce from 'hooks/useDebounce'
import { CategoryStatus, ICategory } from 'modules/category'
import moment from 'moment'
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import generateExcel from 'utils/generateExcel'
import timeAgo from 'utils/timeAgo'
import * as Yup from 'yup'

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.mixed().required('Image is required'),
  status: Yup.string().oneOf(Object.values(CategoryStatus), 'Invalid status').required('Status is required'),
  level: Yup.number(),
  parent: Yup.string()
})

function Category() {
  const formHandler = useForm({
    resolver: yupResolver(categorySchema),
    mode: 'onSubmit'
  })
  const {
    reset,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
    handleSubmit
  } = formHandler
  const date = new Date()
  const [mode, setMode] = useState<string>('create')
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [categoryDetail, setCategoryDetail] = useState<ICategory>()
  const [category, setCategory] = useState<string>('')
  const [parentCategory, setParentCategory] = useState<string>('')
  const [parentCategoryTemp, setParentCategoryTemp] = useState<string>('')
  const [categoryLevel1, setCategoryLevel1] = useState<Array<{ label: string; value: string }>>([])
  const [categoryLevel2, setCategoryLevel2] = useState<Array<{ label: string; value: string }>>([])
  const [categoryTemp, setCategoryTemp] = useState<string>('')
  const [categoryKey, setCategoryKey] = useState<string>('')
  const [arrParentCategory, setArrParentCategory] = useState<Array<{ label: string; value: string }>>([])
  const [arrCategory, setArrCategory] = useState<Array<{ label: string; value: string }>>([])
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
  const [show, setShow] = useState<string>()
  const [showSub, setShowSub] = useState<string>()
  const [level, setLevel] = useState<number>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { accessToken } = getToken()
  const [features, setFeatures] = useState<Array<string>>([])

  const handleAddFeature = () => {
    const feature = document.getElementById('feature') as HTMLInputElement
    if (feature && feature?.value !== '') {
      setFeatures([...features, feature?.value])
      feature.value = ''
    } else {
      toast.warning('Enter the feature, please.')
    }
  }

  const handleRemoveFeature = (index: number) => {
    const clonedFeatures = [...features]
    clonedFeatures.splice(index, 1)
    setFeatures(clonedFeatures)
  }

  const getCategories = async (serId: string) => {
    await getAllCategory(null, null, null, '', 'name', 'desc', null, null, serId, 1, accessToken).then((response) => {
      if (response.status === 200) {
        setCategoryLevel1([...response.data.arrParentCategory, { label: 'Show all', value: '' }])
        setCategoryLevel2([...response.data.arrCategory, { label: 'Show all', value: '' }])
      }
    })
  }

  const [serId, setSerId] = useState<string>('')

  useEffect(() => {
    getCategories(serId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serId])

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.warning(String(arrErroes[0]?.message))
    }
  }, [errors])

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
      categoryKey,
      level,
      accessToken
    )
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data.categories)
          setCount(Math.ceil(response.data.filteredCount / limit))
          setFilteredCount(response.data.filteredCount)
          if (response.data.arrParentCategory.length > 0)
            setArrParentCategory([...response.data.arrParentCategory, { label: 'Show all', value: '' }])
          if (response.data.arrCategory.length > 0)
            setArrCategory([...response.data.arrCategory, { label: 'Show all', value: '' }])
        }
      })
      .finally(() => setParentCategoryTemp(parentCategory))
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDay, keywordDebounce, orderBy, sortBy, startDay, status, page, limit, level, categoryKey])

  useEffect(() => {
    if (parentCategory !== parentCategoryTemp) {
      setCategoryKey(parentCategory)
    } else if (category !== categoryTemp) {
      setCategoryKey(category)
    }
    setParentCategoryTemp(parentCategory)
    setCategoryTemp(category)
  }, [parentCategory, category, parentCategoryTemp, categoryTemp])

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

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
      await deleteCategory(arrIds, accessToken)
        .then((response) => {
          if (response.status === 204) {
            toast.success('Delete Completed Successfully!')
            getAllCategories()
            reset()
            setOpenModal(false)
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
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Level', key: 'level', width: 30 },
    { header: 'Slug', key: 'slug', width: 30 },
    { header: 'Created At', key: 'createdAt', width: 30 },
    { header: 'Created By', key: 'createdBy', width: 30 },
    { header: 'Updated At', key: 'updatedAt', width: 30 },
    { header: 'Updated By', key: 'updatedBy', width: 30 }
  ]

  const handleEdit = async (id: string) => {
    if (!id) {
      toast.warning('Select a row to edit, please.')
    } else {
      setMode('update')
      await getCategoryDetail(id, accessToken)
        .then((response) => {
          if (response.status === 200) {
            setCategoryDetail(response.data.category)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
      setOpenModal(true)
    }
  }

  const handleUpdateStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (getCheckedInputIds().length < 1) {
      toast.warning('Select a row to edit, please.')
    } else {
      await updateCategoryStatus(getCheckedInputIds(), event.target.value, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Update Completed Successfully!')
            getAllCategories()
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const createOrUpdateCategory = async (values: any) => {
    const { parent, level, ...data } = values
    data.features = features
    if (Number(getValues('level')) > 1 && !getValues('parent')) {
      toast.warning('Parent is required')
    } else if (mode === 'create') {
      await createCategory(parent, data, accessToken)
        .then((response) => {
          if (response.status === 201) {
            toast.success('Create Completed Successfully!')
            getAllCategories()
            getCategories('')
            setOpenModal(false)
            reset()
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    } else {
      await updateCategory(categoryDetail?._id, parent, data, accessToken)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Update Completed Successfully!')
            getAllCategories()
            getCategories('')
            setOpenModal(false)
            reset()
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const handleAddCategory = () => {
    setOpenModal(true)
    setMode('create')
  }

  useEffect(() => {
    if (mode === 'update' && categoryDetail) {
      setValue('image', categoryDetail?.image)
      setValue('name', categoryDetail?.name)
      setValue('description', categoryDetail?.description)
      setValue('status', categoryDetail?.status)
      setValue('level', categoryDetail?.level)
      setFeatures(categoryDetail?.features)
    }
  }, [mode, categoryDetail, setValue])

  return (
    <div className='flex flex-col gap-5'>
      <div className='inline-flex justify-end rounded-md shadow-sm' role='group'>
        <button
          onClick={handleAddCategory}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
        >
          <HiOutlineViewGridAdd className='w-[14px] h-[14px] mr-2' style={{ strokeWidth: '2.5' }} />
          Add Category
        </button>
        <button
          type='button'
          disabled={!categories.length}
          onClick={() => generateExcel(columns, categories, 'Category Sheet', 'Category')}
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
            <SearchCustom value={keyword} setValue={setKeyword} label='Search by name'>
              Search By Name
            </SearchCustom>
            <SelectCustom
              arrValue={arrParentCategory}
              label='Choose the parent category'
              value={parentCategory}
              setValue={setParentCategory}
            >
              Parent Category
            </SelectCustom>
            <SelectCustom arrValue={arrCategory} label='Choose the category' value={category} setValue={setCategory}>
              Category
            </SelectCustom>
          </div>
          <div className='grid grid-cols-3 gap-10'>
            <SelectCustom arrValue={arrCategoryStatus} label='Choose the status' value={status} setValue={setStatus}>
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
            <SelectCustom arrValue={arrCategoryLevel} label='Choose the level' value={level} setValue={setLevel}>
              Level
            </SelectCustom>
            <SelectCustom arrValue={arrLimits} label='Choose the dispaly limit' value={limit} setValue={setLimit}>
              Display Limit
            </SelectCustom>
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
                {arrCategoryStatus?.length &&
                  arrCategoryStatus.map((val, index) => (
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
                  Level
                  <button type='button' onClick={() => handleSort('level')}>
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
                <div className='flex items-center'>Description</div>
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
                <div className='flex items-center'>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 ? (
              categories.map((category: ICategory) => (
                <Fragment key={category._id}>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
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
                    <td className='px-6 py-4'>{category.level}</td>
                    <td className='px-6 py-4'>{category.description}</td>
                    <td className='px-6 py-4'>{timeAgo(new Date(category.createdAt))}</td>
                    <td className='px-6 py-4'>{category?.updatedAt && timeAgo(new Date(category.updatedAt))}</td>
                    <td className='flex flex-row items-center justify-between px-6 py-4 space-x-3'>
                      <span
                        onClick={() => handleEdit(category._id)}
                        className='font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline'
                      >
                        Edit
                      </span>
                      {category.subCategories?.length > 0 && (
                        <span onClick={() => setShow(category._id === show ? '' : category._id)}>
                          <svg
                            aria-hidden='true'
                            className={`w-6 h-6 cursor-pointer ${
                              category._id === show ? 'rotate-180 transition-all' : ''
                            }`}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </span>
                      )}
                    </td>
                  </tr>
                  {category.subCategories?.length > 0 &&
                    show === category._id &&
                    category.subCategories.map((subCategory: ICategory) => (
                      <Fragment key={category._id + subCategory._id}>
                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                          <td className='w-4 p-4'>
                            <div className='flex items-center'>
                              <input
                                onClick={handleCheckElement}
                                id={subCategory._id}
                                name='checkbox-table-search'
                                type='checkbox'
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                              />
                              <label htmlFor={subCategory._id} className='sr-only'>
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className='px-6 py-4 pl-20 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                            {subCategory.name}
                          </td>
                          <td className='px-6 py-4'>{subCategory.status}</td>
                          <td className='px-6 py-4'>{subCategory.level}</td>
                          <td className='px-6 py-4'>{subCategory.description}</td>
                          <td className='px-6 py-4'>{timeAgo(new Date(subCategory.createdAt))}</td>
                          <td className='px-6 py-4'>
                            {subCategory?.updatedAt && timeAgo(new Date(subCategory.updatedAt))}
                          </td>
                          <td className='flex flex-row items-center justify-between px-6 py-4 space-x-3'>
                            <span
                              onClick={() => handleEdit(subCategory._id)}
                              className='font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline'
                            >
                              Edit
                            </span>
                            {subCategory.subCategories?.length > 0 && (
                              <span onClick={() => setShowSub(subCategory._id === showSub ? '' : subCategory._id)}>
                                <svg
                                  aria-hidden='true'
                                  className={`w-6 h-6 cursor-pointer ${
                                    subCategory._id === showSub ? 'rotate-180 transition-all' : ''
                                  }`}
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </span>
                            )}
                          </td>
                        </tr>
                        {subCategory.subCategories?.length > 0 &&
                          subCategory._id === showSub &&
                          subCategory.subCategories.map((subSubCategory: ICategory) => (
                            <tr
                              key={category._id + subCategory._id + subSubCategory._id}
                              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                            >
                              <td className='w-4 p-4'>
                                <div className='flex items-center'>
                                  <input
                                    onClick={handleCheckElement}
                                    id={subSubCategory._id}
                                    name='checkbox-table-search'
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                  />
                                  <label htmlFor={subSubCategory._id} className='sr-only'>
                                    checkbox
                                  </label>
                                </div>
                              </td>
                              <td className='px-6 py-4 font-medium text-gray-900 pl-36 whitespace-nowrap dark:text-white'>
                                {subSubCategory.name}
                              </td>
                              <td className='px-6 py-4'>{subSubCategory.status}</td>
                              <td className='px-6 py-4'>{subSubCategory.level}</td>
                              <td className='px-6 py-4'>{subSubCategory.description}</td>
                              <td className='px-6 py-4'>{timeAgo(new Date(subSubCategory.createdAt))}</td>
                              <td className='px-6 py-4'>
                                {subSubCategory?.updatedAt && timeAgo(new Date(subSubCategory.updatedAt))}
                              </td>
                              <td className='flex items-center px-6 py-4 space-x-3'>
                                <span
                                  onClick={() => handleEdit(subSubCategory._id)}
                                  className='font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline'
                                >
                                  Edit
                                </span>
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    ))}
                </Fragment>
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
      <DialogCustom
        open={openDialog}
        setOpen={setOpenDialog}
        onAgree={() => handleConfirmDelete(arrayIds)}
        onCancel={() => {}}
      />
      <ModalCustom onCancel={() => reset()} open={openModal} setOpen={setOpenModal}>
        <FormProvider {...formHandler}>
          <form
            onSubmit={handleSubmit(createOrUpdateCategory)}
            className='relative w-full h-full max-w-4xl min-w-[768px] md:h-auto'
          >
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              <div className='flex justify-between mb-4 rounded-t sm:mb-5'>
                <div className='text-lg text-gray-900 md:text-xl dark:text-white'>
                  <h3 className='ftext-center ont-semibold '>Category Details</h3>
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
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Description</dt>
                  <textarea
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    placeholder='Type the description ...'
                    {...register('description')}
                  />
                </div>
                <div className='sm:col-span-2 md:col-span-2'>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Image</dt>
                  <ImageCustom
                    name='image'
                    mode={mode}
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png']
                    }}
                  />
                </div>
                <div>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Status</dt>
                  <select
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    {...register('status')}
                  >
                    {arrCategoryStatus.length > 0 &&
                      arrCategoryStatus.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Level</dt>
                  <select
                    className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                    {...register('level')}
                    defaultValue={mode === 'update' ? Number(getValues('level')) : 1}
                  >
                    {arrCategoryLevel.length > 0 &&
                      arrCategoryLevel.map((level) => {
                        if (mode === 'update' && categoryDetail) {
                          if (Number(level.value) <= categoryDetail?.level) {
                            return (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            )
                          }
                          return null
                        }
                        return (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        )
                      })}
                  </select>
                </div>
                {Number(watch('level')) === 3 && (
                  <>
                    <div>
                      <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Parent Category</dt>
                      <select
                        className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => setSerId(event.target.value)}
                      >
                        {categoryLevel1.length > 0 &&
                          categoryLevel1.map((cat1) => (
                            <option key={cat1.value} value={cat1.value}>
                              {cat1.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Category</dt>
                      <select
                        className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                        {...register('parent')}
                        defaultValue=''
                      >
                        {categoryLevel2.length > 0 &&
                          categoryLevel2.map((cat2) => (
                            <option key={cat2.value} value={cat2.value}>
                              {cat2.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className='sm:col-span-2 md:col-span-2'>
                      <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Features</dt>
                      <div className='relative w-full h-[43px] mb-4'>
                        <input
                          type='text'
                          id='feature'
                          className='h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md dark:border-l-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-bray-800 hover:bg-gray-100'
                          placeholder='Enter the features'
                        />
                        <button
                          type='button'
                          onClick={handleAddFeature}
                          className='absolute top-0 right-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-r-md border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                          Add
                        </button>
                      </div>
                      <ul className='flex flex-wrap gap-2'>
                        {features.map((feature, index) => (
                          <li
                            key={index + feature}
                            className='flex gap-2 items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-md border border-gray-300 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200'
                          >
                            <span className='text-gray-900'>{feature}</span>
                            <span className='text-red-700 cursor-pointer' onClick={() => handleRemoveFeature(index)}>
                              X
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {Number(watch('level')) === 2 && (
                  <div>
                    <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Status</dt>
                    <select
                      className='w-full px-1 py-2 mb-4 font-light text-center text-gray-500 border border-gray-300 rounded-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:text-gray-300 sm:mb-5 bg-gray-50'
                      {...register('parent')}
                    >
                      {categoryLevel1.length > 0 &&
                        categoryLevel1.map((cat1) => (
                          <option key={cat1.value} value={cat1.value}>
                            {cat1.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {mode === 'update' && (
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 sm:col-span-2 md:col-span-2'>
                    <div>
                      <div>
                        <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Created At</dt>
                        <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                          {moment(categoryDetail?.createdAt).format('MM/DD/YYYY HH:MM:SS')}
                        </dd>
                      </div>
                      <div>
                        <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Created By</dt>
                        <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50'>
                          <pre>{JSON.stringify(categoryDetail?.createdBy, null, 2)}</pre>
                        </dd>
                      </div>
                    </div>
                    <div>
                      <div>
                        <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Updated At</dt>
                        <dd className='px-1 py-2 mb-4 font-light text-center text-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50 min-h-[40px]'>
                          {categoryDetail?.updatedAt && moment(categoryDetail?.updatedAt).format('MM/DD/YYYY HH:MM:SS')}
                        </dd>
                      </div>
                      <div>
                        <dt className='mb-2 font-semibold leading-none text-gray-900 dark:text-white'>Updated By</dt>
                        <dd className='px-1 py-2 mb-4 overflow-hidden font-light text-gray-500 whitespace-normal rounded-md dark:bg-gray-700 dark:text-gray-300 sm:mb-5 bg-gray-50 min-h-[40px]'>
                          <pre>{JSON.stringify(categoryDetail?.updatedBy, null, 2)}</pre>
                        </dd>
                      </div>
                    </div>
                  </div>
                )}
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
                  {mode === 'update' ? 'Update' : 'Create'}
                </button>
                {mode === 'update' &&
                  categoryDetail &&
                  categoryDetail?.subCategories?.length === 0 &&
                  (categoryDetail?.gigs?.length === 0 || !categoryDetail.gigs) && (
                    <button
                      type='button'
                      onClick={() => handleDelete([categoryDetail?._id as string])}
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
                  )}
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalCustom>
    </div>
  )
}

export default Category
