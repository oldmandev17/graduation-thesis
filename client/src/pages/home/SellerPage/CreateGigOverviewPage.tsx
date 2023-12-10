/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup'
import { createGig, getAllCategory, getGigDetailById, updateGig } from 'apis/api'
import StepNavigate from 'components/seller/StepNavigate'
import { ICategory } from 'modules/category'
import { GigStatus, IGig } from 'modules/gig'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import * as Yup from 'yup'

const gigOverviewSchema = Yup.object().shape({
  name: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required')
})

function CreateGigOverviewPage() {
  const { id } = useParams<{ id?: string }>()
  const [gig, setGig] = useState<IGig>()
  const [parent, setParent] = useState<string>('')
  const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([])
  const [arrParentCategory, setArrParentCategory] = useState<Array<{ label: string; value: string }>>([])
  const [arrCategory, setArrCategory] = useState<
    Array<{ label: string; value: string; subCategories: Array<ICategory> }>
  >([])
  const { accessToken } = getToken()
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(gigOverviewSchema),
    mode: 'onSubmit'
  })

  const getGigDetails = useCallback(async () => {
    await getGigDetailById(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
        }
      })
      .catch((error: any) => {
        if (error.response.status === 403) {
          navigate('/auth/un-authorize')
        } else {
          toast.error(error.response.data.error.message)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  useEffect(() => {
    if (gig && user && gig?.createdBy?._id !== user?._id) {
      navigate('/auth/un-authorize')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig, user])

  useEffect(() => {
    if (id) {
      getGigDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetails])

  useEffect(() => {
    if (gig) {
      setValue('name', gig?.name as string)
      setValue('category', gig?.category?._id as string)
      setValue('description', gig?.description as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig])

  const getAllCategories = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'name', 'desc', null, null, parent, 1, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setArrParentCategory([...response.data.arrParentCategory, { label: 'Show All', value: '' }])
          setArrCategory(response.data.arrCategory)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [accessToken, parent])

  useEffect(() => {
    getAllCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllCategories])

  useEffect(() => {
    const arrTemp: any = []
    arrCategory.forEach((category) => {
      category.subCategories.forEach((subCategory: ICategory) => {
        arrTemp.push({
          label: subCategory.name,
          value: subCategory._id
        })
      })
    })
    setCategories(arrTemp)
  }, [arrCategory])

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.error(String(arrErroes[0]?.message), {
        pauseOnHover: false,
        delay: 0
      })
    }
  }, [errors])

  const handleCreateOrUpdateGigOverview = async (values: any) => {
    values.status = GigStatus.NONE
    if (gig) {
      await updateGig(gig._id, values, accessToken)
        .then((response) => {
          if (response.status === 200) {
            reset()
            navigate(`/user/${user?.id}/gig-create/${response.data.gig._id}/pricing`)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    } else {
      await createGig(values, accessToken)
        .then((response) => {
          if (response.status === 201) {
            reset()
            navigate(`/user/${user?.id}/gig-create/${response.data.gig._id}/pricing`)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setParent(event.target.value)
  }

  return (
    <div>
      <StepNavigate index={1} />
      <form onSubmit={handleSubmit(handleCreateOrUpdateGigOverview)} className='flex flex-col items-center bg-gray-50 '>
        <div className='border-[1px] border-gray-500 rounded-md w-full max-w-4xl bg-white my-10 flex flex-col p-10 gap-5'>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2 '>
              <span className='text-lg font-semibold'>Gig Title</span>
              <span className='text-base'>
                As your Gig storefront, your
                <span className='font-bold'> title is the most important place </span>
                to include keywords that buyers would likely use to search for a service like yours.
              </span>
            </div>
            <textarea
              rows={5}
              id='title'
              {...register('name')}
              className='resize-none rounded-lg border-[1px] border-gray-500 text-base font-normal focus:text-gray-900 text-gray-700 p-2 w-full no-scrollbar'
            />
          </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2'>
              <span className='text-lg font-semibold'>Categories</span>
              <span className='text-base'>Choose the category and sub-category most suitable for your Gig.</span>
            </div>
            <div className='grid w-full grid-cols-2 gap-10'>
              <div>
                <select
                  defaultValue=''
                  onChange={handleChangeCategory}
                  name='parentCategory'
                  id=''
                  className='w-full border-[1px] p-2 border-gray-500 text-sm rounded-lg '
                >
                  <option value='' disabled>
                    CATEGORY
                  </option>
                  {arrParentCategory.length > 0 &&
                    arrParentCategory.map((parentCategory, index) => (
                      <option key={index + parentCategory.value} value={parentCategory.value}>
                        {parentCategory.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <select
                  defaultValue={gig ? gig?.category?._id : ''}
                  {...register('category')}
                  name='category'
                  id=''
                  className='w-full border-[1px] p-2 border-gray-500 text-sm rounded-lg '
                >
                  <option value='' disabled>
                    SUB-CATEGORY
                  </option>
                  {categories.length > 0 &&
                    categories.map((category, index) => (
                      <option key={index + category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2 '>
              <span className='text-lg font-semibold'>Description</span>
              <span className='text-base'>Briefly Describe Your Gig</span>
            </div>
            <textarea
              rows={5}
              id='describe'
              {...register('description')}
              className='no-scrollbar rounded-lg border-[1px] border-gray-500 w-full h-36 p-2 text-base font-normal focus:text-gray-900 text-gray-700 '
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='p-2 font-bold text-white bg-black rounded-xl focus:bg-blue-800 min-w-[100px]'
            >
              {isSubmitting ? (
                <div role='status'>
                  <svg
                    aria-hidden='true'
                    className='inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span className='sr-only'>Loading...</span>
                </div>
              ) : (
                <span>{gig ? 'Update & Continue' : 'Save & Continue'}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateGigOverviewPage
