/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMessage } from 'contexts/StateContext'
import { IUser } from 'modules/user'
import Avatar from '../common/Avatar'

function ChatListItem({ user }: { user: IUser }) {
  const { handleCurrentChatUser, handleContactsPage } = useMessage()

  const handleContactList = () => {
    handleCurrentChatUser(user)
    handleContactsPage()
  }

  return (
    <div className='flex items-center cursor-pointer hover:bg-background-default-hover' onClick={handleContactList}>
      <div className='px-5 pt-3 pb-1 min-w-fit'>
        {user?.avatar ? (
          <Avatar
            type='lg'
            image={
              user.avatar.startsWith('upload') ? `${process.env.REACT_APP_URL_SERVER}/${user.avatar}` : user.avatar
            }
            setImage={null}
          />
        ) : (
          <div className='relative flex items-center justify-center bg-purple-500 rounded-full w-14 h-14'>
            <span className='text-lg text-white'>{user.email[0].toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className='flex flex-col justify-center w-full min-h-full pr-2 mt-3'>
        <div className='flex justify-between'>
          <div>
            <span className='text-white'>{user?.name}</span>
          </div>
        </div>
        <div className='flex pt-1 pb-2 pr-2 border-b border-conversation-border'>
          <div className='flex justify-between w-full'>
            <span className='text-sm text-secondary line-clamp-1'>{user?.email || '\u00A0'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatListItem
