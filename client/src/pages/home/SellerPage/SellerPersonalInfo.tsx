/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { updateProfile } from 'apis/api'
import { UserRole } from 'modules/user'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { LuPhone } from 'react-icons/lu'
import { MdOutlineEmail } from 'react-icons/md'
import { SiFreelancer } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import * as Yup from 'yup'

const steps = ['Personal Info', 'Account Security']
// eslint-disable-next-line no-useless-escape
const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/

const personalSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  avatar: Yup.mixed().required('Avatar is required'),
  language: Yup.string().required('Language is required'),
  occupation: Yup.string().required('Occupation is required'),
  skill: Yup.string().required('Skill is required'),
  education: Yup.string(),
  certification: Yup.string(),
  phone: Yup.string().matches(phoneRegExp, 'Phone is not valid').nullable()
})

function SellerPersonalInfo() {
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())
  const navigate = useNavigate()
  const { accessToken } = getToken()
  const { user } = useAppSelector((state) => state.auth)

  const {
    reset,
    register,
    setValue,
    getValues,
    unregister,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm({
    resolver: yupResolver(personalSchema),
    mode: 'onSubmit'
  })

  const files: any = watch('avatar')

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setValue('avatar', droppedFiles[0], { shouldValidate: true })
    },
    [setValue]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  })

  useEffect(() => {
    register('avatar')
    return () => {
      unregister('avatar')
    }
  }, [register, unregister])

  useEffect(() => {
    if (user) {
      setValue('name', user?.name)
      if (user.avatar) setValue('avatar', user?.avatar)
      if (user.description) setValue('description', user?.description)
      if (user.language) setValue('language', user?.language)
      if (user.occupation) setValue('occupation', user?.occupation)
      if (user.skill) setValue('skill', user?.skill)
      if (user.education) setValue('education', user?.education)
      if (user.certification) setValue('certification', user?.certification)
      if (user.phone) setValue('phone', user?.phone)
    }
  }, [user, setValue])

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.error(String(arrErroes[0]?.message), {
        pauseOnHover: false,
        delay: 0
      })
    }
  }, [errors])

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleRequestSeller = async (values: any) => {
    const userRole = user?.role.filter((role) => role !== UserRole.SELLER)
    if (user && userRole && !userRole.includes(UserRole.REQUEST_SELLER))
      values.role = [...userRole, UserRole.REQUEST_SELLER]
    if (user && userRole && userRole.includes(UserRole.REQUEST_SELLER)) values.role = userRole
    await updateProfile(values, accessToken)
      .then((response) => {
        if (response.status === 200) {
          navigate('/')
          window.location.reload()
          reset()
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  return (
    <>
      <Helmet>
        <title>Personal Info | Freelancer</title>
      </Helmet>
      <div>
        <div className='flex flex-row items-center gap-10 py-5 px-28 '>
          <SiFreelancer onClick={() => navigate('/')} className='w-12 h-12 cursor-pointer fill-green-600' />
          <Stepper sx={{ width: '50%', paddingY: '15px' }} activeStep={activeStep}>
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: {
                optional?: ReactNode
              } = {}
              return (
                <Step
                  sx={{
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: '#00b14f'
                    },
                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                      color: '#fff'
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: '#00b14f'
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                      color: '#fff'
                    },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                      fill: '#fff'
                    }
                  }}
                  key={label}
                  {...stepProps}
                >
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </div>
        <Divider />
        <form onSubmit={handleSubmit(handleRequestSeller)} className='pb-10 px-28'>
          {activeStep === 0 && (
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-3 mt-5'>
                <h3 className='text-3xl font-bold'>Personal Info</h3>
                <p className='max-w-xl text-lg font-semibold text-gray-600'>
                  Tell us a bit about yourself. This information will appear on your public profile, so that potential
                  buyers can get to know you better.
                </p>
                <div className='flex justify-end'>
                  <span className='text-lg italic font-semibold text-gray-600'>* Mandatory fields</span>
                </div>
              </div>
              <Divider />
              <div className='flex flex-col gap-10'>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Display Name <span className='text-red-600'>*</span>
                    </label>
                    <p className='text-base italic text-gray-600'>
                      To help build credible and authentic connections with customers, they’ll now see your display
                      name.
                      <br />
                      We suggest using your first name and first initial of your last name.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <input type='text' className='w-full p-3 border border-gray-300 rounded-lg' {...register('name')} />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Profile Picture <span className='text-red-600'>*</span>
                    </label>
                    <p className='text-base italic text-gray-600'>
                      Add a profile picture of yourself so customers will know exactly who they’ll be working with.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <div
                      {...getRootProps()}
                      className='flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 '
                    >
                      {files ? (
                        <div className='w-64 h-64'>
                          <img
                            src={
                              !user?.avatar
                                ? URL.createObjectURL(files)
                                : typeof files !== 'string'
                                ? URL.createObjectURL(files)
                                : user.avatar.startsWith('upload')
                                ? `${process.env.REACT_APP_URL_SERVER}/${getValues('avatar')}`
                                : user.avatar
                            }
                            alt='Service'
                            className='object-contain w-64 h-64 mb-4 rounded-full'
                          />
                        </div>
                      ) : (
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <svg
                            className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 20 16'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                            />
                          </svg>
                          <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>Click to upload</span> or drag and drop
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'> PNG, JPG (MAX. 800x400px)</p>
                        </div>
                      )}
                      <input {...getInputProps()} id='dropzone-file' type='file' className='hidden' />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Description <span className='text-red-600'>*</span>
                    </label>
                  </div>
                  <div className='col-span-3'>
                    <textarea className='w-full p-3 border border-gray-300 rounded-lg' {...register('description')} />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Languages <span className='text-red-600'>*</span>
                    </label>
                    <p className='text-base italic text-gray-600'>
                      Select which languages you can communicate in and your proficiency level.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('language')}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Your Occupation <span className='text-red-600'>*</span>
                    </label>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('occupation')}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Skills <span className='text-red-600'>*</span>
                    </label>
                    <p className='text-base italic text-gray-600'>
                      List the skills related to the services you're offering and add your experience level.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('skill')}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Education
                    </label>
                    <p className='text-base italic text-gray-600'>
                      Add any relevant education details that will help customers to get to know you better.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('education')}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='text-xl font-semibold text-gray-600'>
                      Certification
                    </label>
                    <p className='text-base italic text-gray-600'>
                      Include any certificates or awards that are relevant to the services you're offering.
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('certification')}
                    />
                  </div>
                </div>
              </div>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <button
                  type='button'
                  className='px-5 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg'
                  disabled
                  onClick={handleBack}
                >
                  Back
                </button>
                <Box sx={{ flex: '1 1 auto' }} />
                <button
                  type='button'
                  className='px-5 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg'
                  onClick={handleNext}
                >
                  Continune
                </button>
              </Box>
            </div>
          )}
          {activeStep === 1 && (
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-3 mt-5'>
                <h3 className='text-3xl font-bold'>Account Security</h3>
                <p className='max-w-xl text-lg font-semibold text-gray-600'>
                  Trust and safety is a big deal in our community. Please verify your email and phone number so that we
                  can keep your account secured.
                </p>
              </div>
              <Divider />
              <div className='flex flex-col gap-10'>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='flex items-center gap-5 text-xl font-semibold text-gray-600'>
                      <MdOutlineEmail className='w-6 h-6' /> Email <span className='italic text-gray-400'>Private</span>
                    </label>
                  </div>
                  <div className='flex justify-end col-span-3'>
                    <div className='px-16 py-3 border border-gray-300 bg-green-50'>Verified</div>
                  </div>
                </div>
                <div className='grid grid-cols-5 gap-20'>
                  <div className='flex flex-col col-span-2 gap-2'>
                    <label htmlFor='name' className='flex items-center gap-5 text-xl font-semibold text-gray-600'>
                      <LuPhone className='w-6 h-6' /> Phone Number <span className='italic text-gray-400'>Private</span>
                    </label>
                    <p className='text-base italic text-gray-600'>We'll never share your phone number.</p>
                  </div>
                  <div className='col-span-3'>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg'
                      {...register('phone')}
                    />
                  </div>
                </div>
              </div>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <button
                  type='button'
                  className='px-5 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg'
                  onClick={handleBack}
                >
                  Back
                </button>
                <Box sx={{ flex: '1 1 auto' }} />
                <button type='submit' className='px-5 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg'>
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
                    <>Finish</>
                  )}
                </button>
              </Box>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

export default SellerPersonalInfo
