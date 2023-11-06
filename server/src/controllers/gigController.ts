import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Gig, { GigStatus } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { UserRole } from 'src/models/userModel'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { findUser } from 'src/utils/findUser'
import { logger } from 'src/utils/logger'
import { gigSchema } from 'src/utils/validationSchema'

export async function createGig(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const slug = await createUniqueSlug(Gig, result.name)
    const images: string[] = []
    files.map((file) => images.push(file.path))
    const gig = await Gig.create({
      name: result.name,
      slug,
      description: result.description,
      deliveryTime: result.deliveryTime,
      revisions: result.revisions,
      features: result.features,
      price: result.price,
      shortDesc: result.shortDesc,
      images,
      service: result.service,
      createdBy: req.payload.userId,
      status: GigStatus.WAITING
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
  } catch (error: any) {
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
    const gigExist = await Gig.findOne({ _id: req.params.id })
    if (!gigExist) {
      throw httpError.NotFound()
    }
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const slug = await createUniqueSlug(Gig, result.name, gigExist.slug)
    const images: string[] = []
    if (files) {
      gigExist.images.map((image) => {
        if (existsSync(image)) {
          unlinkSync(image)
        }
      })
      files.map((file) => {
        images.push(file.path)
      })
    }
    const user = await findUser(req.payload.userId)
    const updateField: any = {
      name: result.name,
      slug,
      description: result.description,
      deliveryTime: result.deliveryTime,
      revisions: result.revisions,
      features: result.features,
      price: result.price,
      shortDesc: result.shortDesc,
      images,
      status: result.status,
      service: result.service
    }
    if (user?.role.includes(UserRole.SELLER)) {
      ;(updateField.updatedCustomerAt = Date.now()), (updateField.updatedCustomerBy = req.payload.userId)
    } else {
      ;(updateField.updatedAdminAt = Date.now()), (updateField.updatedAdminBy = req.payload.userId)
    }
    await Gig.updateOne({ _id: req.params.id }, updateField)
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_GIG,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).send()
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_GIG,
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
