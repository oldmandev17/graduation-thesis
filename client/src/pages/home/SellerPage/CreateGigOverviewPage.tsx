import StepNavigate from 'components/seller/StepNavigate'

function CreateGigOverviewPage() {
  return (
    <div>
      <StepNavigate index={1} />
      <div className='bg-gray-50 flex flex-col items-center  '>
        <div className='border-[1px] border-gray-500 rounded-md w-full max-w-3xl bg-white my-20 flex flex-col p-10 gap-5'>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2 '>
              <span className='text-lg font-semibold'>Gig Title</span>
              <span className='text-base'>
                As your Gig storefront, your
                <span className='font-bold'> title is the most important place </span>
                to include keywords that buyers would likely use to search for a service like yours.
              </span>
            </div>
            
              <textarea
                rows={5}
                id='title'
                className='resize-none rounded-lg border-[1px] border-gray-500 text-base font-normal focus:text-gray-900 text-gray-700 w-full no-scrollbar'
              />
            
          </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2'>
              <span className='text-lg font-semibold'>Categories</span>
              <span className='text-base'>Choose the category and sub-category most suitable for your Gig.</span>
            </div>
            <div className='grid grid-cols-2 gap-10 w-full'>
              <div>
                <select name='Category' id='' className='w-full rounded-lg text-sm  '>
                  <option value='' disabled selected>
                    CATEGORY
                  </option>
                  <option value=''>Graphics & Design</option>
                  <option value=''>Programming & Tech</option>
                </select>
              </div>
              <div>
                <select name='Category' id='' className='w-full rounded-lg text-sm '>
                  <option value='' disabled selected>
                    SUB-CATEGORY
                  </option>
                  <option value=''>Graphics & Design</option>
                  <option value=''>Programming & Tech</option>
                </select>
              </div>
            </div>
          </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2 '>
              <span className='text-lg font-semibold'>Description</span>
              <span className='text-base'>Briefly Describe Your Gig</span>
            </div>
            
              <textarea rows={5} id='describe' className='no-scrollbar rounded-lg border-[1px] border-gray-500 w-full h-36  text-base font-normal focus:text-gray-900 text-gray-700 ' />
            
          </div>
          <div className='flex justify-end'>
            <button type='button' className='font-bold rounded-xl text-white bg-black p-2 focus:bg-blue-800'>
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGigOverviewPage
