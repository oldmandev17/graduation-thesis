/* eslint-disable no-underscore-dangle */
import { IGig } from 'modules/gig'
import { IMessage } from 'modules/message'
import { IUser } from 'modules/user'
import { ReactNode, createContext, useContext, useState } from 'react'

type MessageContextType = {
  currentChatUser: IUser | undefined
  contactsPage: boolean
  messages: Array<IMessage>
  socket: any
  wishlist: Array<IGig>
  handleCurrentChatUser: (value: any) => void
  handleContactsPage: () => void
  handleMessages: (value: any) => void
  handleSocket: (value: any) => void
  handleAddMessage: (value: any) => void
  handleWishlist: (value: any) => void
  handleAddWishlist: (value: any) => void
  handleRemoveWishlist: (value: any) => void
}

const messageContextDefaultValues: MessageContextType = {
  currentChatUser: undefined,
  contactsPage: false,
  messages: [],
  socket: undefined,
  wishlist: [],
  handleCurrentChatUser: () => {},
  handleContactsPage: () => {},
  handleMessages: () => {},
  handleSocket: () => {},
  handleAddMessage: () => {},
  handleWishlist: () => {},
  handleAddWishlist: () => {},
  handleRemoveWishlist: () => {}
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
  const [wishlist, setWishlist] = useState<Array<IGig>>([])

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

  const handleWishlist = (value: Array<IGig>) => {
    setWishlist(value)
  }
  const handleAddWishlist = (value: IGig) => {
    setWishlist((prev: any) => [...prev, value])
  }
  const handleRemoveWishlist = (value: IGig) => {
    setWishlist(wishlist.filter((gig) => gig._id !== value._id))
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    currentChatUser,
    messages,
    socket,
    contactsPage,
    wishlist,
    handleCurrentChatUser,
    handleMessages,
    handleSocket,
    handleAddMessage,
    handleContactsPage,
    handleWishlist,
    handleAddWishlist,
    handleRemoveWishlist
  }
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}
