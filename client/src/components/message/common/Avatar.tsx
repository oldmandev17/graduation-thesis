/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'
import { FaCamera } from 'react-icons/fa'
import ContextMenu from './ContextMenu'
import CapturePhoto from './CapturePhoto'
import PhotoLibrary from './PhotoLibrary'
import PhotoPicker from './PhotoPicker'

function Avatar({ type, image, setImage }: { type: string; image: string; setImage: any }) {
  const [hover, setHover] = useState<boolean>(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)
  const [contextMenuCordinates, setContextMenuCordinates] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

  const [grabPhoto, setGrabPhoto] = useState<boolean>(false)
  const [showPhotoLibrary, setShowPhotoLibrary] = useState<boolean>(false)
  const [showCapturePhoto, setShowCapturePhoto] = useState<boolean>(false)

  const showContextMenu = (e: any) => {
    e.preventDefault()
    setContextMenuCordinates({ x: e.pageX, y: e.pageY })
    setIsContextMenuVisible(true)
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

  const contextMenuOptions: { name: string; callback: Function }[] = [
    {
      name: 'Take Photo',
      callback: () => {
        setShowCapturePhoto(true)
      }
    },
    {
      name: 'Choose From Library',
      callback: () => {
        setShowPhotoLibrary(true)
      }
    },
    {
      name: 'Upload Photo',
      callback: () => {
        setGrabPhoto(true)
      }
    },
    {
      name: 'Move Photo',
      callback: () => {
        setImage('/default_avatar.png')
      }
    }
  ]

  const photoPickerChange = async (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    const data = document.createElement('img')
    // eslint-disable-next-line func-names
    reader.onload = function (event: any) {
      data.src = event.target.result
      data.setAttribute('data-src', event.target.result)
    }
    reader.readAsDataURL(file)
    setTimeout(() => {
      setImage(data.src)
    }, 100)
  }

  return (
    <>
      <div className='flex items-center justify-center'>
        {type === 'sm' && (
          <div className='relative h-10 w-10'>
            <img src={image} alt='avatar' className='rounded-full' />
          </div>
        )}
        {type === 'lg' && (
          <div className='relative h-14 w-14'>
            <img src={image} alt='avatar' className='rounded-full' />
          </div>
        )}
        {type === 'xl' && (
          <div
            className='relative cursor-pointer z-0'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? 'visible' : 'hidden'
              }`}
              id='context-opener'
              onClick={(e: any) => showContextMenu(e)}
            >
              <FaCamera className='text-2xl' id='context-opener' onClick={(e: any) => showContextMenu(e)} />
              <span id='context-opener' onClick={(e: any) => showContextMenu(e)}>
                Change <br /> Profile Photo
              </span>
            </div>
            <div className='h-60 w-60 flex justify-center items-center'>
              <img src={image} alt='avatar' className='rounded-full' />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showCapturePhoto && <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />}
      {showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLibrary} />}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  )
}

export default Avatar
