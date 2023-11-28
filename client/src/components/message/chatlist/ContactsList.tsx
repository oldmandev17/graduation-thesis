import { useEffect, useState } from 'react'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi'
import { useAppSelector } from 'stores/hooks'
import { useMessage } from 'contexts/StateContext'
import ChatListItem from './ChatListItem'

function ContactsList() {
  const { user } = useAppSelector((state) => state.auth)
  const [allContacts, setAllContacts] = useState<Array<any>>([])
  const { handleContactsPage } = useMessage()

  useEffect(() => {
    if (user?.contacts) setAllContacts(user?.contacts)
  }, [user])

  return (
    <div className='h-full flex flex-col'>
      <div className='h-24 flex items-end px-3 py-4'>
        <div className='flex items-center gap-12 text-white'>
          <BiArrowBack className='cursor-pointer text-lg' onClick={() => handleContactsPage()} />
          <span>New Chat</span>
        </div>
      </div>
      <div className='bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar'>
        <div className='flex py-3 items-center gap-3 h-14'>
          <div className='bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4'>
            <div>
              <BiSearchAlt2 className='text-panel-header-icon cursor-pointer text-xl' />
            </div>
            <div>
              <input
                type='text'
                placeholder='Search contacts'
                className='bg-transparent text-sm focus:outline-none text-white w-full'
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className='text-teal-light pl-10 py-5'>{initialLetter}</div>
              {userList.map(
                (contact: { id: string; name: string; email: string; profilePicture: string; about: string }) => {
                  return <ChatListItem data={contact} isContactsPage key={contact.id} />
                }
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactsList
