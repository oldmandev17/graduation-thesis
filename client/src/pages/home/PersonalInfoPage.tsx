/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { getAllGigByUser } from 'apis/api'
import Footer from 'components/Footer'
import HeaderBuyer from 'components/buyer/HeaderBuyer'
import HeaderSeller from 'components/seller/HeaderSeller'
import { GigStatus, IGig } from 'modules/gig'
import { UserRole } from 'modules/user'
import { useCallback, useEffect, useState } from 'react'
import { GrEdit } from 'react-icons/gr'
import { IoAddCircleSharp } from 'react-icons/io5'
import { SlLocationPin, SlUser } from 'react-icons/sl'
import { TiPen } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function PersonalInfoPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { accessToken } = getToken()
  const navigate = useNavigate()
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const [status, setStatus] = useState<GigStatus>(GigStatus.ACTIVE)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  const getAllGigByUsers = useCallback(async () => {
    await getAllGigByUser(accessToken, status, 'createdAt', 'desc')
      .then((response) => {
        if (response.status === 200) {
          setGigs(response.data.gigs)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken, status])

  useEffect(() => {
    getAllGigByUsers()
  }, [getAllGigByUsers])

  return (
    <>
      {user?.role.includes(UserRole.SELLER) ? <HeaderSeller /> : <HeaderBuyer />}
      <div className='grid grid-cols-3 bg-[#f7f7f7] py-10 px-24 gap-20'>
        <div className='flex flex-col gap-10 '>
          <div className='flex flex-col items-center gap-3 px-5 bg-white border border-gray-300 py-7'>
            <div className='flex flex-col items-center w-full gap-3 pb-5 border-b border-b-gray-400'>
              <div className='flex flex-row justify-end w-full'>
                <span className='font-semibold text-sm text-[#2bbf89] border border-[#2bbf89] px-2 rounded-lg'>
                  Online
                </span>
              </div>
              {user?.avatar ? (
                <img
                  src={
                    user?.avatar.startsWith('upload')
                      ? `${process.env.REACT_APP_URL_SERVER}/${user?.avatar}`
                      : user?.avatar
                  }
                  alt='avata'
                  className='rounded-full h-28 w-28'
                />
              ) : (
                <div className='relative flex items-center justify-center bg-purple-500 rounded-full h-28 w-28'>
                  <span className='text-2xl text-white'>{user?.email[0].toUpperCase()}</span>
                </div>
              )}
              <div className='flex flex-row items-center gap-1'>
                <span className='text-xl font-bold text-gray-700'>{user?.name}</span>
                <TiPen className='cursor-pointer fill-gray-500' />
              </div>
              <span className='text-sm font-semibold text-gray-400'>@{user?.id}</span>
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
              <span className='text-base font-semibold text-gray-600'>Viet Nam</span>
            </div>
            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-row items-center gap-1'>
                <SlUser className='fill-gray-600' />
                <span className='text-base font-normal text-gray-500'>Member since</span>
              </div>
              <span className='text-base font-semibold text-gray-600'>
                {user && new Date(user.createdAt).toLocaleDateString('en-US', options as any)}
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-3 px-5 bg-white border border-grabackdrop:y-300 py-7'>
            <div id='description' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Description</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>
                  Edit Description
                </span>
              </div>
              <p className='font-medium text-gray-600'>{user?.description}</p>
            </div>
            <div id='language' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Language</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <div className='flex flex-row gap-1'>
                <span className='font-medium text-gray-600'>{user?.language}</span>
              </div>
            </div>
            <div id='skill' className='flex flex-col gap-4 py-3 pb-10 border-b border-b-gray-300'>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Skill</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {user?.skill?.split(',').map((skill) => (
                  <span className='px-2 text-gray-700 border border-gray-300 rounded-md w-fit' key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div id='education' className='flex flex-col gap-4 py-3 '>
              <div className='flex flex-row justify-between'>
                <span className='text-base font-bold text-gray-800'>Education</span>
                <span className='font-normal text-base text-[#10769a] hover:underline cursor-pointer'>Add new</span>
              </div>
              <span className='font-normal text-gray-500'>{user?.education}</span>
            </div>
          </div>
        </div>
        {user?.role.includes(UserRole.SELLER) && (
          <div className='flex flex-col w-full col-span-2 gap-10'>
            <div className='flex flex-row gap-16 p-3 bg-white border border-gray-300'>
              <button
                type='button'
                className={`font-semibold text-base text-gray-500 hover:text-[#2bbf89] pb-1 cursor-pointer ${
                  status === GigStatus.ACTIVE && 'border-b-4 border-b-[#2bbf89]'
                }`}
                onClick={() => setStatus(GigStatus.ACTIVE)}
              >
                ACTIVE GIGS
              </button>
              <button
                type='button'
                className={`font-semibold pb-1 text-base text-gray-500 hover:text-[#2bbf89] cursor-pointer ${
                  status === GigStatus.NONE && 'border-b-4 border-b-[#2bbf89]'
                }`}
                onClick={() => setStatus(GigStatus.NONE)}
              >
                Draft
              </button>
            </div>
            <div className='grid grid-cols-3 gap-5 '>
              {gigs.length > 0 &&
                gigs.map((gig, index) => (
                  <div key={gig._id + index} className='border border-slate-300'>
                    <img
                      src={
                        gig && gig.images && gig.images?.length > 0
                          ? `${process.env.REACT_APP_URL_SERVER}/${gig.images[0]}`
                          : ''
                      }
                      alt={gig?.name}
                      className='object-cover w-full h-40'
                    />
                    <div className='flex flex-col justify-between w-full p-4 bg-white h-28 '>
                      <button
                        type='button'
                        onClick={() =>
                          navigate(`/user/${gig && gig.createdBy && gig.createdBy.id}/gig-detail/${gig._id}`)
                        }
                        className='text-base font-normal text-left'
                      >
                        {gig?.name}
                      </button>
                      <div className='flex justify-between'>
                        <GrEdit
                          className='cursor-pointer'
                          onClick={() =>
                            navigate(`/user/${gig && gig.createdBy && gig.createdBy.id}/gig-create/${gig._id}/overview`)
                          }
                        />
                        <p className='text-xs'>
                          STARTING AT{' '}
                          <span className='text-base font-semibold'>
                            ${gig && gig.packages && gig.packages.length > 0 && gig.packages[0]?.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className='flex flex-col items-center justify-center w-full gap-3 border h-[272px] border-slate-300 bg-white cursor-pointer'
                onClick={() => navigate(`/user/${user?.id}/gig-create/overview`)}
              >
                <IoAddCircleSharp className='w-20 h-20 text-gray-900' />
                <p className='text-lg font-semibold'>Create a new Gig</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default PersonalInfoPage
