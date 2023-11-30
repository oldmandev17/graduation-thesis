import { IUser } from './user'

export enum NotificationStatus {
  SENT = 'SENT',
  SEEN = 'SEEN'
}

export enum NotificationType {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface INotification {
  user: IUser
  name: string
  content: string
  status: NotificationStatus
  type: NotificationType
  createdAt: Date
}
