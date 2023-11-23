import React from 'react'

import { PiMagicWandDuotone } from 'react-icons/pi'
import { MdOutlineNavigateNext } from 'react-icons/md'
import { AiOutlineStar } from 'react-icons/ai'
import { BsFillSuitHeartFill } from 'react-icons/bs'

function LandingPage() {
  return (
    <div className='flex flex-col py-10 px-28 gap-10'>
      <div className=' font-bold text-3xl'>How's it going, VAN?</div>
      <div className='flex flex-row py-4 justify-between px-5 border border-gray-300 rounded-lg w-1/2 hover:cursor-pointer hover:shadow-lg'>
        <div className='flex flex-row gap-3'>
          <span className=' flex items-center'>
            <PiMagicWandDuotone className='h-10 w-10 fill-green-500 ' />
          </span>
          <div className='flex flex-col '>
            <span className='text-lg font-semibold text-slate-600'>Create a brief to get proposals from sellers</span>
            <span className='text-lg text-slate-600'>Let us do the searching. </span>
          </div>
        </div>
        <span className='flex items-center '>
          <MdOutlineNavigateNext className='h-8 w-8 fill-slate-500 ' />
        </span>
      </div>
      <div className='flex flex-row text-2xl font-bold gap-2'>
        <span className='text-gray-800'>Most popular Gigs in </span>
        <span className='text-[#787de7]'>Web Developer</span>
      </div>
      <div className='flex flex-row gap-10'>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />
            <div className='tooltip' data-tip='hello'>
              <BsFillSuitHeartFill className=' absolute h-5 w-5  fill-pink-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
            </div>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
      </div>
      <span className='text-2xl font-bold text-gray-800 '>Gigs you may like</span>
      <div className='flex flex-row gap-10'>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
        <div className='flex flex-col  gap-2 w-72'>
          <div className='relative'>
            <img src='./thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

            <BsFillSuitHeartFill className='absolute h-5 w-5  fill-gray-600 stroke-1 stroke-white  top-3 right-3 cursor-pointer ' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <img src='./roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
            <span className='text-sm font-bold'>Wispie_Clouda</span>
          </div>
          <span className='pt-2 text-base font-semibold text-gray-600 '>
            I will design or redesign a responsive wordpress website and ecommerce ...
          </span>
          <div className='flex flex-row gap-1'>
            <AiOutlineStar className='h-6 w-6 fill-yellow-500 ' />
            <span className='text-yellow-500 text-base font-bold'>4.9</span>
            <span className='text-base font-semibold text-gray-600'>(560)</span>
          </div>
          <span className='text-base font-bold text-black'>From $330</span>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
