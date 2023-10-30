import ThemeSwitcher from 'components/common/ThemeSwitcher'
import { SiFiverr } from 'react-icons/si'

/* eslint-disable jsx-a11y/label-has-associated-control */
function HeaderAuth() {
  return (
    <nav className='px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex flex-wrap items-center justify-between'>
        <div className='flex items-center justify-start'>
          <a href='https://flowbite.com' className='flex items-center justify-between mr-4'>
            <SiFiverr className='w-20 h-[72px] dark:fill-white fill-black' />
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
