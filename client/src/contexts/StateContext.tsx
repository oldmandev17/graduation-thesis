import { IMessage } from 'modules/message'
import { IUser } from 'modules/user'
import { ReactNode, createContext, useContext, useState } from 'react'

type MessageContextType = {
  currentChatUser: IUser | undefined
  contactsPage: boolean
  messages: Array<IMessage>
  socket: any
  handleCurrentChatUser: (value: any) => void
  handleContactsPage: () => void
  handleMessages: (value: any) => void
  handleSocket: (value: any) => void
  handleAddMessage: (value: any) => void
}

const messageContextDefaultValues: MessageContextType = {
  currentChatUser: undefined,
  contactsPage: false,
  messages: [],
  socket: undefined,
  handleCurrentChatUser: () => {},
  handleContactsPage: () => {},
  handleMessages: () => {},
  handleSocket: () => {},
  handleAddMessage: () => {}
}

const MessageContext = createContext<MessageContextType>(messageContextDefaultValues)

export function useMessage() {
  return useContext(MessageContext)
}

type Props = {
  children: ReactNode
}

export function MessageProvider({ children }: Props) {
  const [currentChatUser, setCurrentChatUser] = useState<any>(undefined)
  const [messages, setMessages] = useState<Array<any>>([])
  const [socket, setSocket] = useState<any>(undefined)
  const [contactsPage, setContactsPage] = useState<boolean>(false)

  const handleCurrentChatUser = (value: any) => {
    setCurrentChatUser(value)
  }

  const handleMessages = (value: any) => {
    setMessages(value)
  }

  const handleSocket = (value: any) => {
    setSocket(value)
  }

  const handleAddMessage = (value: any) => {
    setMessages((prev: any) => [...prev, value])
  }

  const handleContactsPage = () => {
    setContactsPage((prev: boolean) => !prev)
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    currentChatUser,
    messages,
    socket,
    contactsPage,
    handleCurrentChatUser,
    handleMessages,
    handleSocket,
    handleAddMessage,
    handleContactsPage
  }
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}
