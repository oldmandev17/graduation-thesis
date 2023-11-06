import { NextFunction, Request, Response } from 'express'
import Gig from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { logger } from 'src/utils/logger'
import { gigSchema } from 'src/utils/validationSchema'

export async function createGig(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const slug = createUniqueSlug(Gig, result.name)
    const gig = await Gig.create({
      
    })
    res.status(201).json({ gig })
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_GIG,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
  } catch (error:any) {
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_GIG,
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

export async function updateGig(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    const re
  } catch (error) {}
}

export async function updateGigStatus(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}

export async function deleteGigs(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}

export async function getAllGig(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}

export async function getAllGigByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (error) {}
}
