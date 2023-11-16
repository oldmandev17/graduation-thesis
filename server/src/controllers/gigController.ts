import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Category from 'src/models/categoryModel'
import Gig, { GigStatus, IGig } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import User, { UserRole } from 'src/models/userModel'
import APIFeature from 'src/utils/apiFeature'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { findUser } from 'src/utils/findUser'
import { logger } from 'src/utils/logger'
import { gigDeleteSchema, gigSchema, gigStatusSchema } from 'src/utils/validationSchema'

interface GigQuery {
  status?: GigStatus
  creator?: string
}

export async function createGig(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const categoryExist = await Category.findOne({ _id: result.category })
    if (!categoryExist) {
      throw httpError.NotFound()
    }
    if (categoryExist.level !== 3) {
      throw httpError.NotAcceptable()
    }
    const slug = await createUniqueSlug(Gig, result.name)
    const images: string[] = []
    files.map((file) => images.push(file.path))
    const gig = await Gig.create({
      name: result.name,
      slug,
      description: result.description,
      packages: result.packages,
      FAQs: result.FAQs,
      images,
      category: result.category,
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
  const user = await findUser(req.payload.userId)
  try {
    const gigExist = await Gig.findOne({ _id: req.params.id })
    if (!gigExist) {
      throw httpError.NotFound()
    }
    if (user?.role.includes(UserRole.SELLER) && user._id !== gigExist.createdBy) {
      httpError.NotAcceptable()
    }
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const slug = await createUniqueSlug(Gig, result.name, gigExist.slug)
    const images: string[] = []
    if (files) {
      gigExist?.images?.map((image) => {
        if (existsSync(image)) {
          unlinkSync(image)
        }
      })
      files.map((file) => {
        images.push(file.path)
      })
    }
    const updateField: any = {
      name: result.name ? result.name : gigExist.name,
      slug,
      description: result.description ? result.description : gigExist.description,
      packages: result.packages ? result.packages : gigExist.packages,
      FAQs: result.FAQs ? result.FAQs : gigExist.FAQs,
      images: files ? images : gigExist.images,
      status: result.status ? result.status : gigExist.status,
      category: result.category ? result.category : gigExist.category
    }
    if (user?.role.includes(UserRole.SELLER)) {
      ;(updateField.updatedCustomerAt = Date.now()), (updateField.updatedCustomerBy = req.payload.userId)
    } else {
      ;(updateField.updatedAdminAt = Date.now()), (updateField.updatedAdminBy = req.payload.userId)
    }
    await Gig.updateOne({ _id: req.params.id }, updateField)
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.SELLER) ? LogName.UPDATE_GIG : LogName.UPDATE_GIG_BY_ADMIN,
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
      name: user?.role.includes(UserRole.SELLER) ? LogName.UPDATE_GIG : LogName.UPDATE_GIG_BY_ADMIN,
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
    const result = await gigStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as GigQuery
    const user = await findUser(req.payload.userId)
    const updateField: any = { status }
    if (user?.role.includes(UserRole.SELLER)) {
      updateField.updatedCustomerAt = Date.now()
      updateField.updatedCustomerBy = req.params.id
    } else {
      updateField.updatedAdminAt = Date.now()
      updateField.updatedAdminBy = req.params.id
    }
    result.forEach(async (id: string) => {
      await Gig.updateOne({ _id: id }, updateField)
    })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_GIG,
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

export async function deleteGigs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await gigDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      const gigExist = await Gig.findOne({ _id: id })
      if (gigExist) {
        gigExist?.images?.forEach((image) => {
          if (existsSync(image)) {
            unlinkSync(image)
          }
        })
      }
      await Gig.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_GIG,
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
      name: LogName.DELETE_GIG,
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

export async function getAllGig(req: Request, res: Response, next: NextFunction) {
  try {
    const { creator, ...restQuery } = req.query as unknown as GigQuery
    const apiFeature = new APIFeature(Gig.find(), restQuery).search().filter()
    if (creator) {
      const regex = new RegExp(creator, 'i')
      const users = await User.find({ name: regex }, '_id')
      const userIds = users.map((user) => user._id)
      apiFeature.query.where({ createdBy: { $in: userIds } })
    }
    let gigs: IGig[] = await apiFeature.query.populate('createdBy').exec()
    const filteredCount = gigs.length
    apiFeature.sorting().pagination()
    gigs = await apiFeature.query.clone().populate('createdBy').exec()
    res.status(200).json({ gigs, filteredCount })
  } catch (error: any) {
    next(error)
  }
}
