import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import Gig from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import Order from 'src/models/orderModel'
import Review, { ReviewStatus } from 'src/models/reviewModel'
import { logger } from 'src/utils/logger'
import { MESSAGE_NOTACCEPTABLE, MESSAGE_NOTFOUND } from 'src/utils/message'
import { orderSchema } from 'src/utils/validationSchema'

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderSchema.validateAsync(req.body)
    const gigExist = await Gig.findOne({ _id: req.params.id })
    if (!gigExist) {
      throw httpError.NotFound(MESSAGE_NOTFOUND)
    }
    const orderExist = await Order.find({ gig: gigExist?._id, createdBy: req.payload.userId })
    if (orderExist.length < 1) {
      throw httpError.NotAcceptable(MESSAGE_NOTACCEPTABLE)
    }
    const review = await Review.create({
      ...result,
      status: ReviewStatus.ACTIVE,
      reviewer: req.payload.userId,
      createdAt: Date.now()
    })
    if (gigExist) {
      const arrIds = gigExist.reviews.map((gig) => gig._id)
      if (review) {
        arrIds.push(review._id)
      }
      await Gig.updateOne({ _id: req.params.id }, { reviews: arrIds })
    }
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_REVIEW,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).json({ review })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_REVIEW,
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
