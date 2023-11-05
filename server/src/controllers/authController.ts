import { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import client from 'src/helpers/initRedis'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from 'src/middlewares/jwtHelper'
import { LogMethod, LogName, LogStatus } from 'src/models/logModel'
import User, { IUser, UserProvider, UserRole } from 'src/models/userModel'
import UserReset from 'src/models/userResetModel'
import UserVerification from 'src/models/userVerificationModel'
import APIFeature from 'src/utils/apiFeature'
import { findUser } from 'src/utils/findUser'
import { generateRandomPassword } from 'src/utils/generatePassword'
import { logger } from 'src/utils/logger'
import { sendPasswordEmail, sendResetEmail, sendVerificationEmail } from 'src/utils/sendEmail'
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authRegisterSchema,
  authResetPasswordSchema,
  userCreateSchema,
  userDeleteSchema,
  userUpdateSchema
} from 'src/utils/validationSchema'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authRegisterSchema.validateAsync(req.body)
    const userExist = await User.find({
      email: result.email,
      provider: UserProvider.EMAIL
    })
    if (userExist.length) throw httpError.Conflict()
    const newUser = await User.create({
      name: result.name,
      email: result.email,
      password: result.password,
      provider: UserProvider.EMAIL
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
    if (error.isJoi === true) next(httpError.BadRequest('Invalid Username/Password'))
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
    if (!userExist) throw httpError.NotFound()

    delete userExist?.password

    res.status(200).json({
      profile: userExist
    })
  } catch (error: any) {
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
      password: randomPassword,
      role: [UserRole.MANAGER],
      provider: UserProvider.EMAIL
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
    res.status(204).send()
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
    next(error)
  }
}

export async function updateUser(req: any, res: Response, next: NextFunction) {
  try {
    const result = await userUpdateSchema.validateAsync(req.body)
    result.avatar = req.files.find((file: any) => file.fieldname === 'avatar')?.path
    await User.updateOne(
      {
        _id: req.payload.userId
      },
      {
        ...result,
        updatedAt: Date.now()
      }
    )
    const user = await User.findOne({ _id: req.payload.userId })
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
    next(error)
  }
}

export async function updateUserByAdmin(req: any, res: Response, next: NextFunction) {
  try {
    const result = await userUpdateSchema.validateAsync(req.body)
    result.avatar = req.files.find((file: any) => file.fieldname === 'avatar')?.path
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
