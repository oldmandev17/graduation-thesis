import React from 'react'
import { SiFiverr } from 'react-icons/si'
import { BsDot } from 'react-icons/bs'
import { AiFillFacebook, AiOutlineInstagram, AiFillTwitterSquare, AiOutlineCopyrightCircle } from 'react-icons/ai'

function Footer() {
  return (
    <div className='flex flex-col bg-[#00b14f] px-48 py-8'>
      <div className=' border-b border-b-gray-300'>
        <SiFiverr className='  h-28 w-32 fill-slate-50 ' />
      </div>
      <div className='flex flex-row flex-wrap py-8 border-b border-b-gray-300 gap-36'>
        <div className='flex flex-col gap-4 text-lg font-semibold text-white'>
          <span className='cursor-pointer'>About Fiverr</span>
          <span className='cursor-pointer'>Aboout Categories</span>
          <span className='cursor-pointer'>Blog</span>
        </div>
        <div className='flex flex-col gap-4 text-lg font-semibold text-white'>
          <span className='cursor-pointer'>Become a seller on Fiverr</span>
          <span className='cursor-pointer'>How to buy a product?</span>
        </div>
        <div className='flex flex-col gap-4 text-lg font-semibold text-white'>
          <span className='cursor-pointer'>Help Center</span>
          <span className='cursor-pointer'>FAQ</span>
        </div>
        <div className='flex flex-row gap-2 text-lg font-semibold text-white '>
          <AiFillFacebook className='h-8 w-8 rounded-2xl' />
          <AiOutlineInstagram className='h-8 w-8 rounded-2xl' />
          <AiFillTwitterSquare className='h-8 w-8 rounded-2xl' />
        </div>
      </div>
      <div className='flex flex-row justify-end py-8 items-center text-white'>
        <div className='flex flex-row pr-9'>
          <AiOutlineCopyrightCircle className='h-5 w-5 rounded-2xl fill-white pr-1' />
          <span className='text-sm font-medium'>2023 Fiverr</span>
        </div>
        <span className='cursor-pointer text-sm font-medium'>FAQ</span>

        <BsDot className='h-4 w-4' />
        <span className='cursor-pointer text-sm font-medium'>Privacy Policy</span>
      </div>
    </div>
  )
}

export default Footer
