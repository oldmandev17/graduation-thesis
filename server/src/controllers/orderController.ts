import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import Gig, { GigStatus } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { NotificationType } from 'src/models/notificationModel'
import Order, { IOrder, OrderStatus } from 'src/models/orderModel'
import User, { UserRole } from 'src/models/userModel'
import APIFeature from 'src/utils/apiFeature'
import { findUser } from 'src/utils/findUser'
import { logger } from 'src/utils/logger'
import { MESSAGE_NOTACCEPTABLE, MESSAGE_NOTFOUND } from 'src/utils/message'
import { createNotification } from 'src/utils/notification'
import { sendEmail } from 'src/utils/sendEmail'
import { orderDeleteSchema, orderSchema, orderStatusSchema } from 'src/utils/validationSchema'
import Stripe from 'stripe'

const stripe = new Stripe(
  'sk_test_51NpqrlIi5UcP2vQDbjzaLeYR3dlKoIyaDiY85l9dXkcianiauklIQKnZuHqGM0qZybXqrKPjW528FxeajafzKy0q00KfLXtDWD',
  { apiVersion: '2023-10-16' }
)

interface OrderQuery {
  status?: OrderStatus
  creator?: string
}

function generateShortId(length: number) {
  const randomBytes = crypto.randomBytes(Math.ceil((length * 3) / 4))
  const base64 = randomBytes.toString('base64')
  const id = base64.replace(/[^a-zA-Z0-9]/g, '')
  return id.substring(0, length)
}

export async function createPaymentIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (req.query.amount as any) * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    })
    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    next(error)
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderSchema.validateAsync(req.body)
    const gigExist = await Gig.findOne({ _id: result.gig }).populate('createdBy')
    let userSeller
    if (!gigExist) throw httpError.NotFound(MESSAGE_NOTFOUND)
    if (gigExist && gigExist.createdBy) userSeller = await User.findOne({ _id: gigExist.createdBy._id })
    if (gigExist.status !== GigStatus.ACTIVE) {
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    }
    const order = await Order.create({
      paymentID: result.paymentID,
      method: result.method,
      price: result.price,
      quantity: result.quantity,
      dueOn: result.dueOn,
      type: result.type,
      gig: result.gig,
      createdBy: req.payload.userId,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      name: generateShortId(10)
    })
    const userExist = await User.findOne({ _id: req.payload.userId })
    if (userExist) {
      const arrUserIds = userExist.orders.map((order) => order._id)
      const arrGigIds = gigExist.orders.map((order) => order._id)
      if (order) {
        arrUserIds.push(order._id)
        arrGigIds.push(order._id)
      }
      await User.updateOne({ _id: req.payload.userId }, { orders: arrUserIds })
      await Gig.updateOne({ _id: result.gig }, { orders: arrUserIds })
    }
    createNotification(
      null,
      'New Order Create',
      `<p>Just a heads up, we've received a new order created.<a className="font-semibold text-blue-600" href="${process.env.URL_ADMIN}/order-detail/${order?._id}"> Learn more</a></p>`,
      NotificationType.ADMIN,
      next
    )
    createNotification(
      req.payload.userId,
      'Create Order Completed!',
      `<p>Waiting for seller approval. Thanks for your patience! You can review order.<a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${userExist?.id}/buyer-orders/${order?._id}'> Learn more</a></p>`,
      NotificationType.USER,
      next
    )
    createNotification(
      userSeller?._id,
      'You just receive a order from buyer!',
      `<p>Please comfirm the order.You can review order.<a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${userSeller?.id}/orders/${order?._id}'> Learn more</a></p>`,
      NotificationType.USER,
      next
    )

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

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  const user = await findUser(req.payload.userId)
  try {
    const result = await orderStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as OrderQuery
    const updateField: any = { status }
    if (result.reason) {
      updateField.reason = result.reason
    }
    if (user?.role.includes(UserRole.SELLER)) {
      updateField.updatedCustomerAt = Date.now()
      updateField.updatedCustomerBy = req.params.id
    } else {
      updateField.updatedAdminAt = Date.now()
      updateField.updatedAdminBy = req.params.id
    }
    const orderExist = await Order.findOne({ _id: result.ids[0] })
      .populate('createdBy')
      .populate({ path: 'gig', populate: { path: 'createdBy' } })
    if (status === OrderStatus.CANCEL && orderExist && orderExist.status !== OrderStatus.PENDING)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (status === OrderStatus.PAID && orderExist && orderExist.status !== OrderStatus.PENDING)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (status === OrderStatus.ACCEPT && orderExist && orderExist.status !== OrderStatus.PENDING)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (status === OrderStatus.COMPLETE && orderExist && orderExist.status !== OrderStatus.BUYER_COMFIRM)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (status === OrderStatus.SELLER_COMFIRM && orderExist && orderExist.status !== OrderStatus.ACCEPT)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (status === OrderStatus.BUYER_COMFIRM && orderExist && orderExist.status !== OrderStatus.SELLER_COMFIRM)
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    else if (
      status === OrderStatus.ADMIN_COMFIRM &&
      orderExist &&
      orderExist.status !== OrderStatus.CANCEL &&
      orderExist.status !== OrderStatus.PAID
    )
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)

    await Order.updateOne({ _id: result.ids[0] }, updateField)
    if (
      user &&
      (user.role.includes(UserRole.ADMIN) || user.role.includes(UserRole.MANAGER)) &&
      status === OrderStatus.COMPLETE
    ) {
      const title = 'Exciting News: Your Freelancer Order Has Been Completed!'
      const content =
        "<p>Hello,</p><p>We're writing to inform you that the status of your order on Freelancer has just been completed. Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly.</p><p>If you have any questions or need assistance, feel free to contact us through the help section or Freelancer's support email.</p><p>Thank you for working on Freelancer, and we wish you a great day!</p><p>Best regards,<br>[Your Name or Freelancer Support Team]</p>"
      await sendEmail(orderExist?.createdBy?.email as string, title, content, next)
      await sendEmail(orderExist?.gig?.createdBy?.email as string, title, content, next)
    }
    if (user && user.role.includes(UserRole.BUYER)) {
      createNotification(
        orderExist?.gig?.createdBy?._id,
        'Your Freelancer Order Has Been Updated!',
        `<p>Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${user?.id}/orders/${orderExist?._id}'> Learn more</a></p>`,
        NotificationType.USER,
        next
      )
    }
    if (user && user.role.includes(UserRole.SELLER)) {
      createNotification(
        orderExist?.createdBy?._id,
        'Your Freelancer Order Has Been Updated!',
        `<p>Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${user?.id}/buyer-orders/${orderExist?._id}'> Learn more</a></p>`,
        NotificationType.USER,
        next
      )
    }
    if (status === OrderStatus.COMPLETE) {
      createNotification(
        null,
        'Your Freelancer Order Has Been Updated!',
        `<p>Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_ADMIN}/order-detail/${orderExist?._id}'> Learn more</a></p>`,
        NotificationType.ADMIN,
        next
      )
      createNotification(
        orderExist?.createdBy?._id,
        'Your Freelancer Order Has Been Completed!',
        `<p>Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${user?.id}/buyer-orders/${orderExist?._id}'> Learn more</a></p>`,
        NotificationType.USER,
        next
      )
      createNotification(
        orderExist?.gig?.createdBy?._id,
        'Your Freelancer Order Has Been Completed!',
        `<p>Please check the latest status of your order to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/user/${user?.id}/orders/${orderExist?._id}'> Learn more</a></p>`,
        NotificationType.USER,
        next
      )
    }

    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.BUYER) ? LogName.UPDATE_ORDER : LogName.UPDATE_ORDER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).send()
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

export async function getOrderDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const orderExist = await Order.findOne({ _id: req.params.id })
      .populate('createdBy')
      .populate({
        path: 'gig',
        populate: [{ path: 'createdBy' }, { path: 'reviews' }]
      })

    res.status(200).json({ order: orderExist })
  } catch (error: any) {
    next(error)
  }
}

export async function getAllOrderByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userExist = await findUser(req.payload.userId)
    if (!userExist) throw httpError.NotFound(MESSAGE_NOTFOUND)
    const arrIds = userExist.gigs.map((gig) => gig._id)
    const filter: any = {}
    if (req.params.role === 'seller') {
      filter.gig = { $in: arrIds }
    } else {
      filter.createdBy = req.payload.userId
    }
    const apiFeature = new APIFeature(
      Order.find(filter)
        .populate({
          path: 'gig',
          populate: { path: 'createdBy' }
        })
        .populate('createdBy'),
      req.query
    )
      .search()
      .filter()

    let orders: IOrder[] = await apiFeature.query
    const filteredCount = orders.length
    apiFeature.sorting().pagination()
    orders = await apiFeature.query.clone()
    res.status(200).json({ orders, filteredCount })
  } catch (error: any) {
    next(error)
  }
}
