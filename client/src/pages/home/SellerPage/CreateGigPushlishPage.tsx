/* eslint-disable no-underscore-dangle */
import { getGigDetail, updateGig } from 'apis/api'
import StepNavigate from 'components/seller/StepNavigate'
import { GigStatus, IGig } from 'modules/gig'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function CreateGigPushlishPage() {
  const { slug } = useParams<{ slug?: string }>()
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
    await getGigDetail(slug, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setGig(response?.data?.gig)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, accessToken])

  useEffect(() => {
    if (gig) {
      if (gig.createdBy?._id !== user?._id) {
        navigate('/auth/unAuthorize')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig, user?._id])

  useEffect(() => {
    if (slug) {
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
              navigate(`/${user?.id}/gig`)
            }
          })
          .catch((error: any) => {
            toast.error(error.response.data.error.message)
          })
      }
    }
  }

  return (
    <div className='bg-gray-50'>
      <StepNavigate index={4} />
      <div className='flex flex-col gap-10 my-10 border border-gray-200 rounded-md bg-white w-full max-w-4xl mx-auto py-16 '>
        <div className='flex flex-col items-center gap-5 '>
          <img src='/images/publish.png' alt='pushlishingimage' className='h-24 w-56' />
          <span className='text-xl text-gray-800 font-bold'>You're almost there!</span>
        </div>
        <div className='flex flex-col px-10 gap-5'>
          <span className='font-bold text-base text-gray-700 text-start'>
            You just need to complete the following requirements to start selling:
          </span>
          <div className='flex flex-col border border-gray-400 gap-5 py-5 px-7'>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input name='check' id='check1' type='checkbox' className='rounded-sm checked:bg-green-500 input-none' />
              <span className='text-sm text-gray-600'>
                <b>Information Collection: </b>Fiverr uses the collected information to provide and improve its
                services, facilitate transactions, and personalize user experience. Personal information is used for
                account management, communication, and to comply with legal obligations.
              </span>
            </div>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input name='check' id='check2' type='checkbox' className='rounded-sm checked:bg-green-500 input-none' />
              <span className='text-sm text-gray-600'>
                <b>Use of Information: </b>Fiverr collects personal information when users register on the platform,
                create a profile, or engage in transactions.
                <br /> It may also collect non-personal information such as IP addresses, device information, and usage
                patterns. <br />
                Fiverr may also collect non-personal information such as IP addresses, device information, and usage
                patterns.
              </span>
            </div>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input name='check' id='check3' type='checkbox' className='rounded-sm checked:bg-green-500 input-none' />
              <span className='text-sm text-gray-600'>
                <b>Sharing of Information: </b>Fiverr may share personal information with service providers, business
                partners, or third parties for purposes such as payment processing, fraud prevention, and customer
                support.
                <br /> User profiles and gig information may be visible to other users on the platform.
                <br />
                Fiverr does not sell personal information to third parties.
              </span>
            </div>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input name='check' id='check4' type='checkbox' className='rounded-sm checked:bg-green-500 input-none' />
              <span className='text-sm text-gray-600'>
                <b>Security: </b>Fiverr employs security measures to protect user information from unauthorized access,
                disclosure, alteration, and destruction.
                <br /> Users are encouraged to choose strong passwords and take appropriate security measures on their
                end.
              </span>
            </div>
            <div className='flex flex-row justify-end'>
              <button
                onClick={handlePublishGig}
                type='button'
                className='p-2 rounded-lg text-base text-white font-bold bg-[#1dbf73] disabled:bg-gray-400'
              >
                Save and Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateGigPushlishPage
