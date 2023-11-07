import { NextFunction, Request, Response } from 'express'
import Gig, { GigStatus } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { logger } from 'src/utils/logger'
import httpError from 'http-errors'
import { orderSchema } from 'src/utils/validationSchema'
import Order from 'src/models/orderModel'
import { findUser } from 'src/utils/findUser'
import { UserRole } from 'src/models/userModel'

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderSchema.validateAsync(req.body)
    const gigExist = await Gig.findOne()
    if(gigExist.status !== GigStatus.ACTIVE) {
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
    res.status(201).json({order})
  } catch (error:any) {
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
    const orderExist = await Order.findOne({_id:req.params.id})
    if (!orderExist) {
      throw httpError.NotFound()
    }
    const result = await orderSchema.validateAsync(req.body)
    await Order.updateOne()

    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER)?LogName.UPDATE_ORDER:LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
  } catch (error:any) {
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER)?LogName.UPDATE_ORDER:LogName.UPDATE_ORDER_BY_ADMIN,
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
  try {
  } catch (error) {}
}

export async function deleteOrders(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}

export async function getAllOrder(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}
