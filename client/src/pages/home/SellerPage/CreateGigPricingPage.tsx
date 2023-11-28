/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup'
import { getGigDetail, updateGig } from 'apis/api'
import { arrDeliveryTime, arrRevisions } from 'assets/data'
import StepNavigate from 'components/seller/StepNavigate'
import { Feature, GigPackageType, IGig, Package } from 'modules/gig'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiDollar } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import * as Yup from 'yup'

const gigPricingSchema = Yup.object().shape({
  basicName: Yup.string().required('Basic name is required'),
  standardName: Yup.string().required('Standard name is required'),
  premiumName: Yup.string().required('Premium name is required'),
  basicDescription: Yup.string().required('Basic description is required'),
  standardDescription: Yup.string().required('Standard description is required'),
  basicDeliveryTime: Yup.number().required('Basic delivery time is required').positive('Basic revisions is required'),
  standardDeliveryTime: Yup.number()
    .required('Standard delivery time is required')
    .positive('Basic revisions is required'),
  premiumDeliveryTime: Yup.number()
    .required('Premium delivery time is required')
    .positive('Basic revisions is required'),
  premiumDescription: Yup.string().required('Premium description is required'),
  basicRevisions: Yup.number().required('Basic revisions is required').positive('Basic revisions is required'),
  standardRevisions: Yup.number().required('Standard revisions is required').positive('Basic revisions is required'),
  premiumRevisions: Yup.number().required('Premium revisions is required').positive('Basic revisions is required'),
  basicPrice: Yup.number().required('Basic price is required'),
  standardPrice: Yup.number().required('Standard price is required'),
  premiumPrice: Yup.number().required('Premium price is required')
})

