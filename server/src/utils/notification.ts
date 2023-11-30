import { NextFunction, Request, Response } from 'express'
import Notification, { INotification, NotificationStatus, NotificationType } from 'src/models/notificationModel'
import APIFeature from './apiFeature'

export async function createNotification(
  user: string,
  name: string,
  content: string,
  type: NotificationType,
  next: NextFunction
) {
  try {
    await Notification.create({
      user,
      name,
      content,
      type,
      status: NotificationStatus.SENT
    })
    return true
  } catch (error) {
    next(error)
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
    const apiFeature = new APIFeature(Notification.find(), req.query).search().filter()
    let notifications: INotification[] = await apiFeature.query
    const filteredCount = notifications.length
    apiFeature.sorting().pagination()
    notifications = await apiFeature.query.clone()

    res.status(200).json({ notifications, filteredCount })
  } catch (error) {
    next(error)
  }
}
