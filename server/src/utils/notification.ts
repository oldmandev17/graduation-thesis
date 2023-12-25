import { NextFunction, Request, Response } from 'express'
import Notification, { NotificationStatus, NotificationType } from 'src/models/notificationModel'
import { UserRole } from 'src/models/userModel'
import { findUser } from './findUser'

export async function createNotification(
  user: string | null,
  name: string,
  content: string,
  type: NotificationType,
  next: NextFunction | null
) {
  try {
    const notification: any = {
      name,
      content,
      type,
      status: NotificationStatus.SENT
    }
    if (user) {
      notification.user = user
    }
    await Notification.create(notification)
    return true
  } catch (error) {
    if (next) next(error)
    return false
  }
}

export async function seenNotification(req: Request, res: Response, next: NextFunction) {
  try {
    await Notification.updateOne(
      { _id: req.params.id },
      {
        status: NotificationStatus.SEEN
      }
    )
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

export async function getAllNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUser(req.payload.userId)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    const query: any = {
      $or: [
        {
          status: NotificationStatus.SENT
        },
        {
          createdAt: {
            $gte: todayStart,
            $lt: todayEnd
          }
        }
      ]
    }
    if (user?.role.includes(UserRole.ADMIN) || user?.role.includes(UserRole.ADMIN)) {
      query.type = NotificationType.ADMIN
    } else {
      query.user = req.payload.userId
      query.type = NotificationType.USER
    }
    const notifications = await Notification.find(query).sort({ createdAt: 'desc' }).populate('user')

    res.status(200).json({ notifications })
  } catch (error) {
    next(error)
  }
}
