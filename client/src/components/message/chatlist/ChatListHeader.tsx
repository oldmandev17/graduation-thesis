/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { SiFreelancer } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'
import Avatar from '../common/Avatar'

function ChatListHeader() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between h-16 px-4 py-3 shadow-lg'>
      <div className='flex gap-5'>
        <div className='cursor-pointer'>
          {user?.avatar ? (
            <Avatar
              type='sm'
              image={
                user.avatar.startsWith('upload') ? `${process.env.REACT_APP_URL_SERVER}/${user.avatar}` : user.avatar
              }
              setImage={null}
            />
          ) : (
            <div className='relative flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full'>
              <span className='text-lg text-white'>{user && user?.email[0].toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold text-primary-strong'>{user?.name}</span>
          <span className='text-sm text-secondary'>
            <div className='flex items-center'>
              <span className='flex w-3 h-3 bg-green-500 rounded-full me-3' />
              Online
            </div>
          </span>
        </div>
      </div>
      <div className='flex gap-6'>
        <SiFreelancer
          className='text-xl cursor-pointer text-panel-header-icon'
          title='Freelancer'
          onClick={() => navigate('/')}
        />
        <BsFillChatLeftTextFill className='text-xl cursor-pointer text-panel-header-icon' title='New Chat' />
        <BsThreeDotsVertical className='text-xl cursor-pointer text-panel-header-icon' title='Menu' />
      </div>
    </div>
  )
}

export default ChatListHeader
