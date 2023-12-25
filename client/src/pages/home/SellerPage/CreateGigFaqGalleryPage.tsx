/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { yupResolver } from '@hookform/resolvers/yup'
import { getGigDetailById, updateGig } from 'apis/api'
import StepNavigate from 'components/seller/StepNavigate'
import { FAQ, GigStatus, IGig } from 'modules/gig'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { CiImageOn } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import * as Yup from 'yup'

const FAQSchema = Yup.object().shape({
  question: Yup.string().required('Question is required'),
  answer: Yup.string().required('Answer is required')
})

function CreateGigFaqGalleryPage() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(FAQSchema)
  })

  const { id } = useParams<{ id?: string }>()
  const [gig, setGig] = useState<IGig>()
  const { accessToken } = getToken()
  const [show, setShow] = useState<boolean>(true)
  const [FAQs, setFAQs] = useState<Array<FAQ>>([])
  const [images, setImages] = useState<Array<File | string>>([])
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const handleAddFAQ = (values: FAQ) => {
    setFAQs([...FAQs, values])
    setShow(true)
    reset()
  }

  const getGigDetails = useCallback(async () => {
    await getGigDetailById(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
          if (response?.data?.gig && response?.data?.gig.FAQs && response?.data?.gig?.FAQs?.length > 0) {
            const temp: Array<FAQ> = []
            response?.data?.gig.FAQs.forEach((FAQ: FAQ) => temp.push({ question: FAQ.question, answer: FAQ.answer }))
            setFAQs(temp)
          }
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

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setImages([...images, droppedFiles[0]])
    },
    [images]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] }
  })

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.warning(String(arrErroes[0]?.message))
    }
  }, [errors])

  const handleRemoveImage = (index: number) => {
    const clonedImages = [...images]
    clonedImages.splice(index, 1)
    setImages(clonedImages)
  }

  useEffect(() => {
    if (gig && gig.images && gig.images.length > 0) {
      setImages(gig.images)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig])

  const handleCreateOrUpdateGigFaqGallery = async () => {
    if (FAQs.length === 0) {
      toast.warning('FAQ is required')
    } else if (images.length === 0) {
      toast.warning('Image is required')
    } else {
      const data: any = {}
      data.FAQs = FAQs
      data.name = gig?.name
      data.images = images
      data.status = GigStatus.NONE
      if (gig) {
        await updateGig(gig?._id, data, accessToken)
          .then((response) => {
            if (response.status === 200) {
              reset()
              navigate(`/user/${user?.id}/gig-create/${response.data.gig._id}/publish`)
            }
          })
          .catch((error: any) => {
            toast.error(error.response.data.error.message)
          })
      }
    }
  }

  return (
    <div>
      <StepNavigate index={3} />
      <div className='flex flex-col items-center w-full max-w-4xl gap-5 py-10 mx-auto'>
        <div className='flex flex-row justify-between w-full pb-5 border-b border-slate-300'>
          <span className='text-2xl font-semibold text-gray-500'>Frequently Asked Questions</span>
          <span
            onClick={() => setShow(false)}
            className='text-[#2bbf73]  text-sm font-bold cursor-pointer hover:underline'
          >
            + Add FQA
          </span>
        </div>
        <div className='flex flex-col w-full gap-3'>
          <span className='justify-start text-base font-semibold text-gray-500'>
            Add Questions & Answers for Your Buyers.
          </span>
          {show ? (
            <span
              onClick={() => setShow(false)}
              className='text-[#2bbf73] text-base font-semibold cursor-pointer hover:underline '
            >
              + Add FQA
            </span>
          ) : (
            <form onSubmit={handleSubmit(handleAddFAQ)} className='flex flex-col gap-3'>
              <input
                type='text'
                {...register('question')}
                className='p-1 border border-gray-400 rounded-md placeholder:text-gray-400 placeholder:font-normal '
                placeholder='Add a question: ie. Do you translate to English as well?'
              />
              <textarea
                {...register('answer')}
                className='p-1 border border-gray-400 rounded-md resize-none overscroll-none placeholder:text-gray-400 placeholder:font-normal'
                placeholder='Add an Answer: ie. Yes, I also translate from English to Hebrew '
              />
              <div className='flex flex-row justify-end gap-2 '>
                <button
                  type='button'
                  className='items-center w-16 font-semibold text-black bg-gray-200 rounded-md h-7 hover:bg-gray-300'
                  onClick={() => setShow(true)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='items-center w-16 font-semibold text-white bg-gray-900 rounded-md h-7 hover:bg-black'
                >
                  Add
                </button>
              </div>
            </form>
          )}
          {FAQs.map((FAQ, index) => (
            <div
              className='flex flex-col gap-2 p-2 font-semibold bg-white border border-gray-300'
              key={(FAQ?.question as string) + index}
            >
              <p className='p-2 border rounded-md'>{FAQ.question}</p>
              <p className='p-2 border rounded-md'>{FAQ.answer}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-col justify-between w-full py-5 border-b border-slate-300'>
          <span className='text-2xl font-semibold text-gray-500'>Showcase Your Services In A Gig Gallery</span>
          <span className='text-base font-semibold text-[#2bbf73]'>Images (up to 5)</span>
        </div>
        <div className='w-full '>
          <div className='grid grid-cols-3 gap-2 '>
            {images.map((image, index) => (
              <div key={index} className='relative bg-white border border-gray-700'>
                <img
                  className='flex items-center justify-center object-contain w-full h-40'
                  alt='gig'
                  src={
                    gig && gig.images && gig?.images?.length === 0
                      ? URL.createObjectURL(image as File)
                      : typeof image !== 'string'
                      ? URL.createObjectURL(image)
                      : `${process.env.REACT_APP_URL_SERVER}/${image}`
                  }
                />
                <button type='button' className='absolute z-10 top-2 right-2' onClick={() => handleRemoveImage(index)}>
                  <IoMdClose className='fill-red-600' />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <div
                {...getRootProps()}
                className='flex flex-col items-center justify-center h-40 bg-white border border-gray-700 border-dashed cursor-pointer'
              >
                <CiImageOn className='w-8 h-8 fill-gray-400' />
                <span className='text-base text-gray-500'>Drag & drop a photo or</span>
                <span className='text-[#5070e7] text-sm cursor-pointer'>browser</span>
                <input type='file' {...getInputProps()} name='file' className='hidden' />
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-end w-full gap-10 '>
          <button
            onClick={() => navigate(`/user/${user?.id}/gig-create/${gig?._id}/pricing`)}
            type='button'
            className='text-lg text-green-600 hover:underline'
          >
            Back
          </button>
          <button
            onClick={handleCreateOrUpdateGigFaqGallery}
            type='button'
            className='px-5 py-2 font-bold text-white bg-black rounded-xl focus:bg-blue-800'
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGigFaqGalleryPage
