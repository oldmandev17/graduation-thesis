import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Category, { CategoryStatus, ICategory } from 'src/models/categoryModel'
import Gig, { IGig } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import APIFeature from 'src/utils/apiFeature'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { logger } from 'src/utils/logger'
import { categoryDeleteSchema, categorySchema, categoryStatusSchema } from 'src/utils/validationSchema'

interface CategoryQuery {
  status?: CategoryStatus
  parent?: string
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await categorySchema.validateAsync(req.body)
    const slug = await createUniqueSlug(Category, result.name)
    const { parent } = req.query as unknown as CategoryQuery
    const category = new Category({
      image: file.path,
      description: result.description,
      name: result.name,
      status: result.status,
      features: result.features,
      slug,
      level: 1,
      createdBy: req.payload.userId
    })

    if (parent) {
      const parentCategory = await Category.findOne({ _id: parent })
      if (!parentCategory) {
        throw httpError.NotFound()
      }
      const level = parentCategory.level + 1
      if (level > 3) {
        throw httpError.NotAcceptable()
      }
      category.level = level
      parentCategory.subCategories.push(category)
      await parentCategory.save()
    }
    await category.save()
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
    const { parent } = req.query as unknown as CategoryQuery
    const result = await categorySchema.validateAsync(req.body)
    const categoryExist = await Category.findOne({
      _id: req.params.id
    })
    if (!categoryExist) throw httpError.NotFound()
    else {
      if (file && existsSync(categoryExist?.image)) unlinkSync(categoryExist?.image)
    }
    const slug = await createUniqueSlug(Category, result.name, categoryExist.slug)
    let category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        image: file ? file.path : categoryExist.image,
        name: result.name,
        description: result.description,
        features: result.features,
        slug,
        level: 1,
        updatedAt: Date.now(),
        updatedBy: req.payload.userId
      },
      { new: true }
    )
    if (parent === req.params.id) {
      throw httpError.Conflict()
    }
    const currentParentCategory = await Category.findOne({ subCategories: req.params.id })
    if (currentParentCategory) {
      currentParentCategory.subCategories = currentParentCategory.subCategories.filter(
        (category) => String(category._id) !== req.params.id
      )
      await currentParentCategory.save()
    }
    if (parent) {
      const newParentCategory = await Category.findOne({ _id: parent })
      if (newParentCategory) {
        newParentCategory.subCategories.push(category?._id)
        await newParentCategory.save()
        category = await Category.findOneAndUpdate(
          { _id: req.params.id },
          {
            level: newParentCategory.level + 1,
            updatedAt: Date.now(),
            updatedBy: req.payload.userId
          },
          { new: true }
        )
      }
      const maxLevel = 3
      const updateCategoryLevels = async (categoryId: string, currentLevel: number) => {
        const subCategory = await Category.findOne({ _id: categoryId })
        if (!subCategory) {
          return
        }

        if (currentLevel <= maxLevel) {
          await Category.updateOne(
            { _id: subCategory._id },
            {
              level: currentLevel,
              updatedAt: Date.now(),
              updatedBy: req.payload.userId
            }
          )

          subCategory.subCategories.forEach(async (subCategory) => {
            await updateCategoryLevels(subCategory._id, currentLevel + 1)
          })
        }
      }
      category?.subCategories.forEach(async (subCategory) => {
        await updateCategoryLevels(subCategory._id, (category?.level as number) + 1)
      })
    }
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_CATEGORY,
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
          updatedAt: Date.now(),
          updatedBy: req.payload.userId
        }
      )
    })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_CATEGORY,
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

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parent, ...restQuery } = req.query as unknown as CategoryQuery

    const query = Category.find()
      .populate({ path: 'createdBy', select: '_id name email phone provider verify role status' })
      .populate({ path: 'updatedBy', select: '_id name email phone provider verify role status' })
      .populate({
        path: 'subCategories',
        populate: { path: 'subCategories', populate: { path: 'subCategories' } }
      })
    if (parent) {
      query.where({
        _id: parent
      })
    }

    const apiFeature = new APIFeature(query, restQuery).search().filter()
    let categories: ICategory[] = await apiFeature.query
    const filteredCount = categories.length
    apiFeature.sorting().pagination()
    categories = await apiFeature.query.clone()
    const arrParentCategory: { label: string; value: any }[] = []
    const arrCategory: { label: string; value: any; subCategories: Array<ICategory> }[] = []
    categories.map((parentCategory: ICategory) => {
      arrParentCategory.push({
        label: parentCategory.name,
        value: parentCategory._id
      })
      parentCategory.subCategories.map((category: ICategory) => {
        arrCategory.push({
          label: category.name,
          value: category._id,
          subCategories: category.subCategories
        })
      })
    })
    res.status(200).json({ categories, filteredCount, arrParentCategory, arrCategory })
  } catch (error: any) {
    next(error)
  }
}

export async function deleteCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      const categoryExist = await Category.findOne({ _id: id })
      if (categoryExist && existsSync(categoryExist?.image)) {
        unlinkSync(categoryExist?.image)
      }
      await Category.deleteOne({ _id: id })
      const currentParentCategory = await Category.findOne({ subCategories: req.params.id })
      if (currentParentCategory) {
        currentParentCategory.subCategories = currentParentCategory.subCategories.filter(
          (category) => String(category._id) !== req.params.id
        )
        await currentParentCategory.save()
      }
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
    res.sendStatus(204)
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

export async function getCategoryDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const queryField: any = {}
    if (req.params.id) {
      queryField._id = req.params.id
    } else {
      queryField.slug = req.params.slug
    }
    const categoryExist = await Category.findOne(queryField)
      .populate({
        path: 'subCategories',
        populate: { path: 'subCategories', populate: { path: 'subCategories' } }
      })
      .populate({ path: 'createdBy', select: '_id name email phone provider verify role status' })
      .populate({ path: 'updatedBy', select: '_id name email phone provider verify role status' })
    if (!categoryExist) {
      throw httpError.NotFound()
    }
    const parentCategory = await Category.findOne({ subCategories: categoryExist._id })
    const gigs: IGig[] = await Gig.find({ category: req.params.id })
    categoryExist.gigs = gigs
    res.status(200).json({ category: categoryExist, parentCategory })
  } catch (error) {
    next(error)
  }
}
