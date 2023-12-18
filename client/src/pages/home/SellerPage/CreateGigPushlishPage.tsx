/* eslint-disable no-underscore-dangle */
import { getGigDetailById, updateGig } from 'apis/api'
import StepNavigate from 'components/seller/StepNavigate'
import { GigStatus, IGig } from 'modules/gig'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function CreateGigPushlishPage() {
  const { id } = useParams<{ id?: string }>()
  const [gig, setGig] = useState<IGig>()
  const { accessToken } = getToken()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const getCheckedInputIds = () => {
    const checkedIds: string[] = []

    document.querySelectorAll<HTMLInputElement>('input[name=check]').forEach((input) => {
      if (input.checked) {
        checkedIds.push(input.id)
      }
    })

    return checkedIds
  }

  const getGigDetails = useCallback(async () => {
    await getGigDetailById(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
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

  const handlePublishGig = async () => {
    if (getCheckedInputIds().length < 4) {
      toast.warning('Please accept all requirements')
    } else {
      const data: any = {}
      data.name = gig?.name
      data.status = GigStatus.WAITING
      if (gig) {
        await updateGig(gig?._id, data, accessToken)
          .then((response) => {
            if (response.status === 200) {
              navigate(`/user/${user?.id}/gigs`)
            }
          })
          .catch((error: any) => {
            toast.error(error.response.data.error.message)
          })
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Edit Gig | Freelancer</title>
      </Helmet>
      <div>
        <StepNavigate index={4} />
        <div className='flex flex-col w-full max-w-4xl gap-10 pt-16 mx-auto mt-10 bg-white border pb-7 border-slate-300 '>
          <div className='flex flex-col items-center gap-5 '>
            <img src='/images/publish.png' alt='pushlishingimage' className='w-56 h-24' />
            <span className='text-xl font-bold text-gray-800'>You're almost there!</span>
          </div>
          <div className='flex flex-col gap-5 px-10'>
            <span className='text-base font-bold text-gray-700 text-start'>
              You just need to complete the following requirements to start selling:
            </span>
            <div className='flex flex-col gap-5 px-5 py-5 border border-gray-400'>
              <div className='flex flex-row items-center gap-3 p-2 border border-gray-200 rounded-md'>
                <input
                  name='check'
                  id='check1'
                  type='checkbox'
                  className='w-4 h-4 rounded-sm cursor-pointer accent-black checked:bg-black focus:ring-0'
                />
                <span className='text-gray-600 text-md text-'>
                  <b>Information Collection: </b>Fiverr uses the collected information to provide and improve its
                  services, facilitate transactions, and personalize user experience. Personal information is used for
                  account management, communication, and to comply with legal obligations.
                </span>
              </div>
              <div className='flex flex-row items-center gap-3 p-2 border border-gray-200 rounded-md'>
                <input
                  name='check'
                  id='check2'
                  type='checkbox'
                  className='w-4 h-4 rounded-sm cursor-pointer accent-black checked:bg-black focus:ring-0'
                />
                <span className='text-gray-600 text-md'>
                  <b>Use of Information: </b>Fiverr collects personal information when users register on the platform,
                  create a profile, or engage in transactions. It may also collect non-personal information such as IP
                  addresses, device information, and usage patterns. Fiverr may also collect non-personal information
                  such as IP addresses, device information, and usage patterns.
                </span>
              </div>
              <div className='flex flex-row items-center gap-3 p-2 border border-gray-200 rounded-md'>
                <input
                  name='check'
                  id='check3'
                  type='checkbox'
                  className='w-4 h-4 rounded-sm cursor-pointer accent-black checked:bg-black focus:ring-0'
                />
                <span className='text-gray-600 text-md'>
                  <b>Sharing of Information: </b>Fiverr may share personal information with service providers, business
                  partners, or third parties for purposes such as payment processing, fraud prevention, and customer
                  support. User profiles and gig information may be visible to other users on the platform. Fiverr does
                  not sell personal information to third parties.
                </span>
              </div>
              <div className='flex flex-row items-center gap-3 p-2 border border-gray-200 rounded-md'>
                <input
                  name='check'
                  id='check4'
                  type='checkbox'
                  className='w-4 h-4 rounded-sm cursor-pointer accent-black checked:bg-black focus:ring-0'
                />
                <span className='text-gray-600 text-md'>
                  <b>Security: </b>Fiverr employs security measures to protect user information from unauthorized
                  access, disclosure, alteration, and destruction. Users are encouraged to choose strong passwords and
                  take appropriate security measures on their end.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end w-full max-w-4xl gap-10 pb-10 mx-auto mt-5'>
          <button
            onClick={() => navigate(`/user/${user?.id}/gig-create/${gig?._id}/faq&gallery`)}
            type='button'
            className='text-lg text-green-600 hover:underline'
          >
            Back
          </button>
          <button
            type='button'
            onClick={handlePublishGig}
            className='px-5 py-2 font-bold text-white bg-black rounded-xl focus:bg-blue-800'
          >
            Public Gig
          </button>
        </div>
      </div>
    </>
  )
}
export default CreateGigPushlishPage
