/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useMessage } from 'contexts/StateContext'
import { useAppSelector } from 'stores/hooks'
import PhotoPicker from '../common/PhotoPicker'

function MessageBar() {
  const { currentChatUser, socket, handleAddMessage } = useMessage()
  const { user } = useAppSelector((state) => state.auth)
  const [message, setMessage] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [grabPhoto, setGrabPhoto] = useState<boolean>(false)
  const emojiPickerRef = useRef<any>(null)

  const handleEmojiModel = () => {
    setShowEmojiPicker(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji))
  }

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (event.target.id !== 'emoji-open') {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false)
        }
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_URL_SERVER}/api/message/add-message`, {
        to: currentChatUser?._id,
        from: user?._id,
        message
      })

      socket.current.emit('send-msg', {
        to: currentChatUser?._id,
        from: user?._id,
        message: data.message
      })

      handleAddMessage(data.message)

      setMessage('')
    } catch (error: any) {
      toast.error(error.response.data.error.message)
    }
  }

  const photoPickerChange = async (e: any) => {
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post(`${process.env.REACT_APP_URL_SERVER}/api/message/add-image-message`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data '
        },
        params: {
          from: user?._id,
          to: currentChatUser?._id
        }
      })

      if (response.status === 201) {
        socket.current.emit('send-msg', {
          to: currentChatUser?._id,
          from: user?._id,
          message: response.data.message
        })

        handleAddMessage(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response.data.error.message)
    }
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker')
      data?.click()
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      }
    }
  }, [grabPhoto])

  return (
    <div className='bg-panel-header-background h-20 p-4 flex items-center gap-6 relative'>
      <div className='flex gap-6'>
        <BsEmojiSmile
          className='text-panel-header-icon cursor-pointer text-xl'
          title='Emoji'
          id='emoji-open'
          onClick={handleEmojiModel}
        />
        {showEmojiPicker && (
          <div className='absolute bottom-24 left-16 z-40' ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
          </div>
        )}
        <ImAttachment
          className='text-panel-header-icon cursor-pointer text-xl'
          title='Attach File'
          onClick={() => setGrabPhoto(true)}
        />
      </div>
      <div className='w-full rounded-lg h-10 flex items-center'>
        <input
          type='text'
          placeholder='Type a message'
          className='bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full'
          onChange={(e: any) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <div className='flex w-10 items-center justify-center'>
        <button type='button'>
          {message.length && (
            <MdSend
              className='text-panel-header-icon cursor-pointer text-xl'
              title='Send Message'
              onClick={sendMessage}
            />
          )}
        </button>
      </div>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </div>
  )
}

export default MessageBar
