import { useMessage } from 'contexts/StateContext'
import { useEffect, useState } from 'react'
import ChatListHeader from './ChatListHeader'
import SearchBar from './SearchBar'
import List from './List'
import ContactsList from './ContactsList'

function ChatList() {
  const { contactsPage } = useMessage()
  const [pageType, setPageType] = useState<string>('default')

  useEffect(() => {
    if (contactsPage) {
      setPageType('all-contacts')
    } else {
      setPageType('default')
    }
  }, [contactsPage])

  return (
    <div className='bg-panel-header-background flex flex-col max-h-screen z-20'>
      {pageType === 'default' && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === 'all-contacts' && <ContactsList />}
    </div>
  )
}

export default ChatList
