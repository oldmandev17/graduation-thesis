import React from 'react'
import { SiFiverr } from 'react-icons/si'
import { BsDot } from 'react-icons/bs'
import { AiFillFacebook, AiOutlineInstagram, AiFillTwitterSquare, AiOutlineCopyrightCircle } from 'react-icons/ai'

function Footer() {
  return (
    <div className='flex flex-col bg-[#00b14f] px-48 py-4'>
      <div className='border-b border-b-gray-300'>
        <SiFiverr className='w-32 h-28 fill-slate-50' />
      </div>
      <div className='grid grid-cols-4 py-8 border-b border-b-gray-300 gap-36'>
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
          <AiFillFacebook className='w-8 h-8 rounded-2xl' />
          <AiOutlineInstagram className='w-8 h-8 rounded-2xl' />
          <AiFillTwitterSquare className='w-8 h-8 rounded-2xl' />
        </div>
      </div>
      <div className='flex flex-row items-center justify-end py-8 text-white'>
        <div className='flex flex-row pr-9'>
          <AiOutlineCopyrightCircle className='w-5 h-5 pr-1 rounded-2xl fill-white' />
          <span className='text-sm font-medium'>2023 Fiverr</span>
        </div>
        <span className='text-sm font-medium cursor-pointer'>FAQ</span>
        <BsDot className='w-4 h-4' />
        <span className='text-sm font-medium cursor-pointer'>Privacy Policy</span>
      </div>
    </div>
  )
}

export default Footer
