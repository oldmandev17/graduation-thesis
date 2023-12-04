/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Badge } from '@mui/material'
import { getAllNotification } from 'apis/api'
import { INotification } from 'modules/notification'
import { ChangeEvent, useState } from 'react'
import { AiOutlineBell, AiOutlineHeart, AiOutlineMail, AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import NavigationBar from './NavigationBar'

function HeaderBuyer() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState<string>('')
  const { accessToken } = getToken()
  const [notifications, setNotifications] = useState<Array<INotification>>([])

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // useEffect(() => {
  //   getAllNotifications()
  //   const intervalId = setInterval(() => {
  //     getAllNotifications()
  //   }, 10000)
  //   return () => clearInterval(intervalId)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const handleSearchKeyword = () => {
    if (keyword) {
      navigate(`/search?keyword=${keyword.trim()}`)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row items-center gap-4 py-5 px-28 '>
        <img
          onClick={() => navigate('/')}
          src='/images/Fiverr-Logo.png'
          alt='logo'
          width='80'
          height='80'
          className='cursor-pointer'
        />
        <div className='flex flex-row w-full'>
          <input
            type='text'
            onChange={handleChangeKeyword}
            className='w-full h-12 py-0 pl-5 text-lg text-gray-900 border border-gray-300 rounded-lg rounded-r-none border-1 focus:rounded-none'
            placeholder='what service are you looking for today?'
          />
          <button
            type='button'
            onClick={handleSearchKeyword}
            className='flex flex-col justify-center w-16 pl-5 bg-black rounded-l-none rounded-r-lg cursor-pointer '
          >
            <AiOutlineSearch className='w-6 h-6 fill-white' />
          </button>
        </div>
        <div className='flex flex-row justify-between gap-2'>
          <span className='flex flex-row items-center justify-center h-9 w-9 hover:rounded-full hover:bg-gray-100'>
            <Badge color='error' badgeContent={notifications.length}>
              <AiOutlineBell className='w-7 h-7 cursor-pointer fill-gray-400' />
            </Badge>
          </span>
          <span className='flex flex-row items-center justify-center h-9 w-9 hover:rounded-full hover:bg-gray-100'>
            <Badge color='error' badgeContent={1}>
              <AiOutlineMail className='w-7 h-7 cursor-pointer fill-gray-400' />
            </Badge>
          </span>
          <span className='flex flex-row items-center justify-center w-8 h-8 '>
            <AiOutlineHeart className='w-7 h-7 cursor-pointer fill-gray-400' />
          </span>
        </div>
        <div className='text-lg font-bold text-gray-400 cursor-pointer hover:text-green-500'>Orders</div>
        <div className='flex flex-row justify-center w-24 '>
          {user?.avatar ? (
            <img src='/image/roses.jpg' alt='avata' className='w-10 h-10 rounded-full cursor-pointer ' />
          ) : (
            <div className='relative flex items-center justify-center bg-purple-500 rounded-full h-10 w-10'>
              <span className='text-lg text-white'>{user?.email[0].toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>
      <NavigationBar />
    </div>
  )
}

export default HeaderBuyer
