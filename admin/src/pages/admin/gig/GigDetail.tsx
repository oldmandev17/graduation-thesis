import Carousel from 'components/common/Carousel'
import Fancybox from 'components/common/Fancybox'

function GigDetail() {
  return (
    <div className='grid grid-cols-5 gap-10'>
      <div className='col-span-3 flex flex-col gap-8'>
        <nav
          className='flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
          aria-label='Breadcrumb'
        >
          <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
            <li className='inline-flex items-center'>
              <a
                href='/#'
                className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
              >
                <svg
                  className='w-3 h-3 me-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className='flex items-center'>
                <svg
                  className='rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <a
                  href='/#'
                  className='ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                >
                  Templates
                </a>
              </div>
            </li>
            <li aria-current='page'>
              <div className='flex items-center'>
                <svg
                  className='rtl:rotate-180  w-3 h-3 mx-1 text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <span className='ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400'>Flowbite</span>
              </div>
            </li>
          </ol>
        </nav>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-semibold dark:text-white'>Payments tool for companies</h2>
          <div className='flex items-center mb-4'>
            <img className='w-16 h-16 me-4 rounded-full' src='/docs/images/people/profile-picture-5.jpg' alt='' />
            <div className='font-medium dark:text-white'>
              <div className='flex items-center gap-5'>
                <span>Jese Leos</span>|<span className='text-sm text-gray-500 dark:text-gray-400'>@</span>
              </div>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-300 dark:text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 20'
                >
                  <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                </svg>
                <span>4,9</span>
                <span className='text-md text-gray-500 dark:text-gray-400 underline'>(123)</span>
              </div>
            </div>
          </div>
          <div>
            <Fancybox
              options={{
                Carousel: {
                  infinite: false
                }
              }}
            >
              <Carousel options={{ infinite: false }}>
                <div
                  className='f-carousel__slide'
                  data-fancybox='gallery'
                  data-src='https://lipsum.app/id/60/1600x1200'
                  data-thumb-src='https://lipsum.app/id/60/200x150'
                >
                  <img alt='' src='https://lipsum.app/id/60/400x300' width='400' height='300' />
                </div>
                <div
                  className='f-carousel__slide'
                  data-fancybox='gallery'
                  data-src='https://lipsum.app/id/61/1600x1200'
                  data-thumb-src='https://lipsum.app/id/61/200x150'
                >
                  <img alt='' src='https://lipsum.app/id/61/400x300' width='400' height='300' />
                </div>
                <div
                  className='f-carousel__slide'
                  data-fancybox='gallery'
                  data-src='https://lipsum.app/id/62/1600x1200'
                  data-thumb-src='https://lipsum.app/id/62/200x150'
                >
                  <img alt='' src='https://lipsum.app/id/62/400x300' width='400' height='300' />
                </div>
                <div
                  className='f-carousel__slide'
                  data-fancybox='gallery'
                  data-src='https://lipsum.app/id/63/1600x1200'
                  data-thumb-src='https://lipsum.app/id/63/200x150'
                >
                  <img alt='' src='https://lipsum.app/id/63/400x300' width='400' height='300' />
                </div>
                <div
                  className='f-carousel__slide'
                  data-fancybox='gallery'
                  data-src='https://lipsum.app/id/64/1600x1200'
                  data-thumb-src='https://lipsum.app/id/64/200x150'
                >
                  <img alt='' src='https://lipsum.app/id/64/400x300' width='400' height='300' />
                </div>
              </Carousel>
            </Fancybox>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='text-gray-500 dark:text-gray-400'>
            Track work across the enterprise through an open, collaborative platform. Link issues across Jira and ingest
            data from other software development tools, so your IT support and operations teams have richer contextual
            information to rapidly respond to requests, incidents, and changes.
          </p>
          <p className='text-gray-500 dark:text-gray-400'>
            Deliver great service experiences fast - without the complexity of traditional ITSM solutions.Accelerate
            critical development work, eliminate toil, and deploy changes with ease, with a complete audit trail for
            every change.
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center mb-4'>
            <img className='w-16 h-16 me-4 rounded-full' src='/docs/images/people/profile-picture-5.jpg' alt='' />
            <div className='font-medium dark:text-white'>
              <div className='flex items-center gap-5'>
                <span>Jese Leos</span>|<span className='text-sm text-gray-500 dark:text-gray-400'>@</span>
              </div>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-300 dark:text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 20'
                >
                  <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                </svg>
                <span>4,9</span>
                <span className='text-md text-gray-500 dark:text-gray-400 underline'>(123)</span>
              </div>
            </div>
          </div>

          <div className='grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2 bg-white dark:bg-gray-800'>
            <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-ss-lg md:border-e dark:bg-gray-800 dark:border-gray-700'>
              <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Very easy this was to integrate</h3>
                <p className='my-4'>If you care for your time, I hands down would go with this."</p>
              </blockquote>
              <figcaption className='flex items-center justify-center '>
                <img
                  className='rounded-full w-9 h-9'
                  src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png'
                  alt='profile'
                />
                <div className='space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3'>
                  <div>Bonnie Green</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400 '>Developer at Open AI</div>
                </div>
              </figcaption>
            </figure>
            <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 md:rounded-se-lg dark:bg-gray-800 dark:border-gray-700'>
              <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Solid foundation for any project
                </h3>
                <p className='my-4'>
                  Designing with Figma components that can be easily translated to the utility classNamees of Tailwind
                  CSS is a huge timesaver!"
                </p>
              </blockquote>
              <figcaption className='flex items-center justify-center '>
                <img
                  className='rounded-full w-9 h-9'
                  src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png'
                  alt='profile'
                />
                <div className='space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3'>
                  <div>Roberta Casas</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>Lead designer at Dropbox</div>
                </div>
              </figcaption>
            </figure>
            <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 md:rounded-es-lg md:border-b-0 md:border-e dark:bg-gray-800 dark:border-gray-700'>
              <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Mindblowing workflow</h3>
                <p className='my-4'>
                  Aesthetically, the well designed components are beautiful and will undoubtedly level up your next
                  application."
                </p>
              </blockquote>
              <figcaption className='flex items-center justify-center '>
                <img
                  className='rounded-full w-9 h-9'
                  src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png'
                  alt='profile'
                />
                <div className='space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3'>
                  <div>Jese Leos</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>Software Engineer at Facebook</div>
                </div>
              </figcaption>
            </figure>
            <figure className='flex flex-col items-center justify-center p-8 text-center bg-white border-gray-200 rounded-b-lg md:rounded-se-lg dark:bg-gray-800 dark:border-gray-700'>
              <blockquote className='max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Efficient Collaborating</h3>
                <p className='my-4'>
                  You have many examples that can be used to create a fast prototype for your team."
                </p>
              </blockquote>
              <figcaption className='flex items-center justify-center '>
                <img
                  className='rounded-full w-9 h-9'
                  src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png'
                  alt='profile'
                />
                <div className='space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3'>
                  <div>Joseph McFall</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>CTO at Google</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>

        <div id='detailed-pricing' className='w-full overflow-x-auto'>
          <div className='overflow-hidden min-w-max'>
            <div className='grid grid-cols-4 p-4 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200 gap-x-16 dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <div className='flex items-center'>Tailwind CSS code</div>
              <div>Community Edition</div>
              <div>Developer Edition</div>
              <div>Designer Edition</div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>
                Basic components (
                <a href='/#' className='text-blue-600 hover:underline'>
                  view all
                </a>
                )
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>
                Application UI (
                <a href='/#' className='text-blue-600 hover:underline'>
                  view demo
                </a>
                )
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>Marketing UI pre-order</div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400'>E-commerce UI pre-order</div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-green-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 16 12'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 5.917 5.724 10.5 15 1.5'
                  />
                </svg>
              </div>
              <div>
                <svg
                  className='w-3 h-3 text-red-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700'>
              <div className='text-gray-500 dark:text-gray-400' />
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
              <div>
                <a
                  href='/#'
                  className='text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900'
                >
                  Buy now
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>faq</div>
        <div className='flex flex-col gap-4'>rating</div>
      </div>
      <div className='col-span-2'>1</div>
    </div>
  )
}

export default GigDetail
