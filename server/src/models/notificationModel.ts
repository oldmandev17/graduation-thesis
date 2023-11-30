import mongoose from 'mongoose'
import { IUser } from './userModel'

export enum NotificationStatus {
  SENT = 'SENT',
  SEEN = 'SEEN'
}

export enum NotificationType {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface INotification extends mongoose.Document {
  user: IUser
  name: string
  content: string
  status: NotificationStatus
  type: NotificationType
  createdAt: Date
}

const notificationSchema: mongoose.Schema = new mongoose.Schema<INotification>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(NotificationStatus),
    required: true
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Notification: mongoose.Model<INotification> = mongoose.model<INotification>('notification', notificationSchema)
export default Notification
