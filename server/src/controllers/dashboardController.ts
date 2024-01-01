/* eslint-disable no-case-declarations */
import { NextFunction, Request, Response } from 'express'
import Order from 'src/models/orderModel'
import User from 'src/models/userModel'

export async function adminAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const currentDay = new Date()
    const filter: any = {}
    switch (req.params.timeInterval) {
      case 'day':
        const endOfDay = new Date(currentDay)
        endOfDay.setDate(endOfDay.getDate() - 1)
        endOfDay.setHours(0, 0, 0, 0)
        filter.createdAt = {
          $gte: endOfDay,
          $lte: currentDay
        }
        break
      case 'month':
        const startOfPreviousMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1)
        const endOfPreviousMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 0, 23, 59, 59, 999)
        filter.createdAt = {
          $gte: startOfPreviousMonth,
          $lte: endOfPreviousMonth
        }
        break
      case 'year':
        const startOfPreviousYear = new Date(currentDay.getFullYear() - 1, 0, 1)
        const endOfPreviousYear = new Date(currentDay.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
        filter.createdAt = {
          $gte: startOfPreviousYear,
          $lte: endOfPreviousYear
        }
        break
      default:
        break
    }
    const users = await User.find(filter)
    const orders = await Order.find(filter)
    res.status(200).json({ users, orders })
  } catch (error: any) {
    next(error)
  }
}
