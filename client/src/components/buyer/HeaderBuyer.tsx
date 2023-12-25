/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Badge, Divider, Menu, MenuItem } from '@mui/material'
import { getAllNotification, seenNotification } from 'apis/api'
import parse from 'html-react-parser'
import { INotification, NotificationStatus } from 'modules/notification'
import { UserRole } from 'modules/user'
import { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react'
import { AiOutlineBell, AiOutlineHeart, AiOutlineMail, AiOutlineSearch } from 'react-icons/ai'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { IoNotificationsCircleOutline } from 'react-icons/io5'
import { MdOutlineNotificationImportant } from 'react-icons/md'
import { SiFreelancer } from 'react-icons/si'
import { VscMail, VscMailRead } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authLogout } from 'stores/auth/auth-slice'
import { useAppDispatch, useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import calculateTime from 'utils/calculateTime'
import NavigationBar from '../NavigationBar'

function HeaderBuyer() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState<string>('')
  const { accessToken, refreshToken } = getToken()
  const [notifications, setNotifications] = useState<Array<INotification>>([])
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const openUser = Boolean(anchorEl2)
  const [anchorElNotifation, setAnchorElNotification] = useState<null | HTMLElement>(null)
  const openNotification = Boolean(anchorElNotifation)
  const dispatch = useAppDispatch()

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  const handleClickUser = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleCloseUser = () => {
    setAnchorEl2(null)
  }

  const handleClickNotification = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget)
  }
  const handleCloseNotification = () => {
    setAnchorElNotification(null)
  }

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
    if (user) getAllNotifications()
    const intervalId = setInterval(() => {
      if (user) getAllNotifications()
    }, 10000)
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchKeyword = (event: any) => {
    event.preventDefault()
    if (keyword) {
      navigate(`/search?keyword=${keyword.trim()}`)
    }
  }

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
    <div className='flex flex-col'>
      <div className='flex flex-row items-center gap-5 py-5 px-28 '>
        <SiFreelancer onClick={() => navigate('/')} className='w-12 h-12 cursor-pointer fill-green-600' />
        <form onSubmit={handleSearchKeyword} className='flex flex-row w-full'>
          <input
            type='text'
            onChange={handleChangeKeyword}
            className='w-full h-12 py-0 pl-5 text-lg text-gray-900 border border-gray-300 rounded-lg rounded-r-none border-1 focus:rounded-none'
            placeholder='What service are you looking for today?'
          />
          <button
            type='submit'
            className='flex flex-col justify-center w-16 pl-5 bg-black rounded-l-none rounded-r-lg cursor-pointer '
          >
            <AiOutlineSearch className='w-6 h-6 fill-white' />
          </button>
        </form>
        <div className='flex flex-row justify-between gap-2'>
          <button
            type='button'
            id='notification'
            aria-controls={openNotification ? 'notificationMenu' : undefined}
            aria-haspopup='true'
            aria-expanded={openNotification ? 'true' : undefined}
            onClick={handleClickNotification}
            className='flex flex-row items-center justify-center h-9 w-9 hover:rounded-full hover:bg-gray-100'
          >
            <Badge
              color='error'
              variant='dot'
              invisible={notifications.filter((noti) => noti.status === NotificationStatus.SENT).length <= 0}
            >
              <AiOutlineBell className='cursor-pointer w-7 h-7 fill-gray-400' />
            </Badge>
          </button>
          <Menu
            id='notificationMenu'
            MenuListProps={{
              'aria-labelledby': 'notification'
            }}
            anchorEl={anchorElNotifation}
            open={openNotification}
            onClose={handleCloseNotification}
          >
            <div className='w-[400px] h-[500px]  p-3'>
              <div className='flex items-center gap-3 py-2'>
                <IoIosNotificationsOutline className='w-6 h-6' />
                <span className='text-lg font-semibold'>
                  Notifications ({notifications.filter((noti) => noti.status === NotificationStatus.SENT).length})
                </span>
              </div>
              <Divider />
              <div className='h-full bg-gray-100'>
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification, index) => (
                      <Fragment key={notification._id + index}>
                        <div
                          onClick={() => handleSeenNotification(notification._id)}
                          className={` hover:bg-gray-50 cursor-pointer p-1 ${
                            notification.status === NotificationStatus.SEEN && 'bg-gray-50'
                          }`}
                        >
                          <div className='flex justify-center gap-2 item-center'>
                            <span
                              className={`w-12 h-12 rounded-full ${
                                notification.status === NotificationStatus.SEEN ? 'bg-gray-100' : 'bg-gray-50'
                              }`}
                            >
                              <IoNotificationsCircleOutline className='w-12 h-12 fill-gray-600' />
                            </span>
                            <div>
                              <h6 className='text-lg font-semibold'>{notification.name}</h6>
                              <p className='italic'>{parse(notification.content)}</p>
                            </div>
                            <span>
                              {notification.status === NotificationStatus.SEEN ? (
                                <VscMailRead className='w-5 h-5' />
                              ) : (
                                <VscMail className='w-5 h-5' />
                              )}
                            </span>
                          </div>
                          <div className='flex justify-end '>
                            <span>{calculateTime(notification.createdAt)}</span>
                          </div>
                        </div>
                        <Divider />
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center h-full'>
                    <span className='w-16 h-16 rounded-full bg-gray-50'>
                      <MdOutlineNotificationImportant className='w-16 h-16 fill-gray-600' />
                    </span>
                    <span className='text-lg font-semibold text-gray-600'>There are no notifications for you</span>
                  </div>
                )}
              </div>
            </div>
          </Menu>
          <span
            onClick={() => navigate(`/user/${user?.id}/messages`)}
            className='flex flex-row items-center justify-center h-9 w-9 hover:rounded-full hover:bg-gray-100'
          >
            <Badge color='error'>
              <AiOutlineMail className='cursor-pointer w-7 h-7 fill-gray-400' />
            </Badge>
          </span>
          <span
            onClick={() => navigate(`/user/${user?.id}/wishlists`)}
            className='flex flex-row items-center justify-center w-8 h-8 '
          >
            <AiOutlineHeart className='cursor-pointer w-7 h-7 fill-gray-400' />
          </span>
        </div>
        <button
          type='button'
          onClick={() => navigate(`/user/${user?.id}/buyer-orders`)}
          className='text-lg font-semibold text-gray-400 hover:text-green-500'
        >
          Orders
        </button>
        {user?.role.includes(UserRole.SELLER) && (
          <button
            type='button'
            onClick={() => navigate(`/user/${user?.id}/dashboard`)}
            className='text-lg font-semibold text-gray-400 hover:text-green-500 min-w-max'
          >
            Switch to Selling
          </button>
        )}
        <button
          type='button'
          id='user'
          aria-controls={openUser ? 'accountMenu' : undefined}
          aria-haspopup='true'
          aria-expanded={openUser ? 'true' : undefined}
          onClick={handleClickUser}
          className='flex flex-row justify-center w-24 '
        >
          {user?.avatar ? (
            <img
              src={
                user.avatar.startsWith('upload') ? `${process.env.REACT_APP_URL_SERVER}/${user.avatar}` : user.avatar
              }
              alt='avatar'
              className='w-10 h-10 rounded-full cursor-pointer '
            />
          ) : (
            <div className='relative flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full'>
              <span className='text-lg text-white'>{user?.email[0].toUpperCase()}</span>
            </div>
          )}
        </button>
        <Menu
          id='accountMenu'
          MenuListProps={{
            'aria-labelledby': 'user'
          }}
          anchorEl={anchorEl2}
          open={openUser}
          onClose={handleCloseUser}
        >
          <div className='p-2'>
            <div className='flex flex-col gap-1 px-4 py-1'>
              <div className='flex flex-row gap-1'>
                <span className='text-sm font-bold text-gray-700 uppercase'>{user?.name}</span>
                <span className='text-sm text-gray-700'> &#40;{user?.id}&#41;</span>
              </div>
              <span className='text-sm text-gray-500 lowercase '> {user?.email} </span>
            </div>
            <Divider sx={{ padding: '4px' }} />
            <MenuItem
              className=' !py-2 !px-4 !text-gray-500'
              onClick={() => {
                handleCloseUser()
                navigate(`/user/${user?.id}/profile`)
              }}
            >
              Profile
            </MenuItem>
            {!user?.role.includes(UserRole.SELLER) && (
              <MenuItem
                className=' !py-2 !px-4 !text-gray-500 '
                onClick={() => {
                  handleCloseUser()
                  navigate('/start-selling')
                }}
              >
                Become a Seller
              </MenuItem>
            )}
            <MenuItem
              className=' !py-2 !px-4 !text-gray-500'
              onClick={() => {
                handleCloseUser()
                navigate('/setting')
              }}
            >
              Setting
            </MenuItem>
            <MenuItem
              className=' !py-2 !px-4 !text-gray-500'
              onClick={() => {
                handleCloseUser()
                navigate('/help-support')
              }}
            >
              Help & support
            </MenuItem>
            <MenuItem
              className=' !py-2 !px-4 !text-gray-500'
              onClick={() => {
                handleCloseUser()
                if (refreshToken) dispatch(authLogout(refreshToken))
              }}
            >
              Log out
            </MenuItem>
          </div>
        </Menu>
      </div>
      <NavigationBar />
    </div>
  )
}

export default HeaderBuyer
