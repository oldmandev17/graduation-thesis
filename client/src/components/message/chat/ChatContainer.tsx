/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { useMessage } from 'contexts/StateContext'
import { IMessage, MessageType } from 'modules/message'
import React from 'react'
import { useAppSelector } from 'stores/hooks'
import calculateTime from 'utils/calculateTime'
import MessageStatus from '../common/MessageStatus'
import ImageMessage from './ImageMessage'

function ChatContainer() {
  const { messages, currentChatUser } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  return (
    <div className='h[80vh] w-full relative flex-grow overflow-auto custom-scrollbar shadow-inner'>
      <img src='/chat-bg.png' alt='background' className='fixed top-0 left-0 z-0 w-full h-full bg-fixed opacity-5' />
      <div className='relative bottom-0 left-0 z-40 mx-10 my-6'>
        <div className='flex w-full'>
          <div className='flex flex-col justify-end w-full gap-1 overflow-auto'>
            {messages.length > 0 &&
              messages.map((message: IMessage, index: number) => (
                <div
                  key={message._id + index}
                  className={`flex ${message.sender._id === currentChatUser?._id ? 'justify-start' : 'justify-end'}`}
                >
                  {message.type === MessageType.TEXT && (
                    <div
                      className={`px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                        message.sender._id === currentChatUser?._id
                          ? 'bg-incoming-background text-primary-strong'
                          : 'bg-outgoing-background text-white'
                      }`}
                    >
                      <span className='break-all'>{message.message}</span>
                      <div className='flex items-end gap-1'>
                        <span
                          className={`${
                            message.sender._id === currentChatUser?._id ? 'text-gray-400' : 'text-bubble-meta'
                          } text-[11px] pt-1 min-w-fit`}
                        >
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>{message.sender._id === user?._id && <MessageStatus status={message.status} />}</span>
                      </div>
                    </div>
                  )}
                  {message.type === MessageType.IMAGE && <ImageMessage message={message} />}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