function CreateGigPricingPage() {
  const { slug } = useParams<{ slug?: string }>()
  const [gig, setGig] = useState<IGig>()
  const { accessToken } = getToken()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(gigPricingSchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.error(String(arrErroes[0]?.message), {
        pauseOnHover: false,
        delay: 0
      })
    }
  }, [errors])

  const getGigDetails = useCallback(async () => {
    await getGigDetail(slug, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, accessToken])

  useEffect(() => {
    if (gig) {
      if (gig.createdBy?._id !== user?._id) {
        navigate('/auth/unAuthorize')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig, user?._id])

  useEffect(() => {
    if (slug) {
      getGigDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGigDetails])

  const handleCreateOrUpdateGigPricing = async (values: any) => {
    const data: any = {}
    const basicFeatures: Feature[] = []
    const standardFeatures: Feature[] = []
    const premiumFeatures: Feature[] = []
    gig?.category?.features.map((feature, index) => {
      const basicChecked = document.getElementById(`basicFeature${index}`) as HTMLInputElement
      const standardChecked = document.getElementById(`standardFeature${index}`) as HTMLInputElement
      const premiumChecked = document.getElementById(`premiumFeature${index}`) as HTMLInputElement
      basicFeatures.push({ name: feature, status: basicChecked.checked })
      standardFeatures.push({ name: feature, status: standardChecked.checked })
      premiumFeatures.push({ name: feature, status: premiumChecked.checked })
      return null
    })
    const packages: Package[] = []
    packages.push({
      type: GigPackageType.BASIC,
      name: values.basicName,
      description: values.basicDescription,
      deliveryTime: values.basicDeliveryTime,
      revisions: values.basicRevisions,
      features: basicFeatures,
      price: values.basicPrice
    })
    packages.push({
      type: GigPackageType.STANDARD,
      name: values.standardName,
      description: values.standardDescription,
      deliveryTime: values.standardDeliveryTime,
      revisions: values.standardRevisions,
      features: standardFeatures,
      price: values.standardPrice
    })
    packages.push({
      type: GigPackageType.PREMIUM,
      name: values.premiumName,
      description: values.premiumDescription,
      deliveryTime: values.premiumDeliveryTime,
      revisions: values.premiumRevisions,
      features: premiumFeatures,
      price: values.premiumPrice
    })
    data.packages = packages
    data.name = gig?.name
    if (gig) {
      await updateGig(gig?._id, data, accessToken)
        .then((response) => {
          if (response.status === 200) {
            reset()
            navigate(`/${user?.id}/gig-create/${response.data.gig.slug}/faq&gallery`)
          }
        })
        .catch((error: any) => {
          toast.error(error.response.data.error.message)
        })
    }
  }

  useEffect(() => {
    if (gig?.packages && gig?.packages.length > 0 && gig?.packages[0].name) {
      setValue('basicName', gig.packages[0].name)
      setValue('basicDescription', gig.packages[0].description as string)
      setValue('basicDeliveryTime', gig.packages[0].deliveryTime as number)
      setValue('basicRevisions', gig.packages[0].revisions as number)
      setValue('basicPrice', gig.packages[0].price as number)
    }
    if (gig?.packages && gig?.packages.length > 0 && gig?.packages[1].name) {
      setValue('standardName', gig.packages[1].name)
      setValue('standardDescription', gig.packages[1].description as string)
      setValue('standardDeliveryTime', gig.packages[1].deliveryTime as number)
      setValue('standardRevisions', gig.packages[1].revisions as number)
      setValue('standardPrice', gig.packages[1].price as number)
    }
    if (gig?.packages && gig?.packages.length > 0 && gig?.packages[2].name) {
      setValue('premiumName', gig.packages[2].name)
      setValue('premiumDescription', gig.packages[2].description as string)
      setValue('premiumDeliveryTime', gig.packages[2].deliveryTime as number)
      setValue('premiumRevisions', gig.packages[2].revisions as number)
      setValue('premiumPrice', gig.packages[2].price as number)
    }
  }, [gig?.packages, setValue])

  return (
    <div>
      <StepNavigate index={2} />
      <form
        onSubmit={handleSubmit(handleCreateOrUpdateGigPricing)}
        className='flex flex-col items-center w-full bg-gray-50'
      >
        <table className='w-full max-w-4xl mt-10 border border-slate-300'>
          <thead>
            <tr>
              <th className='bg-gray-100 min-w-[150px]'> </th>
              <th className='p-5 text-base font-semibold text-left text-gray-500 bg-gray-200 border border-slate-300'>
                BASIC
              </th>
              <th className='p-5 text-base font-semibold text-left text-gray-500 bg-gray-200 border border-slate-300'>
                STANDARD
              </th>
              <th className='p-5 text-base font-semibold text-left text-gray-500 bg-gray-200 border border-slate-300'>
                PREMIUM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='bg-gray-100'> </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('basicName')}
                  className='w-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Name your package'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('standardName')}
                  className='w-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Name your package'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('premiumName')}
                  className='w-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Name your package'
                />
              </td>
            </tr>
            <tr>
              <td className='bg-gray-100'> </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('basicDescription')}
                  className='w-full h-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Describe the detail of your offering'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('standardDescription')}
                  className='w-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Describe the detail of your offering'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  {...register('premiumDescription')}
                  className='w-full text-sm font-normal text-gray-500 textarea-none placeholder:font-normal overscroll-none focus:text-gray-800'
                  placeholder='Describe the detail of your offering'
                />
              </td>
            </tr>
            <tr>
              <td className='px-2 bg-gray-100 py-[22px]'> </td>
              <td className='border border-gray-300'>
                <select
                  {...register('basicDeliveryTime')}
                  defaultValue={gig?.packages && gig?.packages[0].deliveryTime ? gig?.packages[0].deliveryTime : 0}
                  name='basicDeliveryTime'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    DELIVERY TIME
                  </option>
                  {arrDeliveryTime.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border border-gray-300'>
                <select
                  {...register('standardDeliveryTime')}
                  defaultValue={gig?.packages && gig?.packages[1].deliveryTime ? gig?.packages[1].deliveryTime : 0}
                  name='standardDeliveryTime'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    DELIVERY TIME
                  </option>
                  {arrDeliveryTime.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border border-gray-300'>
                <select
                  {...register('premiumDeliveryTime')}
                  defaultValue={gig?.packages && gig?.packages[2].deliveryTime ? gig?.packages[2].deliveryTime : 0}
                  name='premiumDeliveryTime'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    DELIVERY TIME
                  </option>
                  {arrDeliveryTime.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className='px-2 py-3 text-sm font-semibold text-left text-gray-500 bg-gray-100 '> Revisons</td>
              <td className='border border-gray-300'>
                <select
                  {...register('basicRevisions')}
                  defaultValue={gig?.packages && gig?.packages[0].revisions ? gig?.packages[0].revisions : 0}
                  name='basicRevisions'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    REVISIONS
                  </option>
                  {arrRevisions.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border border-gray-300'>
                <select
                  {...register('standardRevisions')}
                  defaultValue={gig?.packages && gig?.packages[1].revisions ? gig?.packages[1].revisions : 0}
                  name='standardRevisions'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    REVISIONS
                  </option>
                  {arrRevisions.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border border-gray-300'>
                <select
                  {...register('premiumRevisions')}
                  defaultValue={gig?.packages && gig?.packages[2].revisions ? gig?.packages[2].revisions : 0}
                  name='premiumRevisions'
                  id=''
                  className='w-full text-sm text-gray-500 select-none '
                >
                  <option value={0} disabled className='p-10 text-black'>
                    REVISIONS
                  </option>
                  {arrRevisions.map((time, index) => (
                    <option key={time.label + index} value={time.value} className='text-black'>
                      {time.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {gig?.category &&
              gig?.category.features.length > 0 &&
              gig?.category.features.map((feature, index) => (
                <tr key={index + feature}>
                  <td className='px-2 py-3 text-sm font-semibold text-left text-gray-500 bg-gray-100 border border-gray-200 '>
                    {feature}
                  </td>
                  <td className='border border-gray-200'>
                    <div className='flex justify-center '>
                      <input
                        id={`basicFeature${index}`}
                        type='checkbox'
                        defaultChecked={
                          gig &&
                          gig.packages &&
                          gig?.packages?.length > 0 &&
                          gig?.packages[0] &&
                          gig?.packages[0].features &&
                          gig?.packages[0].features.length > 0 &&
                          gig?.packages[0].features[index]
                            ? (gig?.packages[0].features[index].status as boolean)
                            : false
                        }
                        className='rounded-sm cursor-pointer checked:bg-black focus:ring-0'
                      />
                    </div>
                  </td>
                  <td className='border border-gray-200'>
                    <div className='flex justify-center'>
                      <input
                        id={`standardFeature${index}`}
                        defaultChecked={
                          gig &&
                          gig.packages &&
                          gig?.packages?.length > 0 &&
                          gig?.packages[1] &&
                          gig?.packages[1].features &&
                          gig?.packages[1].features.length > 0 &&
                          gig?.packages[1].features[index]
                            ? (gig?.packages[1].features[index].status as boolean)
                            : false
                        }
                        type='checkbox'
                        className='rounded-sm cursor-pointer checked:bg-black focus:ring-0'
                      />
                    </div>
                  </td>
                  <td className='border border-gray-200'>
                    <div className='flex justify-center'>
                      <input
                        id={`premiumFeature${index}`}
                        defaultChecked={
                          gig &&
                          gig.packages &&
                          gig?.packages?.length > 0 &&
                          gig?.packages[2] &&
                          gig?.packages[2].features &&
                          gig?.packages[2].features.length > 0 &&
                          gig?.packages[2].features[index]
                            ? (gig?.packages[2].features[index].status as boolean)
                            : false
                        }
                        type='checkbox'
                        className='rounded-sm cursor-pointer checked:bg-black focus:ring-0'
                      />
                    </div>
                  </td>
                </tr>
              ))}
            <tr>
              <td className='px-2 py-3 text-sm font-semibold text-left text-gray-500 bg-gray-100 border border-gray-200 '>
                Price
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='w-4 h-4 fill-gray-500' />
                  </span>
                  <input
                    {...register('basicPrice')}
                    defaultValue={gig?.packages && gig?.packages[0].price ? gig?.packages[0].price : 0}
                    type='number'
                    className='w-full text-sm select-none'
                  />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='w-4 h-4 fill-gray-500' />
                  </span>
                  <input
                    {...register('standardPrice')}
                    defaultValue={gig?.packages && gig?.packages[1].price ? gig?.packages[1].price : 0}
                    type='number'
                    className='w-full text-sm select-none'
                  />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='w-4 h-4 fill-gray-500' />
                  </span>
                  <input
                    {...register('premiumPrice')}
                    defaultValue={gig?.packages && gig?.packages[2].price ? gig?.packages[2].price : 0}
                    type='number'
                    className='w-full text-sm select-none'
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='flex justify-end mt-5 mb-10'>
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
      </form>
    </div>
  )
}

export default CreateGigPricingPage
