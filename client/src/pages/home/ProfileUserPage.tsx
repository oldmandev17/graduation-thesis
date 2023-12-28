/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
import { getUserById } from 'apis/api'
import GigCard from 'components/common/GigCard'
import { IUser } from 'modules/user'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { GrSend } from 'react-icons/gr'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'

function ProfileUserPage() {
  const location = useLocation()
  const [userDetail, setUserDetail] = useState<IUser>()
  const { id } = useParams<{ id?: string }>()
  const [all, setAll] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const getUserDetailById = useCallback(async () => {
    await getUserById(id)
      .then((response) => {
        if (response.status === 200) {
          setUserDetail(response.data.user)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [id])

  useEffect(() => {
    if (id) {
      getUserDetailById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserDetailById])

  const handleContactMe = () => {
    if (!user) {
      navigate('/auth/login')
      localStorage.setItem('redirect', String(location.pathname))
    } else {
      navigate(`/user/${user?.id}/messages?to=${userDetail?.id}`)
    }
  }

  return (
    <>
      <Helmet>
        <title>{userDetail && userDetail.name ? `${userDetail.name}` : ''} Profile | Freelancer</title>
      </Helmet>
      <div className='flex flex-col gap-10 py-10 px-28'>
        <div className='grid grid-cols-3 gap-10'>
          <div className='flex flex-col col-span-2 gap-5'>
            <div className='flex gap-5'>
              <img src='' alt='avatar' />
            </div>
            <div>
              <h6 className='text-xl font-semibold text-gray-700'>About me</h6>
              <p className='mt-3'>{userDetail?.description}</p>
            </div>
            <div>
              <h6 className='text-xl font-semibold text-gray-700'>Skill</h6>
              <p className='mt-3'>{userDetail?.skill?.replace(',', '')}</p>
            </div>
          </div>
          <div>
            <div className='p-5 border rounded-md shadow-sm border-slate-300'>
              <button
                onClick={handleContactMe}
                type='button'
                className='flex items-center justify-center w-full gap-3 p-3 text-lg font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-500'
              >
                <GrSend className='fill-white' />
                Contact me
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4 className='text-2xl font-semibold text-gray-700'>My Gig</h4>
          <div className='mt-3'>
            <div className='grid grid-cols-4 gap-10'>
              {userDetail &&
                userDetail.gigs.length > 0 &&
                userDetail.gigs
                  .slice(0, all ? userDetail.gigs.length : 4)
                  .map((gig, index) => <GigCard height={200} key={gig?._id + index} gig={gig} type='profile' />)}
            </div>
            {userDetail && userDetail.gigs.length > 4 && !all && (
              <button onClick={() => setAll(true)} className='p-2 border border-black rounded-lg' type='button'>
                View All ({userDetail.gigs.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileUserPage
