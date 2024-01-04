import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import Category, { ICategory } from 'src/models/categoryModel'
import Gig, { GigStatus, IGig } from 'src/models/gigModel'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import { NotificationType } from 'src/models/notificationModel'
import Order, { OrderStatus } from 'src/models/orderModel'
import User, { UserRole } from 'src/models/userModel'
import APIFeature from 'src/utils/apiFeature'
import { createUniqueSlug } from 'src/utils/createUniqueSlug'
import { findUser } from 'src/utils/findUser'
import { logger } from 'src/utils/logger'
import { createNotification } from 'src/utils/notification'
import { sendEmail } from 'src/utils/sendEmail'
import { gigDeleteSchema, gigSchema, gigStatusSchema } from 'src/utils/validationSchema'

export enum SortFilter {
  BEST_SELLING = 'BEST_SELLING',
  LATEST = 'LATEST',
  PRICE_DESCENDING = 'PRICE_DESCENDING',
  PRICE_ASCENDING = 'PRICE_ASCENDING'
}

interface GigQuery {
  status?: GigStatus
  creator?: string
  categoryId?: string
  sort?: SortFilter
  budget?: string
  time?: string
}

export async function createGig(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[]
    const result = await gigSchema.validateAsync(req.body)
    const categoryExist = await Category.findOne({ _id: result.category })
    if (!categoryExist) {
      throw httpError.NotFound('Category does not exist.')
    }
    if (categoryExist.level !== 3) {
      throw httpError.NotAcceptable('Category level is invalid.')
    }
    const slug = await createUniqueSlug(Gig, result.name)
    const images: string[] = []
    files
      .filter((image) => image.fieldname === 'images[]')
      .map((file) => {
        images.push(file.path)
      })
    const gig = await Gig.create({
      name: result.name,
      slug,
      description: result.description,
      packages: result.packages,
      FAQs: result.FAQs,
      images,
      category: result.category,
      createdBy: req.payload.userId,
      status: GigStatus.NONE
    })
    const userExist = await User.findOne({ _id: req.payload.userId })
    if (userExist) {
      const arrIds = userExist.gigs.map((gig) => gig._id)
      if (gig) {
        arrIds.push(gig._id)
      }
      await User.updateOne({ _id: req.payload.userId }, { gigs: arrIds })
    }
    logger({
      user: req.payload.userId,
      name: LogName.CREATE_GIG,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(201).json({ gig })
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
      throw httpError.NotFound('Gig does not exist.')
    }
    if (user?.role.includes(UserRole.SELLER) && user._id !== gigExist.createdBy) {
      httpError.NotAcceptable('Account has no permissions.')
    }
    const files = req.files as Express.Multer.File[]

    const result = await gigSchema.validateAsync(req.body)

    const slug = await createUniqueSlug(Gig, result.name, gigExist.slug)
    const images: string[] = []
    if (result.images) {
      result.images.forEach((image: string) => images.push(image))
    }
    if (files.length > 0) {
      gigExist?.images?.map((image) => {
        if (existsSync(image) && result?.images?.filter((imageOld: string) => imageOld === image).length !== 0) {
          unlinkSync(image)
        }
      })
      files
        ?.filter((image) => image.fieldname === 'images[]')
        .map((file) => {
          images.push(file.path)
        })
    }
    const updateField: any = {
      name: result.name ? result.name : gigExist.name,
      slug,
      description: result.description ? result.description : gigExist.description,
      packages: result.packages ? result.packages : gigExist.packages,
      FAQs: result.FAQs ? result.FAQs : gigExist.FAQs,
      images: files.length > 0 ? images : gigExist.images,
      status: result.status ? result.status : gigExist.status,
      category: result.category ? result.category : gigExist.category
    }
    if (user?.role.includes(UserRole.SELLER)) {
      ;(updateField.updatedCustomerAt = Date.now()), (updateField.updatedCustomerBy = req.payload.userId)
    } else {
      ;(updateField.updatedAdminAt = Date.now()), (updateField.updatedAdminBy = req.payload.userId)
    }
    const gigUpdate = await Gig.findOneAndUpdate({ _id: req.params.id }, updateField)
    if (result.status === GigStatus.WAITING) {
      createNotification(
        null,
        'New Gig Create Or Update',
        `<p>Just a heads up, we've received a new gig ${gigUpdate?.name} created or updated.<a className="font-semibold text-blue-600" href="${process.env.URL_ADMIN}/gig-detail/${gigUpdate?._id}"> Learn more</a></p>`,
        NotificationType.ADMIN,
        next
      )
      if (user?.role.includes(UserRole.SELLER)) {
        createNotification(
          req.payload.userId,
          'Launch Your Gig Now!',
          `<p>Waiting for admin approval. Thanks for your patience! You can review gig.<a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/${user?.id}/gig-detail/review/${gigUpdate?._id}'> Learn more</a></p>`,
          NotificationType.USER,
          next
        )
      }
    }
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.SELLER) ? LogName.UPDATE_GIG : LogName.UPDATE_GIG_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })

    res.status(200).json({ gig: gigUpdate })
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
  const user = await findUser(req.payload.userId)
  try {
    const result = await gigStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as GigQuery
    if (status === GigStatus.BANNED && !result.reason) {
      throw httpError.NotAcceptable('There must be a reason for refusal.')
    }
    const updateField: any = { status, reason: result.reason }
    if (user?.role.includes(UserRole.SELLER)) {
      updateField.updatedCustomerAt = Date.now()
      updateField.updatedCustomerBy = req.params.id
    } else {
      updateField.updatedAdminAt = Date.now()
      updateField.updatedAdminBy = req.params.id
    }
    result.ids.forEach(async (id: string) => {
      const gigExist = await Gig.findOne({ _id: id })
      await Gig.updateOne({ _id: id }, updateField).populate('createdBy')
      if (
        (user?.role.includes(UserRole.ADMIN) || user?.role.includes(UserRole.MANAGER)) &&
        (status === GigStatus.ACTIVE || status === GigStatus.BANNED)
      ) {
        const title = 'Exciting News: Your Freelancer Gig Has Been Updated!'
        const content =
          "<p>Hello,</p><p>We're writing to inform you that the status of your gig on Freelancer has just been updated. Please check the latest status of your gig to ensure that all information is accurate and reflects your skills and services correctly.</p><p>If you have any questions or need assistance, feel free to contact us through the help section or Freelancer's support email.</p><p>Thank you for working on Freelancer, and we wish you a great day!</p><p>Best regards,<br>[Your Name or Freelancer Support Team]</p>"
        await sendEmail(gigExist?.createdBy?.email as string, title, content, next)
        createNotification(
          gigExist?.createdBy?._id,
          'Your Freelancer Gig Has Been Updated!',
          `<p>Please check the latest status of your gig to ensure that all information is accurate and reflects your skills and services correctly. <a className="font-semibold text-blue-600" href='${process.env.URL_CLIENT}/${user?.id}/gig-detail/review/${gigExist?._id}'> Learn more</a></p>`,
          NotificationType.USER,
          next
        )
      }
    })
    logger({
      user: req.payload.userId,
      name: user?.role.includes(UserRole.SELLER) ? LogName.UPDATE_GIG : LogName.UPDATE_GIG_BY_ADMIN,
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
      const userExist = await User.findOne({ _id: gigExist?.createdBy?._id })
      if (userExist) {
        let arrIds = userExist.gigs.map((gig) => gig._id)
        arrIds = arrIds.filter((id) => id !== gigExist?._id)
        await User.updateOne({ _id: gigExist?.createdBy?._id }, { gigs: arrIds })
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

export async function getAllGigByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const apiFeature = new APIFeature(
      Gig.find({ createdBy: req.payload.userId, status: { $ne: GigStatus.DELETED } })
        .populate('category')
        .populate('createdBy')
        .populate('orders'),
      req.query
    )
      .search()
      .filter()
    let gigs: IGig[] = await apiFeature.query
    const filteredCount = gigs.length
    apiFeature.sorting().pagination()
    gigs = await apiFeature.query.clone()
    res.status(200).json({ gigs, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export async function getAllLandingGigByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const latestGigs = await Gig.find({
      status: GigStatus.ACTIVE
    })
      .populate('createdBy')
      .populate('orders')
      .populate('reviews')
      .sort({ createdAt: 'desc' })
      .limit(10)
    const user = await findUser(req.payload.userId)
    const likeGigs = await Gig.find({
      status: GigStatus.ACTIVE,
      category: {
        $in: user?.target
      }
    })
      .populate('createdBy')
      .populate('orders')
      .populate('reviews')
      .sort({ createdAt: 'desc' })
      .limit(10)
    const mostOrderedGig = await Order.aggregate([
      {
        $match: {
          status: OrderStatus.COMPLETE
        }
      },
      {
        $group: {
          _id: '$gig',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 1
      }
    ])

    let category: ICategory | null
    const mostOrderedGigId = mostOrderedGig.length > 0 ? mostOrderedGig[0]._id : null
    if (mostOrderedGigId) {
      const gigExist = await Gig.findOne({ _id: mostOrderedGigId })
      category = await Category.findOne({ _id: gigExist?.category })
    } else {
      const mostCategoriedGig = await Gig.aggregate([
        {
          $match: {
            status: GigStatus.ACTIVE
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 1
        }
      ])
      category = await Category.findOne({ _id: mostCategoriedGig[0]._id })
    }
    let popularGigs: Array<IGig> = []
    if (category) {
      popularGigs = await Gig.find({
        status: GigStatus.ACTIVE,
        category: category?._id
      })
        .populate('createdBy')
        .populate('category')
        .populate('orders')
        .populate('reviews')
        .sort({ createdAt: 'desc' })
        .limit(10)
    }
    res.status(200).json({
      latestGigs,
      likeGigs,
      popularGigs
    })
  } catch (error: any) {
    next(error)
  }
}

export async function getAllGig(req: Request, res: Response, next: NextFunction) {
  try {
    const { creator, categoryId, ...restQuery } = req.query as unknown as GigQuery
    const apiFeature = new APIFeature(
      Gig.find().populate('category').populate('orders').populate('reviews').populate('createdBy'),
      restQuery
    )
      .search()
      .filter()
    if (creator) {
      const regex = new RegExp(creator, 'i')
      const users = await User.find({ name: regex }, '_id')
      const userIds = users.map((user) => user._id)
      apiFeature.query.where({ createdBy: { $in: userIds } })
    }
    if (categoryId) {
      const categoryExist = await Category.findOne({ _id: categoryId })
      if (!categoryExist) throw httpError.NotFound('Category does not exist.')
      const categoryIds: string[] = []
      if (categoryExist.level === 3) {
        categoryIds.push(categoryExist._id)
      } else if (categoryExist.level === 2) {
        categoryExist.subCategories.forEach((category) => categoryIds.push(category._id))
      } else {
        const tempIds: string[] = []
        categoryExist.subCategories.forEach((category) => tempIds.push(category._id))
        const subCategories = await Category.find({ _id: { $in: tempIds } })
        subCategories.forEach((subCategory) => {
          subCategory.subCategories.forEach((category) => categoryIds.push(category._id))
        })
      }
      apiFeature.query.where({ category: { $in: categoryIds } })
    }
    let gigs: IGig[] = await apiFeature.query
      .populate('category')
      .populate('orders')
      .populate('reviews')
      .populate('createdBy')
      .exec()
    const filteredCount = gigs.length
    apiFeature.sorting().pagination()
    gigs = await apiFeature.query
      .clone()
      .populate('category')
      .populate('createdBy')
      .populate('orders')
      .populate('reviews')
      .exec()
    res.status(200).json({ gigs, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export async function getGigDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const queryField: any = {}
    if (req.params.id) {
      queryField._id = req.params.id
    } else {
      queryField.slug = req.params.slug
    }
    const gigExist = await Gig.findOne(queryField)
      .populate('createdBy')
      .populate('category')
      .populate('orders')
      .populate({
        path: 'reviews',
        populate: { path: 'reviewer' }
      })

    if (!gigExist) {
      throw httpError.NotFound('Gig does not exist.')
    }

    if (req.params.id) {
      const user = await findUser(req.payload.userId)
      if (
        user?.role.includes(UserRole.SELLER) &&
        gigExist &&
        gigExist.createdBy &&
        gigExist.createdBy._id.toString() !== req.payload.userId
      ) {
        throw httpError.Forbidden('Account has no permissions.')
      }
    }

    const ratings: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0
    let totalReviews = 0
    if (gigExist && gigExist.reviews) {
      gigExist.reviews.forEach((review) => {
        ratings[review?.rating]++
        totalRating += review.rating
      })

      totalReviews = gigExist.reviews.length
    }
    const averageRating = totalReviews ? totalRating / totalReviews : 0

    const percentagePerStar: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    if (totalReviews) {
      for (let i = 1; i <= 5; i++) {
        percentagePerStar[i] = (ratings[i] / totalReviews) * 100
      }
    }

    const parentCategory = await Category.find({ subCategories: gigExist.category?._id })
    const grandParentCategory = await Category.find({ subCategories: parentCategory[0]._id })
    const orders = await Order.find({ gig: gigExist._id }).populate('createdBy')

    res.status(200).json({
      gig: gigExist,
      orders,
      grandParentCategory: grandParentCategory[0],
      ratings: {
        ratings,
        totalReviews,
        averageRating,
        percentagePerStar
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function getAllGigFilter(req: Request, res: Response, next: NextFunction) {
  try {
    const { budget, time, sort, ...restQuery } = req.query as unknown as GigQuery
    const filter: any = {
      status: GigStatus.ACTIVE
    }
    if (budget) {
      filter['packages.0.price'] = { $lte: Number(budget) }
    }
    if (time) {
      filter['packages.0.deliveryTime'] = { $gte: 0, $lte: time }
    }

    let sortOption: any = {}
    switch (sort) {
      case SortFilter.BEST_SELLING:
        sortOption = { 'orders.length': -1 }
        break
      case SortFilter.LATEST:
        sortOption = { createdAt: -1 }
        break
      case SortFilter.PRICE_DESCENDING:
        sortOption = { 'packages.0.price': -1 }
        break
      case SortFilter.PRICE_ASCENDING:
        sortOption = { 'packages.0.price': 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }
    const apiFeature = new APIFeature(
      Gig.find(filter)
        .populate('category')
        .populate('orders')
        .populate('reviews')
        .populate('createdBy')
        .sort(sortOption),
      restQuery
    )
      .search()
      .filter()
    let gigs: IGig[] = await apiFeature.query
      .populate('category')
      .populate('orders')
      .populate('reviews')
      .populate('createdBy')
      .exec()
    const filteredCount = gigs.length
    apiFeature.sorting().pagination()
    gigs = await apiFeature.query
      .clone()
      .populate('category')
      .populate('createdBy')
      .populate('orders')
      .populate('reviews')
      .exec()
    res.status(200).json({ gigs, filteredCount })
  } catch (error: any) {
    next(error)
  }
}
