import { SiFiverr } from 'react-icons/si'
import { TbBrandFiverr } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

function UnAuthorize() {
  const navigate = useNavigate()

  return (
    <section>
      <div className='flex flex-col items-center justify-center px-6 py-32 mx-auto '>
        <a href='/' className='flex items-center gap-3 mb-6 text-gray-900 fot-semibold te-xt-2xl dark:text-white'>
          <TbBrandFiverr className='w-10 h-10 p-2 bg-green-400 rounded-full fill-white' />
          <SiFiverr className='w-20 h-20 dark:fill-white fill-black' />
        </a>
        <div className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8'>
          <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
            Access Denied
          </h2>
          <div className='mt-4 space-y-4 lg:mt-5 md:space-y-5'>
            <div>
              <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                You are not authorized to access this page. Please log in or contact support.
              </p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              Back To Home
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UnAuthorize
