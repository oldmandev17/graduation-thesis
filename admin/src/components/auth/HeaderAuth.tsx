import ThemeSwitcher from 'components/common/ThemeSwitcher'

/* eslint-disable jsx-a11y/label-has-associated-control */
function HeaderAuth() {
  return (
    <nav className='bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex flex-wrap items-center justify-between'>
        <div className='flex items-center justify-start'>
          <a href='https://flowbite.com' className='flex items-center justify-between mr-4'>
            <img src='https://flowbite.s3.amazonaws.com/logo.svg' className='h-8 mr-3' alt='Freelancer Logo' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>Freelancer</span>
          </a>
        </div>
        <div className='flex items-center lg:order-2'>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}

export default HeaderAuth
