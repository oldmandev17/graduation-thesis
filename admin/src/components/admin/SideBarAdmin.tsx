/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useNavigate } from 'react-router-dom'

function SideBarAdmin() {
  const navigate = useNavigate()

  return (
    <aside
      className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border border-gray-200 pt-14 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
      aria-label='Sidenav'
      id='drawer-navigation'
    >
      <div className='h-full px-3 py-5 overflow-y-auto bg-white dark:bg-gray-800'>
        <form action='#' method='GET' className='mb-2 md:hidden'>
          <label htmlFor='sidebar-search' className='sr-only'>
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                />
              </svg>
            </div>
            <input
              type='text'
              name='search'
              id='sidebar-search'
              className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
              placeholder='Search'
            />
          </div>
        </form>
        <ul className='space-y-2'>
          <li>
            <div
              onClick={() => navigate('/overview')}
              className='flex items-center p-2 text-base font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                aria-hidden='true'
                className='w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z' />
                <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z' />
              </svg>
              <span className='ml-3'>Overview</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/category')}
              className='flex items-center p-2 text-base font-medium text-gray-900 transition duration-75 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
              </svg>
              <span className='ml-3'>Category</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/gig')}
              className='flex items-center p-2 text-base font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 text-left whitespace-nowrap'>Gig</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/order')}
              className='flex items-center p-2 text-base font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 text-left whitespace-nowrap'>Order</span>
            </div>
          </li>
        </ul>
        <ul className='pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700'>
          <li>
            <div
              onClick={() => navigate('/message')}
              className='flex items-center p-2 text-base font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z' />
                <path d='M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z' />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Message</span>
              <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 dark:bg-primary-200 dark:text-primary-800'>
                4
              </span>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/user')}
              className='flex items-center p-2 text-base font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 text-left whitespace-nowrap'>User</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate('/log')}
              className='flex items-center p-2 text-base font-medium text-gray-900 transition duration-75 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                <path
                  fillRule='evenodd'
                  d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='ml-3'>Log</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='absolute bottom-0 left-0 z-20 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800'>
        <a
          href='/#'
          className='inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
        >
          <svg
            aria-hidden='true'
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z' />
          </svg>
        </a>
        <a
          href='/#'
          data-tooltip-target='tooltip-settings'
          className='inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600'
        >
          <svg
            aria-hidden='true'
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
              clipRule='evenodd'
            />
          </svg>
        </a>
        <div
          id='tooltip-settings'
          role='tooltip'
          className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
        >
          Settings page
          <div className='tooltip-arrow' data-popper-arrow />
        </div>
        <button
          type='button'
          data-dropdown-toggle='language-dropdown'
          className='inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:hover:text-white dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600'
        >
          <svg
            aria-hidden='true'
            className='h-5 w-5 rounded-full mt-0.5'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            viewBox='0 0 3900 3900'
          >
            <path fill='#b22234' d='M0 0h7410v3900H0z' />
            <path d='M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0' stroke='#fff' strokeWidth='300' />
            <path fill='#3c3b6e' d='M0 0h2964v2100H0z' />
            <g fill='#fff'>
              <g id='d'>
                <g id='c'>
                  <g id='e'>
                    <g id='b'>
                      <path id='a' d='M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z' />
                      <use xlinkHref='#a' y='420' />
                      <use xlinkHref='#a' y='840' />
                      <use xlinkHref='#a' y='1260' />
                    </g>
                    <use xlinkHref='#a' y='1680' />
                  </g>
                  <use xlinkHref='#b' x='247' y='210' />
                </g>
                <use xlinkHref='#c' x='494' />
              </g>
              <use xlinkHref='#d' x='988' />
              <use xlinkHref='#c' x='1976' />
              <use xlinkHref='#e' x='2470' />
            </g>
          </svg>
        </button>
        <div
          className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700'
          id='language-dropdown'
        >
          <ul className='py-1' role='none'>
            <li>
              <a
                href='/#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600'
                role='menuitem'
              >
                <div className='inline-flex items-center'>
                  <svg
                    aria-hidden='true'
                    className='h-3.5 w-3.5 rounded-full mr-2'
                    xmlns='http://www.w3.org/2000/svg'
                    id='flag-icon-css-us'
                    viewBox='0 0 512 512'
                  >
                    <g fillRule='evenodd'>
                      <g strokeWidth='1pt'>
                        <path
                          fill='#bd3d44'
                          d='M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z'
                          transform='scale(3.9385)'
                        />
                        <path
                          fill='#fff'
                          d='M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z'
                          transform='scale(3.9385)'
                        />
                      </g>
                      <path fill='#192f5d' d='M0 0h98.8v70H0z' transform='scale(3.9385)' />
                      <path
                        fill='#fff'
                        d='M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z'
                        transform='scale(3.9385)'
                      />
                    </g>
                  </svg>
                  English (US)
                </div>
              </a>
            </li>
            <li>
              <a
                href='/#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600'
                role='menuitem'
              >
                <div className='inline-flex items-center'>
                  <svg
                    aria-hidden='true'
                    className='h-3.5 w-3.5 rounded-full mr-2'
                    xmlns='http://www.w3.org/2000/svg'
                    id='flag-icon-css-de'
                    viewBox='0 0 512 512'
                  >
                    <path fill='#ffce00' d='M0 341.3h512V512H0z' />
                    <path d='M0 0h512v170.7H0z' />
                    <path fill='#d00' d='M0 170.7h512v170.6H0z' />
                  </svg>
                  Deutsch
                </div>
              </a>
            </li>
            <li>
              <a
                href='/#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600'
                role='menuitem'
              >
                <div className='inline-flex items-center'>
                  <svg
                    aria-hidden='true'
                    className='h-3.5 w-3.5 rounded-full mr-2'
                    xmlns='http://www.w3.org/2000/svg'
                    id='flag-icon-css-it'
                    viewBox='0 0 512 512'
                  >
                    <g fillRule='evenodd' strokeWidth='1pt'>
                      <path fill='#fff' d='M0 0h512v512H0z' />
                      <path fill='#009246' d='M0 0h170.7v512H0z' />
                      <path fill='#ce2b37' d='M341.3 0H512v512H341.3z' />
                    </g>
                  </svg>
                  Italiano
                </div>
              </a>
            </li>
            <li>
              <a
                href='/#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600'
                role='menuitem'
              >
                <div className='inline-flex items-center'>
                  <svg
                    aria-hidden='true'
                    className='h-3.5 w-3.5 rounded-full mr-2'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                    id='flag-icon-css-cn'
                    viewBox='0 0 512 512'
                  >
                    <defs>
                      <path id='a' fill='#ffde00' d='M1-.3L-.7.8 0-1 .6.8-1-.3z' />
                    </defs>
                    <path fill='#de2910' d='M0 0h512v512H0z' />
                    <use width='30' height='20' transform='matrix(76.8 0 0 76.8 128 128)' xlinkHref='#a' />
                    <use width='30' height='20' transform='rotate(-121 142.6 -47) scale(25.5827)' xlinkHref='#a' />
                    <use width='30' height='20' transform='rotate(-98.1 198 -82) scale(25.6)' xlinkHref='#a' />
                    <use width='30' height='20' transform='rotate(-74 272.4 -114) scale(25.6137)' xlinkHref='#a' />
                    <use width='30' height='20' transform='matrix(16 -19.968 19.968 16 256 230.4)' xlinkHref='#a' />
                  </svg>
                  中文 (繁體)
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default SideBarAdmin
