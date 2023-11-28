/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import Chat from 'components/message/chat/Chat'
import ChatList from 'components/message/chatlist/ChatList'
import Empty from 'components/message/common/Empty'
import { useMessage } from 'contexts/StateContext'
import { useEffect, useRef, useState } from 'react'

import { io } from 'socket.io-client'
import { useAppSelector } from 'stores/hooks'

function Main() {
  const [socketEvent, setSocketEvent] = useState<boolean>(false)
  const socket = useRef<any>()
  const { currentChatUser, handleMessages, handleSocket, handleAddMessage } = useMessage()
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      socket.current = io(process.env.REACT_APP_URL_SERVER as string)

      socket.current.emit('add-user', user._id)

      handleSocket(socket)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on('msg-recieve', (data: any) => {
        handleAddMessage(data.message)
      })

      setSocketEvent(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket.current])

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages }
      } = await axios.get(`${process.env.REACT_APP_URL_SERVER}/${user?._id}/${currentChatUser?._id}`)

      handleMessages(messages)
    }

    if (currentChatUser?._id) {
      getMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatUser])

  return (
    <div className='grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden'>
      <ChatList />
      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  )
}

export default Main
