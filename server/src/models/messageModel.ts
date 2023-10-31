import mongoose from 'mongoose'
import { IUser } from './userModel'

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE'
}

export enum MessageStatus {
  SENT = 'SENT',
  READ = 'READ'
}

export interface IMessage extends mongoose.Document {
  message: string
  type: MessageType
  status: MessageStatus
  sender: IUser
  reciever: IUser
  createdAt: Date
}

const messageSchem = new mongoose.Schema<IMessage>({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT
  },
  status: {
    type: String,
    enum: Object.values(MessageStatus),
    default: MessageStatus.SENT
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Message: mongoose.Model<IMessage> = mongoose.model<IMessage>('message', messageSchem)
export default Message
