/* eslint-disable no-underscore-dangle */
import { useMessage } from 'contexts/StateContext'
import { IMessage } from 'modules/message'
import React from 'react'
import { useAppSelector } from 'stores/hooks'
import calculateTime from 'utils/calculateTime'
import MessageStatus from '../common/MessageStatus'

function ImageMessage({ message }: { message: IMessage }) {
  const { currentChatUser } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  return (
    <div
      className={`p-1 rounded-lg ${
        message.sender._id === currentChatUser?._id ? 'bg-incoming-background' : 'bg-outgoing-background'
      }`}
    >
      <div className='relative'>
        <img
          src={`${process.env.REACT_APP_URL_SERVER}/${message.message}`}
          alt='asset'
          className='rounded-lg'
          width={300}
          height={300}
        />
        <div className='absolute bottom-1 right-1 flex items-end gap-1'>
          <span className='text-bubble-meta text-[11px] pt-1 min-w-fit'>{calculateTime(message.createdAt)}</span>
          <span className='text-bubble-meta'>
            {message.sender._id === user?._id && <MessageStatus status={message.status} />}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ImageMessage
