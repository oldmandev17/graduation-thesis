import ChatListHeader from './ChatListHeader'
import ContactsList from './ContactsList'

function ChatList() {
  return (
    <div className='z-20 flex flex-col max-h-screen bg-panel-header-background'>
      <ChatListHeader />
      <ContactsList />
    </div>
  )
}

export default ChatList
