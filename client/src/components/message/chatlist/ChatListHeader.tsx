import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { useAppSelector } from 'stores/hooks'
import { useMessage } from 'contexts/StateContext'
import Avatar from '../common/Avatar'

function ChatListHeader() {
  const { user } = useAppSelector((state) => state.auth)
  const { handleContactsPage } = useMessage()

  const handleAllContactsPage = () => {
    handleContactsPage()
  }

  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>
      <div className='cursor-pointer'>
        {user?.avatar ? (
          <Avatar type='sm' image={process.env.REACT_APP_URL_SERVER + user.avatar} setImage={null} />
        ) : (
          <div className='relative flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full'>
            <span className='text-lg text-white'>{user && user?.email[0].toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className='flex gap-6'>
        <BsFillChatLeftTextFill
          className='text-panel-header-icon cursor-pointer text-xl'
          title='New Chat'
          onClick={handleAllContactsPage}
        />
        <BsThreeDotsVertical className='text-panel-header-icon cursor-pointer text-xl' title='Menu' />
      </div>
    </div>
  )
}

export default ChatListHeader
