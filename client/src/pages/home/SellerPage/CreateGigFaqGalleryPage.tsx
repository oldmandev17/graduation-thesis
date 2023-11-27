/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import StepNavigate from 'components/seller/StepNavigate'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { CiImageOn } from 'react-icons/ci'

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

  const [show, setShow] = useState<boolean>(true)
  const [FAQs, setFAQs] = useState<Array<{ question: string; answer: string }>>([])
  const [images, setImages] = useState<Array<string>>(['123', '345'])

  const handleAddFAQ = (values: { question: string; answer: string }) => {
    setFAQs([...FAQs, values])
    setShow(true)
    reset()
  }

  useEffect(() => {
    const arrErroes = Object.values(errors)
    if (arrErroes.length > 0) {
      toast.warning(String(arrErroes[0]?.message))
    }
  }, [errors])

  return (
    <div className='bg-gray-50 '>
      <StepNavigate index={3} />
      <div className='flex flex-col items-center w-full max-w-3xl mx-auto mt-10 gap-7'>
        <div className='flex flex-row justify-between w-full py-5 border-b border-slate-300'>
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
                className='border border-gray-400 rounded-md placeholder:text-gray-400 placeholder:font-normal '
                placeholder='Add a question: ie. Do you translate to English as well?'
              />
              <textarea
                {...register('answer')}
                className='border border-gray-400 rounded-md resize-none overscroll-none placeholder:text-gray-400 placeholder:font-normal'
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
            <div className='flex flex-col gap-2 p-2 font-semibold border border-gray-300' key={FAQ.question + index}>
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
              <img
                className='flex items-center justify-center h-32 border border-gray-700'
                key={image + index}
                alt='gig'
                src={image}
              />
            ))}
            <div className='flex flex-col items-center justify-center h-32 border border-gray-700 border-dashed'>
              <CiImageOn className='w-8 h-8 fill-gray-400 ' />
              <span className='text-base text-gray-500'>Drag & drop a photo or</span>
              <span className='text-[#5070e7] text-sm cursor-pointer'>browser</span>
              <input type='file' multiple name='file' className='appearance-none ' />
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center mt-10 mb-40'>
        <button type='button' className='p-2 font-bold text-white bg-black rounded-xl focus:bg-blue-800'>
          Save & Continue
        </button>
      </div>
    </div>
  )
}

export default CreateGigFaqGalleryPage
