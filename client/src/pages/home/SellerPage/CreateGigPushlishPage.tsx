import StepNavigate from 'components/seller/StepNavigate'
import React from 'react'

function CreateGigPushlishPage() {
  const getCheckedInputIds = () => {
    const checkedIds: string[] = []

    document.querySelectorAll<HTMLInputElement>('input[name=check]').forEach((input) => {
      if (input.checked) {
        checkedIds.push(input.id)
      }
    })

    return checkedIds
  }

  const handleCheckElement = () => {
    const publishBtn = document.getElementById('publish') as HTMLButtonElement
    if (publishBtn) {
      if (getCheckedInputIds().length === 4) {
        publishBtn.disabled = false
      } else {
        publishBtn.disabled = true
      }
    }
  }

  return (
    <div className='bg-gray-50'>
      <StepNavigate index={4} />
      <div className='flex flex-col gap-10 my-10 border border-gray-200 rounded-md bg-white mx-60 py-16 '>
        <div className='flex flex-col items-center gap-5 '>
          <img src='/image/publish.png' alt='pushlishingimage' className='h-24 w-56' />
          <span className='text-xl text-gray-800 font-bold'>You're almost there!</span>
        </div>
        <div className='flex flex-col px-10 gap-5'>
          <span className='font-bold text-base text-gray-700 text-start'>
            You just need to complete the following requirements to start selling:
          </span>
          <div className='flex flex-col border border-gray-400 gap-5 py-5 px-7'>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input
                name='check'
                onClick={handleCheckElement}
                id='check1'
                type='checkbox'
                className='rounded-sm checked:bg-green-500 input-none'
              />
              <span className='text-sm text-gray-600'>
                <b>Information Collection: </b>Fiverr uses the collected information to provide and improve its
                services, facilitate transactions, and personalize user experience. Personal information is used for
                account management, communication, and to comply with legal obligations.
              </span>
            </div>
            <div className='border border-gray-200 flex flex-row p-2 rounded-md items-center gap-3'>
              <input
                name='check'
                onClick={handleCheckElement}
                id='check2'
                type='checkbox'
                className='rounded-sm checked:bg-green-500 input-none'
              />
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
              <input
                name='check'
                onClick={handleCheckElement}
                id='check3'
                type='checkbox'
                className='rounded-sm checked:bg-green-500 input-none'
              />
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
              <input
                name='check'
                onClick={handleCheckElement}
                id='check4'
                type='checkbox'
                className='rounded-sm checked:bg-green-500 input-none'
              />
              <span className='text-sm text-gray-600'>
                <b>Security: </b>Fiverr employs security measures to protect user information from unauthorized access,
                disclosure, alteration, and destruction.
                <br /> Users are encouraged to choose strong passwords and take appropriate security measures on their
                end.
              </span>
            </div>
            <div className='flex flex-row justify-end'>
              <button
                disabled
                id='publish'
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
