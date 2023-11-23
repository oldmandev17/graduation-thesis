import StepNavigate from 'components/seller/StepNavigate'
import React from 'react'
import { BiDollar } from 'react-icons/bi'

function CreateGigPricingPage() {
  
  return (
    <div>
      <StepNavigate index={2} />
      <div className='bg-gray-50 flex flex-col items-center w-full'>
        <table className=' border border-slate-300 w-full max-w-3xl mt-20  '>
          <thead>
            <tr>
              <th className='bg-gray-100'> </th>
              <th className='text-base border font-semibold  border-slate-300 text-gray-500 bg-gray-200 text-left p-5'>
                BASIC
              </th>
              <th className='text-base border font-semibold border-slate-300 text-gray-500 bg-gray-200 text-left p-5'>
                STANDARD
              </th>
              <th className='text-base border font-semibold border-slate-300 text-gray-500 bg-gray-200 text-left p-5'>
                PREMIUM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='bg-gray-100'> </td>
              <td className='border border-slate-300 '>
                <textarea
                  className=' textarea-none w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Name your package'
                />
              </td>
              <td className='border border-slate-300  '>
                <textarea
                  className='textarea-none w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Name your package'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  className='textarea-none w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Name your package'
                />
              </td>
            </tr>
            <tr>
              <td className='bg-gray-100'> </td>
              <td className='border border-slate-300 '>
                <textarea
                  className='textarea-none  h-full w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Describe the detail of your offering'
                />
              </td>
              <td className='border border-slate-300  '>
                <textarea
                  className='textarea-none w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Describe the detail of your offering'
                />
              </td>
              <td className='border border-slate-300 '>
                <textarea
                  className='textarea-none w-full placeholder:font-normal overscroll-none text-sm font-normal focus:text-gray-800 text-gray-500'
                  placeholder='Describe the detail of your offering'
                />
              </td>
            </tr>
            <tr>
              <td className=' text-gray-500 text-left bg-gray-100 text-sm px-2 py-3 font-semibold'> Revisons</td>
              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    DELIVERY TIME
                  </option>
                  <option value='' className='text-black'>
                    5 DAYS DELIVERY
                  </option>
                  <option value='' className='text-black'>
                    10 DAYS DELIVERY
                  </option>
                </select>
              </td>

              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    DELIVERY TIME
                  </option>
                  <option value='' className='text-black'>
                    5 DAYS DELIVERY
                  </option>
                  <option value='' className='text-black'>
                    10 DAYS DELIVERY
                  </option>
                </select>
              </td>
              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    DELIVERY TIME
                  </option>
                  <option value='' className='text-black'>
                    5 DAYS DELIVERY
                  </option>
                  <option value='' className='text-black'>
                    10 DAYS DELIVERY
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td className=' text-gray-500 font-semibold text-left border border-gray-200 bg-gray-100 px-2 py-3 text-sm '>
                Number of concepts included
              </td>
              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    SELECT
                  </option>
                  <option value='' className='text-black px-5'>
                    1
                  </option>
                  <option value='' className='text-black'>
                    2
                  </option>
                </select>
              </td>

              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    SELECT
                  </option>
                  <option value='' className='text-black px-5'>
                    1
                  </option>
                  <option value='' className='text-black'>
                    2
                  </option>
                </select>
              </td>
              <td className='border border-gray-300'>
                <select name='Category' id='' className='w-full text-sm select-none text-gray-500 '>
                  <option value='' disabled selected className='text-black p-10'>
                    SELECT
                  </option>
                  <option value='' className='text-black px-5'>
                    1
                  </option>
                  <option value='' className='text-black'>
                    2
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td className='font-semibold text-gray-500 text-left border border-gray-200 bg-gray-100 px-2 py-3 text-sm '>
                Source file
              </td>
              <td className='border border-gray-200'>
                <div className='flex justify-center '>
                  <input type='checkbox' className='rounded-sm cursor-pointer checked:bg-black focus:ring-0' />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex justify-center'>
                  <input type='checkbox' className='rounded-sm cursor-pointer checked:bg-black focus:ring-0' />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex justify-center'>
                  <input type='checkbox' className='rounded-sm cursor-pointer checked:bg-black focus:ring-0' />
                </div>
              </td>
            </tr>
            <tr>
              <td className='font-semibold text-gray-500 text-left border border-gray-200 bg-gray-100 px-2 py-3 text-sm '>
                Price
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='h-4 w-4 fill-gray-500' />
                  </span>
                  <input type='number' className='select-none text-sm w-full' />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='h-4 w-4 fill-gray-500' />
                  </span>
                  <input type='number' className='select-none text-sm w-full' />
                </div>
              </td>
              <td className='border border-gray-200'>
                <div className='flex flex-row justify-around w-full'>
                  <span className='flex flex-col justify-center'>
                    <BiDollar className='h-4 w-4 fill-gray-500' />
                  </span>
                  <input type='number' className='select-none text-sm w-full' />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='flex justify-end mt-5 mb-40'>
          <button type='button' className='font-bold rounded-xl text-white bg-black p-2 focus:bg-blue-800'>
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGigPricingPage
