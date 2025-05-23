/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IoClose } from 'react-icons/io5'

function PhotoLibrary({ setImage, hidePhotoLibrary }: { setImage: any; hidePhotoLibrary: any }) {
  const images: string[] = [
    '/avatars/1.png',
    '/avatars/2.png',
    '/avatars/3.png',
    '/avatars/4.png',
    '/avatars/5.png',
    '/avatars/6.png',
    '/avatars/7.png',
    '/avatars/8.png',
    '/avatars/9.png'
  ]

  return (
    <div className='fixed top-0 left-0 max-h-[100vh] min-w-[100vw] h-full w-full justify-center items-center flex'>
      <div className='h-max w-max bg-gray-900 gap-6 rounded-lg p-4'>
        <div onClick={() => hidePhotoLibrary(false)} className='pt-2 pr-2 cursor-pointer flex items-end justify-end'>
          <IoClose className='h-10 w-10 cursor-pointer' />
        </div>
        <div className='grid grid-cols-3 justify-center items-center gap-16 p-20 w-full'>
          {images.map((image: string, index: number) => (
            <div
              key={image + index}
              onClick={() => {
                setImage(image)
                hidePhotoLibrary(false)
              }}
            >
              <div className='h-24 w-24 cursor-pointer relative'>
                <img src={image} alt='avatar' className='rounded-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhotoLibrary
