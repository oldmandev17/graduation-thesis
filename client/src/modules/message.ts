/* eslint-disable import/no-cycle */
import { IUser } from './user'

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export enum MessageStatus {
  SENT = 'SENT',
  READ = 'READ',
  DELIVERED = 'DELIVERED'
}

export interface IMessage {
  _id: string
  message: string
  type: MessageType
  status: MessageStatus
  sender: IUser
  receiver: IUser
  createdAt: Date
}
