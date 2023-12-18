import { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { existsSync, unlinkSync } from 'fs'
import httpError from 'http-errors'
import client from 'src/helpers/initRedis'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from 'src/middlewares/jwtHelper'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import Message from 'src/models/messageModel'
import { NotificationType } from 'src/models/notificationModel'
import User, { IUser, UserProvider, UserRole, UserStatus } from 'src/models/userModel'
import UserReset from 'src/models/userResetModel'
import UserVerification from 'src/models/userVerificationModel'
import APIFeature from 'src/utils/apiFeature'
import { findUser } from 'src/utils/findUser'
import { generateRandomPassword } from 'src/utils/generatePassword'
import { logger } from 'src/utils/logger'
import { createNotification } from 'src/utils/notification'
import { sendEmail, sendPasswordEmail, sendResetEmail, sendVerificationEmail } from 'src/utils/sendEmail'
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authRegisterSchema,
  authResetPasswordSchema,
  authSendMailSchema,
  userCreateSchema,
  userDeleteSchema,
  userStatusSchema,
  userUpdateSchema
} from 'src/utils/validationSchema'

interface UserQuery {
  status?: UserStatus
  reason?: string
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authRegisterSchema.validateAsync(req.body)
    const userExist = await User.find({
      email: result.email,
      provider: UserProvider.EMAIL
    })
    if (userExist.length > 0) {
      if (userExist[0].verify || (!userExist[0].verify && userExist[0].createdAt.getTime() + 21600000 < Date.now())) {
        throw httpError.Conflict()
      }
      if (!userExist[0].verify && userExist[0].createdAt.getTime() + 21600000 > Date.now()) {
        await User.deleteOne({ _id: userExist[0]._id })
      }
    }
    const id = String(result.name).replace(/ /g, '')
    const newUser = await User.create({
      name: result.name,
      email: result.email,
      password: result.password,
      provider: UserProvider.EMAIL,
      id: id.charAt(0).toLowerCase() + id.slice(1)
    })
    logger({
      user: newUser?._id,
      name: LogName.REGISTER_USER,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    await createNotification(
      null,
      'New Account Registration',
      `<p>Just a heads up, we've received a new account registration from Customer ${newUser.name}.<a className="font-semibold text-blue-600" href="${process.env.URL_ADMIN}/user-detail/${newUser?._id}"> Learn more</a></p>`,
      NotificationType.ADMIN,
      next
    )
    await sendVerificationEmail(newUser._id, newUser.email, res, next)
  } catch (error: any) {
    logger({
      name: LogName.REGISTER_USER,
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

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  const user = await findUser(req.params.userId)
  try {
    const { userId, verificationString } = req.params
    const userVerificationExist = await UserVerification.findOne({
      user: userId
    })
    if (!userVerificationExist) throw httpError.NotFound()
    if (userVerificationExist.isValidExpires()) {
      await User.deleteOne({
        _id: userId
      })
      throw httpError.NotAcceptable()
    } else {
      if (!userVerificationExist.isValidVerificationString(verificationString)) throw httpError.Unauthorized()
      await User.updateOne(
        {
          _id: userId
        },
        {
          role: [UserRole.BUYER],
          verify: true,
          updatedAt: Date.now()
        }
      )
      await UserVerification.deleteOne({
        user: userId
      })
      logger({
        user: user?._id,
        name: LogName.VERIFY_EMAIL_USER,
        method: LogMethod.GET,
        status: LogStatus.SUCCESS,
        url: req.originalUrl,
        errorMessage: '',
        content: ''
      })
      res.redirect(process.env.URL_CLIENT + '/login/' + user?.email + '/' + user?.password)
    }
  } catch (error: any) {
    logger({
      user: user?._id,
      name: LogName.VERIFY_EMAIL_USER,
      method: LogMethod.GET,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: ''
    })
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authLoginSchema.validateAsync(req.body)
    const userExist = await User.find({
      email: result.email,
      provider: UserProvider.EMAIL
    })
    if (!userExist.length) throw httpError.NotFound()
    if (!userExist[0].verify) throw httpError.BadRequest()
    if (userExist[0].status !== UserStatus.ACTIVE) throw httpError.NotAcceptable()
    const isMatch = await compare(result.password, userExist[0].password as string)
    if (!isMatch) throw httpError.Unauthorized()
    const accessToken = await signAccessToken(String(userExist[0]._id), userExist[0].role)
    const refreshToken = await signRefreshToken(String(userExist[0]._id))
    logger({
      user: userExist[0]?._id,
      name: LogName.LOGIN_USER,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ accessToken, refreshToken })
  } catch (error: any) {
    logger({
      name: LogName.LOGIN_USER,
      method: LogMethod.POST,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: req.body
    })
    if (error.isJoi === true) next(httpError.BadRequest())
    next(error)
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw httpError.BadRequest()
    const userId = (await verifyRefreshToken(refreshToken)) as string
    const userExist = await User.findOne({
      _id: userId
    })
    if (!userExist) throw httpError.NotFound()
    if (userExist.status !== UserStatus.ACTIVE) throw httpError.NotAcceptable()
    const accessToken = await signAccessToken(userId, userExist.role)
    const newRefreshToken = await signRefreshToken(userId)
    res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  } catch (error: any) {
    next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.params
  if (!refreshToken) throw httpError.BadRequest()
  const userId = (await verifyRefreshToken(refreshToken)) as string
  try {
    client.DEL(userId).catch((next: NextFunction) => next(httpError.InternalServerError()))
    logger({
      user: userId,
      name: LogName.LOGOUT_USER,
      method: LogMethod.DELETE,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: ''
    })
    res.sendStatus(204)
  } catch (error: any) {
    logger({
      user: userId,
      name: LogName.LOGOUT_USER,
      method: LogMethod.DELETE,
      status: LogStatus.ERROR,
      url: req.originalUrl,
      errorMessage: error.message,
      content: ''
    })
    next(error)
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userExist = await User.findOne({
      _id: req.payload.userId
    })
      .populate({ path: 'target' })
      .populate('wishlist')
      .populate({
        path: 'gigs',
        options: {
          sort: { createdAt: -1 }
        },
        populate: { path: 'category' }
      })
      .populate({
        path: 'orders',
        options: {
          sort: { createdAt: -1 }
        },
        populate: { path: 'gig' }
      })
    if (!userExist) throw httpError.NotFound()
    const messages = await Message.find({
      $or: [
        {
          sender: userExist._id
        },
        {
          reciever: userExist._id
        }
      ]
    })
      .populate('sender')
      .populate('receiver')
    const uniqueContactsSet = new Set()
    const uniqueContactsArray: any[] = []

    messages.forEach((message) => {
      if (message.sender && !uniqueContactsSet.has(message.sender._id)) {
        uniqueContactsSet.add(message.sender._id)
        uniqueContactsArray.push({
          _id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email,
          avatar: message.sender.avatar
        })
      }

      if (message.receiver && !uniqueContactsSet.has(message.receiver._id)) {
        uniqueContactsSet.add(message.receiver._id)
        uniqueContactsArray.push({
          _id: message.receiver._id,
          name: message.receiver.name,
          email: message.receiver.email,
          avatar: message.receiver.avatar
        })
      }
    })

    const usersGroupByInitialLetter: any = {}

    uniqueContactsArray.forEach((user: any) => {
      const initialLetter = user.name.charAt(0).toUpperCase()

      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = []
      }

      usersGroupByInitialLetter[initialLetter].push(user)
    })
    userExist.contacts = usersGroupByInitialLetter

    delete userExist?.password

    res.status(200).json({
      profile: userExist
    })
  } catch (error: any) {
    next(error)
  }
}

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userStatusSchema.validateAsync(req.body)
    const { status } = req.query as unknown as UserQuery
    result.forEach(async (id: string) => {
      await User.updateOne(
        { _id: id },
        {
          status,
          updatedAdminAt: Date.now(),
          updatedAdminBy: req.payload.userId
        }
      )
    })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_USER,
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
      name: LogName.UPDATE_USER,
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

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userCreateSchema.validateAsync(req.body)
    const randomPassword = generateRandomPassword(12)
    const userExist = await User.find({
      email: result.email,
      provider: UserProvider.EMAIL
    })
    if (userExist.length) throw httpError.Conflict()
    const newUser = await User.create({
      name: result.name,
      email: result.email,
      status: result.status,
      password: randomPassword,
      role: result.role,
      provider: UserProvider.EMAIL,
      createdBy: req.payload.userId
    })
    logger({
      user: newUser?._id,
      name: LogName.CREATE_USER,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    await sendPasswordEmail(newUser._id, newUser.email, randomPassword, res, next)
  } catch (error: any) {
    logger({
      name: LogName.CREATE_USER,
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

export async function deleteUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userDeleteSchema.validateAsync(req.body)
    result.forEach(async (id: string) => {
      await User.deleteOne({ _id: id })
    })
    logger({
      user: req.payload.userId,
      name: LogName.DELETE_USERS,
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
      name: LogName.DELETE_USERS,
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

export async function updateUser(req: any, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await userUpdateSchema.validateAsync(req.body)
    const user = await User.findOne({ _id: req.payload.userId })
    if (!user) throw httpError.NotFound()
    else {
      if (file) {
        if (existsSync(user?.avatar as string) && user.provider === UserProvider.EMAIL)
          unlinkSync(user?.avatar as string)
        result.avatar = file.path
      }
    }
    await User.updateOne(
      {
        _id: req.payload.userId
      },
      {
        ...result,
        updatedAt: Date.now()
      }
    )
    if (result.role && result.role.includes(UserRole.REQUEST_SELLER)) {
      await createNotification(
        user._id,
        'Account Request Seller',
        'Waiting for admin approval. Thanks for your patience!',
        NotificationType.USER,
        next
      )
      await createNotification(
        null,
        'Account Request Seller',
        `<p>Just a heads up, we've received a account request seller from Customer ${user.name}.<a className="font-semibold text-blue-600" href='${process.env.URL_ADMIN}/user-detail/${user._id}'> Learn more</a></p>`,
        NotificationType.ADMIN,
        next
      )
    }

    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_USER,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ user })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_USER,
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

export async function updateUserByAdmin(req: any, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const result = await userUpdateSchema.validateAsync(req.body)
    const userExist = await User.findOne({ _id: req.params.id })
    if (!userExist) throw httpError.NotFound()
    else {
      if (file) {
        if (existsSync(userExist?.avatar as string) && userExist.provider === UserProvider.EMAIL)
          unlinkSync(userExist?.avatar as string)
        result.avatar = file.path
      }
    }
    if (
      userExist.role.includes(UserRole.REQUEST_SELLER) &&
      !result.role.includes(UserRole.REQUEST_SELLER) &&
      !result.role.includes(UserRole.SELLER)
    ) {
      createNotification(
        userExist._id,
        'Your request become a Seller has been denied.',
        `<p>Because of reasons: "${result.reason}".<a className="font-semibold text-blue-600" href="${process.env.URL_CLIENT}/user-detail"> Learn more</a></p>`,
        NotificationType.USER,
        next
      )
      delete result.reason
    }
    if (userExist.role.includes(UserRole.REQUEST_SELLER) && result.role.includes(UserRole.SELLER)) {
      createNotification(
        userExist._id,
        'Your request to become a Seller has been approved',
        `<p>Congratulations on becoming a Seller. Let's start with my first gig.<a className="font-semibold text-blue-600" href="${process.env.URL_CLIENT}/user/${userExist?.id}/gig-create/overview"> Create now</a></p>`,
        NotificationType.USER,
        next
      )
    }
    await User.updateOne(
      {
        _id: req.params.id
      },
      {
        ...result,
        updatedAdminAt: Date.now(),
        updatedAdminBy: req.payload.userId
      }
    )
    const user = await User.findOne({ _id: req.payload.userId })
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_USER_BY_ADMIN,
      method: LogMethod.PUT,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.status(200).json({ user })
  } catch (error: any) {
    logger({
      user: req.payload.userId,
      name: LogName.UPDATE_USER_BY_ADMIN,
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

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authForgotPasswordSchema.validateAsync(req.body)
    const userExist = await User.findOne({ email: result.email })
    if (!userExist) throw httpError.NotFound()
    if (!userExist.verify) throw httpError.BadRequest()
    logger({
      user: userExist?._id,
      name: LogName.REQUEST_RESET_PASSWORD,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    await sendResetEmail(userExist?._id, userExist?.email, res, next)
  } catch (error: any) {
    logger({
      name: LogName.REQUEST_RESET_PASSWORD,
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

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authResetPasswordSchema.validateAsync(req.body)
    const userReset = await UserReset.findOne({ user: result.userId })
    if (!userReset) throw httpError.NotFound()
    if (!userReset.isValidExpires()) {
      await UserReset.deleteOne({ user: result.userId })
      throw httpError.NotAcceptable()
    } else {
      if (!userReset.isValidResetString(result.resetString)) throw httpError.Unauthorized()
      await User.updateOne({ _id: result.userId }, { password: result.password })
      await UserReset.deleteOne({ user: result.userId })
      logger({
        user: result.userId,
        name: LogName.RESET_PASSWORD,
        method: LogMethod.PUT,
        status: LogStatus.SUCCESS,
        url: req.originalUrl,
        errorMessage: '',
        content: req.body
      })
      const user = await User.findOne({ _id: result.userId })
      res.redirect(
        ([UserRole.ADMIN, UserRole.MANAGER].every((item) => user?.role.includes(item))
          ? process.env.URL_ADMIN
          : process.env.URL_CLIENT + '/login') as string
      )
    }
  } catch (error: any) {
    logger({
      user: req.body.userId,
      name: LogName.RESET_PASSWORD,
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

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiFeature = new APIFeature(
      User.find()
        .populate({ path: 'createdBy', select: '_id name email phone provider verify role status' })
        .populate({ path: 'updatedAdminBy', select: '_id name email phone provider verify role status' }),
      req.query
    )
      .search()
      .filter()
    let users: IUser[] = await apiFeature.query
    const filteredCount = users.length
    apiFeature.sorting().pagination()
    users = await apiFeature.query.clone()
    res.status(200).json({ users, filteredCount })
  } catch (error: any) {
    next(error)
  }
}

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userExist = await User.findOne({ _id: req.params.id })
      .populate({ path: 'createdBy', select: 'name email phone provider verify role status' })
      .populate({ path: 'updatedAdminBy', select: 'name email phone provider verify role status' })
      .populate({
        path: 'gigs',
        options: {
          sort: { createdAt: -1 }
        },
        populate: { path: 'category' }
      })
      .populate({
        path: 'orders',
        options: {
          sort: { createdAt: -1 }
        },
        populate: { path: 'gig' }
      })
    if (!userExist) throw httpError.NotFound()

    res.status(200).json({ user: userExist })
  } catch (error: any) {
    next(error)
  }
}

export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authSendMailSchema.validateAsync(req.body)
    const users = await User.find({
      _id: {
        $in: result.ids
      }
    })
    users.forEach(async (user) => {
      await sendEmail(user.email, result.title, result.content, next)
    })
    logger({
      user: req.body.userId,
      name: LogName.SEND_MAIL,
      method: LogMethod.POST,
      status: LogStatus.SUCCESS,
      url: req.originalUrl,
      errorMessage: '',
      content: req.body
    })
    res.sendStatus(200)
  } catch (error: any) {
    logger({
      user: req.body.userId,
      name: LogName.SEND_MAIL,
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
