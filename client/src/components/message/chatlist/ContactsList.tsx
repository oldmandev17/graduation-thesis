/* eslint-disable no-underscore-dangle */
import { getProfile } from 'apis/api'
import { useMessage } from 'contexts/StateContext'
import { IUser } from 'modules/user'
import { useCallback, useEffect, useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { BsFilter } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { getToken } from 'utils/auth'
import ChatListItem from './ChatListItem'

function ContactsList() {
  const [allContacts, setAllContacts] = useState<Array<any>>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { accessToken } = getToken()
  const { currentChatUser } = useMessage()

  const getUserProfile = useCallback(async () => {
    await getProfile(accessToken)
      .then((response) => {
        if (response.status === 200) {
          setAllContacts(response.data.contacts)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken])

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  const filteredContacts = Object.keys(allContacts).reduce((acc: any, key: any) => {
    const filtered = allContacts[key].filter((contact: any) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filtered.length > 0) {
      acc[key] = filtered
    }

    return acc
  }, {})

  return (
    <div className='flex flex-col h-full'>
      {currentChatUser && (
        <div className='py-5'>
          <div className='pb-2 pl-10 font-semibold text-primary-strong'>Current User Chat</div>
          <ChatListItem user={currentChatUser} />
        </div>
      )}
      <div className='flex items-center gap-3 pl-5 h-14'>
        <div className='flex items-center flex-grow w-full gap-5 px-3 py-1 rounded-lg bg-[#e5e7eb]'>
          <div>
            <BiSearchAlt2 className='text-xl cursor-pointer text-panel-header-icon' />
          </div>
          <div>
            <input
              type='text'
              placeholder='Search people ...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full text-sm bg-transparent text-primary-strong focus:outline-none'
            />
          </div>
        </div>
        <div className='pl-3 pr-5'>
          <BsFilter className='text-xl cursor-pointer text-panel-header-icon' />
        </div>
      </div>
      <div className='flex-auto h-full overflow-auto bg-search-input-container-background custom-scrollbar'>
        {Object.entries(filteredContacts).map(([initialLetter, userList]: [string, any]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className='pt-5 pb-2 pl-10 text-teal-light'>{initialLetter}</div>
              {userList.map((contact: IUser) => {
                return <ChatListItem user={contact} key={contact._id} />
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactsList
