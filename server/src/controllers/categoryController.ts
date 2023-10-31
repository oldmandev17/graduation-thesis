import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Category, { CategoryStatus, ICategory } from 'src/models/categoryModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import { logger } from 'src/utils/logger'
import { categogySchema, categoryDeleteSchema, categoryStatusSchema } from 'src/utils/validationSchema'

interface CategoryQuery {
  status: CategoryStatus
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await categogySchema.validateAsync(req.body)
    const category = await Category.create({
      image: file.path,
      name: result.name,
      createdBy: req.payload.userId
    })
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_CATEGORY,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).json({ category })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_CATEGORY,
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

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File
    const categoryExist = await Category.findOne({
      _id: req.params.id
    })
    if (!categoryExist) throw httpError.NotFound()
    else {
      if (existsSync(categoryExist?.image)) unlinkSync(categoryExist?.image)
    }
    const result = await categogySchema.validateAsync(req.body)
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        image: file?.path,
        name: result.name,
        updatedAt: Date.now(),
        updatedBy: req.payload.userId
      },
      { new: true }
    )
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_CATEGORY,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ category })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_CATEGORY,
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

export const updateCategoryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as CategoryQuery
    result.forEach(async (id: string) => {
      await Category.updateOne(
        { _id: id },
        {
          status,
          updatedAt: new Date(),
          updatedBy: req.payload.userId
        }
      )
    })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_CATEGORY_STATUS,
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
      name: LogName.UPDATE_CATEGORY_STATUS,
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

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiFeature = new APIFeature(Category.find().populate('createdBy').populate('updatedBy'), req.query)
      .search()
      .filter()
    let categories: ICategory[] = await apiFeature.query
    const filteredCount = categories.length
    apiFeature.sorting().pagination()
    categories = await apiFeature.query.clone()
    res.status(200).json({ categories, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export async function deleteCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      await Category.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_CATEGORIES,
      method: LogMethod.DELETE,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(204).send()
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_CATEGORIES,
      method: LogMethod.DELETE,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    next(error)
  }
}
