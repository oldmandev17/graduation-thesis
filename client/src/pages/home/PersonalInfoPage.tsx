import Footer from 'components/Footer'
import HeaderBuyer from 'components/buyer/HeaderBuyer'
import HeaderSeller from 'components/seller/HeaderSeller'
import { UserRole } from 'modules/user'
import { SlLocationPin, SlUser } from 'react-icons/sl'
import { TiPen } from 'react-icons/ti'
import { useAppSelector } from 'stores/hooks'

function PersonalInfoPage() {
  const { user } = useAppSelector((state) => state.auth)
  return (
    <>
      {user?.role.includes(UserRole.SELLER) ? <HeaderSeller /> : <HeaderBuyer />}
      <div className='flex flex-row justify-between bg-[#f7f7f7] pt-20 px-24 gap-28'>
        <div className='flex flex-col w-1/2 gap-5 '>
          <div className='flex flex-col items-center gap-3 px-5 bg-white border border-gray-300 py-7'>
            <div className='flex flex-col items-center w-full gap-3 pb-5 border-b border-b-gray-400'>
              <div className='flex flex-row justify-end w-full'>
                <span className='font-semibold text-sm text-[#2bbf89] border border-[#2bbf89] px-2 rounded-lg'>
                  Online
                </span>
              </div>
              <img src='/image/roses.jpg' className='rounded-full h-28 w-28' alt='avata' />
              <div className='flex flex-row items-center gap-1'>
                <span className='text-xl font-bold text-gray-700'>Doan Van</span>
                <TiPen className='cursor-pointer fill-gray-500' />
              </div>
              <span className='text-sm font-semibold text-gray-400'>@doanvan1104</span>
              <button
                type='button'
                className='w-full py-1 font-semibold text-gray-600 border border-gray-400 rounded-md hover:text-white hover:bg-gray-500 '
              >
                Preview Fiverr Profile
              </button>
            </div>
            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-row items-center gap-1'>
                <SlLocationPin className='fill-gray-600' />
                <span className='text-base font-normal text-gray-500'>From</span>
              </div>
              <span className='text-base font-semibold text-gray-600'>Indonesia</span>
            </div>
            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-row items-center gap-1'>
                <SlUser className='fill-gray-600' />
                <span className='text-base font-normal text-gray-500'>Member since</span>
              </div>
              <span className='text-base font-semibold text-gray-600'>Oct 2021</span>
            </div>
          </div>
          <div className='flex flex-col gap-3 px-5 mb-10 bg-white border border-gray-300 py-7'>
            <div id='description' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Description</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>
                  Edit Description
                </span>
              </div>
              <p className='font-medium text-gray-600'>
                During the interview process, the hiring manager may ask you questions regarding your experience and
                duties at your current position. They may do this to understand if your skills and responsibilities
                align well with the projects they need completed at their company. You should explain your current job
                responsibilities and duties clearly and in detail to help them visualize the tasks you successfully
                complete.
              </p>
            </div>
            <div id='language' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Language</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <div className='flex flex-row gap-1'>
                <span className='font-medium text-gray-600'>English</span>
                <p>-</p>
                <span className='font-medium text-gray-400'>Fluent</span>
              </div>
            </div>
            <div id='skill' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Skill</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <span className='px-2 text-gray-700 border border-gray-300 rounded-md w-fit'>UX Designer</span>
            </div>
            <div id='education' className='flex flex-col gap-4 py-3 '>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Education</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <span className='font-normal text-gray-500'>University of technology Jarkata</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row justify-between p-3 bg-white border border-gray-300'>
            <span className='font-semibold text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer border-b-4 border-b-[#2bbf89]'>
              ACTIVE GIGS{' '}
            </span>
            <span className='font-semibold text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer'>Draft </span>
            <span className='font-semibold text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer'>
              ACTIVE GIGS{' '}
            </span>
            <span className='font-semibold text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer'>
              ACTIVE GIGS{' '}
            </span>
            <span className='font-semibold text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer'>
              ACTIVE GIGS{' '}
            </span>
          </div>
          <div className=''> </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PersonalInfoPage
