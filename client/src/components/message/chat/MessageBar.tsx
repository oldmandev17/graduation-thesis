/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import axios from 'axios'
import { useMessage } from 'contexts/StateContext'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import { toast } from 'react-toastify'
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

  const sendMessage = async (e: any) => {
    e.preventDefault()
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
    <div className='relative flex items-center h-20 gap-6 p-4 shadow-lg'>
      <div className='flex gap-6'>
        <BsEmojiSmile
          className='text-xl cursor-pointer text-panel-header-icon'
          title='Emoji'
          id='emoji-open'
          onClick={handleEmojiModel}
        />
        {showEmojiPicker && (
          <div className='absolute z-40 bottom-24 left-16' ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
          </div>
        )}
        <ImAttachment
          className='text-xl cursor-pointer text-panel-header-icon'
          title='Attach File'
          onClick={() => setGrabPhoto(true)}
        />
      </div>
      <form className='flex items-center w-full gap-6' onSubmit={sendMessage}>
        <div className='flex items-center w-full h-10 rounded-lg'>
          <input
            type='text'
            placeholder='Type a message'
            className='w-full h-10 px-5 py-4 text-sm text-white rounded-lg bg-input-background focus:outline-none'
            onChange={(e: any) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className='flex items-center justify-center w-10'>
          {message.length > 0 && (
            <button type='submit'>
              <MdSend
                className='text-xl cursor-pointer text-panel-header-icon'
                title='Send Message'
                onClick={sendMessage}
              />
            </button>
          )}
        </div>
      </form>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </div>
  )
}

export default MessageBar
