/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import { getAllNotification, seenNotification } from 'apis/api'
import ThemeSwitcher from 'components/common/ThemeSwitcher'
import parse from 'html-react-parser'
import { INotification, NotificationStatus } from 'modules/notification'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineNotificationsActive } from 'react-icons/md'
import { SiFiverr } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authLogout } from 'stores/auth/auth-slice'
import { useAppDispatch, useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import timeAgo from 'utils/timeAgo'

function HeaderAdmin() {
  const navigate = useNavigate()
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [openApp, setOpenApp] = useState<boolean>(false)
  const [openProfile, setOpenProfile] = useState<boolean>(false)
  const anchorRefNotification = useRef<HTMLButtonElement>(null)
  const anchorRefApp = useRef<HTMLButtonElement>(null)
  const anchorRefProfile = useRef<HTMLButtonElement>(null)
  const handleToggleNotification = () => {
    setOpenNotification((prevOpenNotification) => !prevOpenNotification)
  }
  const handleToggleApp = () => {
    setOpenApp((prevOpenApp) => !prevOpenApp)
  }
  const handleToggleProfile = () => {
    setOpenProfile((prevOpenProfile) => !prevOpenProfile)
  }
  const handleCloseNotification = (event: Event | React.SyntheticEvent) => {
    if (anchorRefNotification.current && anchorRefNotification.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenNotification(false)
  }
  const handleCloseApp = (event: Event | React.SyntheticEvent) => {
    if (anchorRefApp.current && anchorRefApp.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenApp(false)
  }
  const handleCloseProfile = (event: Event | React.SyntheticEvent) => {
    if (anchorRefProfile.current && anchorRefProfile.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenProfile(false)
  }
  const prevOpenNotification = useRef(openNotification)
  const prevOpenApp = useRef(openApp)
  const prevOpenProfile = useRef(openProfile)
  useEffect(() => {
    if (prevOpenNotification.current === true && openNotification === false) {
      anchorRefNotification.current!.focus()
    }
    prevOpenNotification.current = openNotification
  }, [openNotification])
  useEffect(() => {
    if (prevOpenApp.current === true && openApp === false) {
      anchorRefApp.current!.focus()
    }
    prevOpenApp.current = openApp
  }, [openApp])
  useEffect(() => {
    if (prevOpenProfile.current === true && openProfile === false) {
      anchorRefProfile.current!.focus()
    }
    prevOpenProfile.current = openProfile
  }, [openProfile])

  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [notifications, setNotifications] = useState<Array<INotification>>([])
  const { refreshToken, accessToken } = getToken()

  const getAllNotifications = async () => {
    await getAllNotification(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setNotifications(response.data.notifications)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  useEffect(() => {
    getAllNotifications()
    const intervalId = setInterval(() => {
      getAllNotifications()
    }, 10000)
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSeenNotification = async (id: string) => {
    await seenNotification(id, accessToken)
      .then((response) => {
        if (response.status === 200) {
          getAllNotifications()
        }
      })
      .catch((error: any) => toast.error(error.response.error.data.message))
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex flex-wrap items-center justify-between'>
        <div className='flex items-center justify-start'>
          <button
            type='button'
            data-drawer-target='drawer-navigation'
            data-drawer-toggle='drawer-navigation'
            aria-controls='drawer-navigation'
            className='p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
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
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <svg
              aria-hidden='true'
              className='hidden w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            <span className='sr-only'>Toggle sidebar</span>
          </button>
          <div onClick={() => navigate('/')} className='flex items-center justify-between mr-4'>
            <SiFiverr className='w-20 h-[72px] dark:fill-white fill-black' />
          </div>
          <form action='/#' method='GET' className='hidden md:block md:pl-2'>
            <label htmlFor='topbar-search' className='sr-only'>
              Search
            </label>
            <div className='relative md:w-96'>
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
                name='email'
                id='topbar-search'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Search'
              />
            </div>
          </form>
        </div>
        <div className='flex items-center lg:order-2'>
          <ThemeSwitcher />
          <button
            type='button'
            data-drawer-toggle='drawer-navigation'
            aria-controls='drawer-navigation'
            className='p-2 mr-1 text-gray-500 rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
          >
            <span className='sr-only'>Toggle search</span>
            <svg
              aria-hidden='true'
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                clipRule='evenodd'
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              />
            </svg>
          </button>
          <button
            type='button'
            ref={anchorRefNotification}
            aria-controls={openNotification ? 'notification-dropdown' : undefined}
            aria-expanded={openNotification ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleToggleNotification}
            data-dropdown-toggle='notification-dropdown'
            className='relative p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
          >
            <span className='sr-only'>View notifications</span>
            <svg
              aria-hidden='true'
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
            </svg>
            {notifications.filter((noti) => noti.status === NotificationStatus.SENT).length > 0 && (
              <span className='absolute flex items-center justify-center w-4 h-4 text-sm font-semibold text-white bg-red-600 rounded-full right-1 top-1'>
                {notifications.filter((noti) => noti.status === NotificationStatus.SENT).length}
              </span>
            )}
          </button>
          <Popper
            open={openNotification}
            anchorEl={anchorRefNotification.current}
            role={undefined}
            placement='bottom-start'
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                }}
              >
                <Paper className='!rounded-xl'>
                  <ClickAwayListener onClickAway={handleCloseNotification}>
                    <div
                      className='max-w-sm my-4 text-base list-none bg-white divide-y  min-w-[384px] divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700 rounded-xl h-[500px]'
                      id='notification-dropdown'
                      style={{ overflowY: 'auto' }}
                    >
                      <div className='block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300'>
                        Notifications ({notifications.filter((noti) => noti.status === NotificationStatus.SENT).length})
                      </div>
                      <div className=''>
                        {notifications.length > 0 &&
                          notifications.map((notification, index) => (
                            <div
                              onClick={() => handleSeenNotification(notification._id)}
                              key={notification._id + index}
                              className='flex px-4 py-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'
                            >
                              <div className='relative flex-shrink-0'>
                                <div className='relative flex items-center justify-center bg-white rounded-full dark:bg-gray-800 h-11 w-11'>
                                  <MdOutlineNotificationsActive className='w-6 h-6 text-gray-700 dark:text-gray-300' />
                                </div>
                                <div
                                  className={`absolute flex items-center justify-center w-4 h-4 -mt-3 border border-white rounded-full ml-7 ${
                                    notification.status === NotificationStatus.SENT ? 'bg-red-700' : 'bg-green-700'
                                  } dark:border-gray-700`}
                                />
                              </div>
                              <div className='w-full pl-3'>
                                <span className='font-semibold text-gray-900 dark:text-white'>{notification.name}</span>
                                <div className='text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400'>
                                  {parse(notification.content)}
                                </div>
                                <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
                                  {timeAgo(new Date(notification.createdAt))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className='block py-2 font-medium text-center text-gray-900 text-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:underline'>
                        <div className='inline-flex items-center'>
                          <svg
                            aria-hidden='true'
                            className='w-4 h-4 mr-2 text-gray-500 dark:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                            <path
                              fillRule='evenodd'
                              d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          View all
                        </div>
                      </div>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <button
            type='button'
            ref={anchorRefApp}
            aria-controls={openApp ? 'apps-dropdown' : undefined}
            aria-expanded={openApp ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleToggleApp}
            data-dropdown-toggle='apps-dropdown'
            className='p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
          >
            <span className='sr-only'>Apps</span>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
            </svg>
          </button>
          <Popper
            open={openApp}
            anchorEl={anchorRefApp.current}
            role={undefined}
            placement='bottom-start'
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                }}
              >
                <Paper className='!rounded-xl'>
                  <ClickAwayListener onClickAway={handleCloseApp}>
                    <div
                      className='z-50 max-w-sm my-4 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 rounded-xl'
                      id='apps-dropdown'
                    >
                      <div className='block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300'>
                        Apps
                      </div>
                      <div className='grid grid-cols-3 gap-4 p-4'>
                        <div
                          onClick={(event) => {
                            navigate('/overview')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z' />
                            <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z' />
                          </svg>
                          <div className='text-sm text-gray-900 dark:text-white'>Overview</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/category')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                          </svg>
                          <div className='text-sm text-gray-900 dark:text-white'>Category</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/gig')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
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
                          <div className='text-sm text-gray-900 dark:text-white'>Gig</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/order')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
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
                          <div className='text-sm text-gray-900 dark:text-white'>Order</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/message')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z' />
                            <path d='M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z' />
                          </svg>
                          <div className='text-sm text-gray-900 dark:text-white'>Message</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/user')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
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
                          <div className='text-sm text-gray-900 dark:text-white'>User</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/log')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
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
                          <div className='text-sm text-gray-900 dark:text-white'>Log</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/setting')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
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
                          <div className='text-sm text-gray-900 dark:text-white'>Setting</div>
                        </div>
                        <div
                          onClick={(event) => {
                            navigate('/profile')
                            handleCloseApp(event)
                          }}
                          className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                        >
                          <svg
                            aria-hidden='true'
                            className='mx-auto mb-1 text-gray-400 w-7 h-7 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <div className='text-sm text-gray-900 dark:text-white'>Profile</div>
                        </div>
                      </div>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <button
            type='button'
            className='flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            id='user-menu-button'
            ref={anchorRefProfile}
            aria-controls={openProfile ? 'profile-dropdown' : undefined}
            aria-expanded={openProfile ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleToggleProfile}
            data-dropdown-toggle='profile-dropdown'
          >
            <span className='sr-only'>Open user menu</span>
            {user?.avatar ? (
              <img
                className='w-8 h-8 rounded-full'
                src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png'
                alt='user'
              />
            ) : (
              <div className='relative flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full'>
                <span className='text-lg text-white'>{user && user?.email[0].toUpperCase()}</span>
              </div>
            )}
          </button>
          <Popper
            open={openProfile}
            anchorEl={anchorRefProfile.current}
            role={undefined}
            placement='bottom-start'
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                }}
              >
                <Paper className='!rounded-xl'>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <div
                      className='z-50 w-56 my-4 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl'
                      id='dropdown'
                    >
                      <div className='px-4 py-3'>
                        <span className='block text-sm font-semibold text-gray-900 dark:text-white'>{user?.name}</span>
                        <span className='block text-sm text-gray-900 truncate dark:text-white'>{user?.email}</span>
                      </div>
                      <ul className='py-1 text-gray-700 dark:text-gray-300' aria-labelledby='dropdown'>
                        <li>
                          <a
                            href='/#'
                            className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white'
                          >
                            My profile
                          </a>
                        </li>
                        <li>
                          <a
                            href='/#'
                            className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white'
                          >
                            Account settings
                          </a>
                        </li>
                      </ul>
                      <ul className='py-1 text-gray-700 dark:text-gray-300' aria-labelledby='dropdown'>
                        <li>
                          <a
                            href='/#'
                            className='flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                          >
                            <svg
                              className='w-5 h-5 mr-2 text-gray-400'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                                clipRule='evenodd'
                              />
                            </svg>
                            My likes
                          </a>
                        </li>
                        <li>
                          <a
                            href='/#'
                            className='flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                          >
                            <svg
                              className='w-5 h-5 mr-2 text-gray-400'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                            </svg>
                            Collections
                          </a>
                        </li>
                      </ul>
                      <ul className='py-1 text-gray-700 dark:text-gray-300' aria-labelledby='dropdown'>
                        <li>
                          <span
                            onClick={() => {
                              if (refreshToken) dispatch(authLogout(refreshToken))
                            }}
                            className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                          >
                            Sign out
                          </span>
                        </li>
                      </ul>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </nav>
  )
}

export default HeaderAdmin
