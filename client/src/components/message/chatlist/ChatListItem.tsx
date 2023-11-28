/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMessage } from 'contexts/StateContext'
import Avatar from '../common/Avatar'

function ChatListItem({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isContactsPage = false
}: {
  data: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  isContactsPage: boolean
}) {
  const { handleCurrentChatUser, handleContactsPage } = useMessage()

  const handleContactList = () => {
    handleCurrentChatUser(data)
    handleContactsPage()
  }

  return (
    <div className='flex cursor-pointer items-center hover:bg-background-default-hover' onClick={handleContactList}>
      <div className='min-w-fit px-5 pt-3 pb-1'>
        {data?.avatar ? (
          <Avatar type='lg' image={data.avatar} setImage={null} />
        ) : (
          <div className='relative flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full'>
            <span className='text-lg text-white'>{data.email[0].toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className='min-h-full flex flex-col justify-center mt-3 pr-2 w-full'>
        <div className='flex justify-between'>
          <div>
            <span className='text-white'>{data?.name}</span>
          </div>
        </div>
        <div className='flex border-b border-conversation-border pb-2 pt-1 pr-2'>
          <div className='flex justify-between w-full'>
            <span className='text-secondary line-clamp-1 text-sm'>{data?.email || '\u00A0'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatListItem
