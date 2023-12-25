/* eslint-disable no-underscore-dangle */
import { getUserById } from 'apis/api'
import axios from 'axios'
import Chat from 'components/message/chat/Chat'
import ChatList from 'components/message/chatlist/ChatList'
import Empty from 'components/message/common/Empty'
import { useMessage } from 'contexts/StateContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'

function Main() {
  const [socketEvent, setSocketEvent] = useState<boolean>(false)
  const socket = useRef<any>()
  const [search] = useSearchParams()
  const { currentChatUser, handleCurrentChatUser, handleSocket, handleAddMessage, handleMessages } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  const { accessToken } = getToken()

  const getCurrentChatUser = useCallback(async () => {
    await getUserById(search.get('to') as string, accessToken).then((response) => {
      if (response.status === 200) {
        handleCurrentChatUser(response.data.user)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.get('to')])

  useEffect(() => {
    if (search.get('to')) {
      getCurrentChatUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentChatUser])

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
      } = await axios.get(
        `${process.env.REACT_APP_URL_SERVER}/api/message/get-messages/${user?._id}/${currentChatUser?._id}`
      )

      handleMessages(messages)
    }

    if (currentChatUser?._id && user?._id) {
      getMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatUser, user])

  return (
    <>
      <Helmet>
        <title>Messages | Freelancer</title>
      </Helmet>
      <div className='grid w-screen h-screen max-w-full max-h-screen overflow-hidden grid-cols-main'>
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  )
}

export default Main
