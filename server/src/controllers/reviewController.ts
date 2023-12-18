import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import Review from 'src/models/reviewModel'

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    await Review.create()
  } catch (error: any) {
    if (error.isJoi === true) next(httpError.BadRequest())
    next(error)
  }
}
