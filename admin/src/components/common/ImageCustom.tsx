/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

function ImageCustom({ name, mode, accept }: { name: string; mode: string; accept: any }) {
  const { register, unregister, setValue, watch, getValues } = useFormContext()
  const files = watch(name)

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setValue(name, droppedFiles[0], { shouldValidate: true })
    },
    [setValue, name]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept
  })

  useEffect(() => {
    register(name)
    return () => {
      unregister(name)
    }
  }, [register, unregister, name])

  return (
    <div className='flex items-center justify-center w-full'>
      <div
        {...getRootProps()}
        className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
      >
        {files ? (
          <div className='w-full h-full'>
            <img
              src={
                mode === 'create'
                  ? URL.createObjectURL(files)
                  : typeof files !== 'string'
                  ? URL.createObjectURL(files)
                  : `${process.env.REACT_APP_URL_SERVER}/${getValues(name)}`
              }
              alt='Service'
              className='object-contain w-full h-full mb-4 rounded-lg'
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
  )
}

export default ImageCustom
