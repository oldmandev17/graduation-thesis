import React from 'react'
import { useMessage } from 'contexts/StateContext'
import { MdCall } from 'react-icons/md'
import { IoVideocam } from 'react-icons/io5'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Avatar from '../common/Avatar'

function ChatHeader() {
  const { currentChatUser } = useMessage()

  return (
    <div className='z-10 flex items-center justify-between h-16 px-4 py-3 shadow-lg bg-panel-header-background'>
      <div className='flex items-center justify-center gap-6'>
        {currentChatUser?.avatar ? (
          <Avatar
            type='sm'
            image={
              currentChatUser.avatar.startsWith('upload')
                ? `${process.env.REACT_APP_URL_SERVER}/${currentChatUser.avatar}`
                : currentChatUser.avatar
            }
            setImage={null}
          />
        ) : (
          <div className='relative flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full'>
            <span className='text-lg text-white'>{currentChatUser && currentChatUser?.email[0].toUpperCase()}</span>
          </div>
        )}
        <div className='flex flex-col'>
          <span className='text-primary-strong'>{currentChatUser?.name}</span>
          <span className='text-sm text-secondary'>online/offline</span>
        </div>
      </div>
      <div className='flex gap-6'>
        <MdCall className='text-xl cursor-pointer text-panel-header-icon' />
        <IoVideocam className='text-xl cursor-pointer text-panel-header-icon' />
        <BiSearchAlt2 className='text-xl cursor-pointer text-panel-header-icon' />
        <BsThreeDotsVertical className='text-xl cursor-pointer text-panel-header-icon' />
      </div>
    </div>
  )
}

export default ChatHeader
