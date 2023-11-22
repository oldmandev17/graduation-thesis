import { NextFunction, Request, Response } from 'express'
import Gig, { GigStatus } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { logger } from 'src/utils/logger'
import httpError from 'http-errors'
import { orderDeleteSchema, orderSchema, orderStatusSchema } from 'src/utils/validationSchema'
import Order, { IOrder } from 'src/models/orderModel'
import { findUser } from 'src/utils/findUser'
import User, { UserRole } from 'src/models/userModel'
import { sendEmail } from 'src/utils/sendEmail'
import APIFeature from 'src/utils/apiFeature'

interface OrderQuery {
  status?: OrderStatus
  creator?: string
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderSchema.validateAsync(req.body)
    const gigExist = await Gig.findOne()
    if (gigExist.status !== GigStatus.ACTIVE) {
      throw httpError.NotAcceptable()
    }
    const order = await Order.create()
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_ORDER,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).json({ order })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_ORDER,
      method: LogMethod.POST,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
  const user = await findUser(req.payload.userId)
  try {
    const orderExist = await Order.findOne({ _id: req.params.id })
    if (!orderExist) {
      throw httpError.NotFound()
    }
    const result = await orderSchema.validateAsync(req.body)
    await Order.updateOne()

    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER) ? LogName.UPDATE_ORDER : LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER) ? LogName.UPDATE_ORDER : LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  const user = await findUser(req.payload.userId)
  try {
    const result = await orderStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as OrderQuery
    const updateField: any = { status }
    if (user?.role.includes(UserRole.SELLER)) {
      updateField.updatedCustomerAt = Date.now()
      updateField.updatedCustomerBy = req.params.id
    } else {
      updateField.updatedAdminAt = Date.now()
      updateField.updatedAdminBy = req.params.id
    }
    result.forEach(async (id: string) => {
      const orderExist = await Order.findOne({ _id: id })
      await Order.updateOne({ _id: id }, updateField).populate('createdBy')
      const title = 'Exciting News: Your Fiverr Order Has Been Updated!'
      const content =
        "<p>Hello,</p><p>We're writing to inform you that the status of your order on Fiverr has just been updated. Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly.</p><p>If you have any questions or need assistance, feel free to contact us through the help section or Fiverr's support email.</p><p>Thank you for working on Fiverr, and we wish you a great day!</p><p>Best regards,<br>[Your Name or Fiverr Support Team]</p>"
      await sendEmail(orderExist?.createdBy?.email as string, title, content, next)
    })
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER) ? LogName.UPDATE_ORDER : LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.sendStatus(200)
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER) ? LogName.UPDATE_ORDER : LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export async function deleteOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      await Order.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_ORDER,
      method: LogMethod.DELETE,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.sendStatus(204)
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_ORDER,
      method: LogMethod.DELETE,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export async function getAllOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { creator, ...restQuery } = req.query as unknown as OrderQuery
    const apiFeature = new APIFeature(Order.find(), restQuery).search().filter()
    if (creator) {
      const regex = new RegExp(creator, 'i')
      const users = await User.find({ name: regex }, '_id')
      const userIds = users.map((user) => user._id)
      apiFeature.query.where({ createdBy: { $in: userIds } })
    }
    let orders: IOrder[] = await apiFeature.query.populate('createdBy').exec()
    const filteredCount = orders.length
    apiFeature.sorting().pagination()
    orders = await apiFeature.query.clone().populate('createdBy').exec()
    res.status(200).json({ orders, filteredCount })
  } catch (error: any) {
    next(error)
  }
}
