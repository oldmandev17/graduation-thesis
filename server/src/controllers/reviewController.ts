import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import Review from 'src/models/reviewModel'
import { MESSAGE_BADREQUEST } from 'src/utils/message'

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    await Review.create()
  } catch (error: any) {
    if (error.isJoi === true) next(httpError.BadRequest(MESSAGE_BADREQUEST))
    next(error)
  }
}
