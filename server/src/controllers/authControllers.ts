import { PrismaClient } from '@prisma/client'
import bcrypt, { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import client from 'src/helpers/initRedis'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from 'src/middlewares/jwtHelper'
import { sendVerificationEmail } from 'src/utils/sendEmail'
import { authLoginSchema, authRegisterSchema } from 'src/utils/validationSchema'

// Register
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // Validation register input
    const result = await authRegisterSchema.validateAsync(req.body)
    const prisma = new PrismaClient()
    const saltRounds = 10
    const hashedPassword = (await bcrypt.hash(result.password, saltRounds)) as string
    // Find user exist
    const userExist = await prisma.user.findMany({
      where: {
        email: result.email,
        provider: 'email'
      }
    })
    // Check user exist
    if (userExist.length !== 0) throw httpError.Conflict(`${result.email} is already been registered.`)
    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: result.name,
        email: result.email,
        password: hashedPassword,
        provider: 'email'
      }
    })
    // Send verication email
    await sendVerificationEmail(newUser.id, newUser.email, res, next)
  } catch (error: any) {
    // Return error
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}
// Verify email
export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    // Get value from req.params
    const { userId, verificationString } = req.params
    const prisma = new PrismaClient()
    // Find user verification exist
    const userVerificationExist = await prisma.userVerification.findUnique({
      where: {
        userId: userId
      }
    })
    // Check user verification exist
    if (!userVerificationExist) throw httpError.NotFound('User not exist or verified already.')
    // Get value from user verification
    const { expiresAt, verificationString: hashedverificationString } = userVerificationExist
    // Convert date ro number
    const expires: any = new Date(expiresAt)
    // Compare expires time and current time
    if (expires < Date.now()) {
      // Delete user by userId
      await prisma.user.delete({
        where: {
          id: userId
        }
      })
      // Return error
      throw httpError.NotAcceptable('User verifycation is expired.')
    } else {
      // Compare bcrypt string
      const isMatch = await bcrypt.compare(verificationString, hashedverificationString)
      // Check bcrypt string
      if (!isMatch) throw httpError.Unauthorized('Username/password not exist')
      // Update verified user equal true
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          verify: true,
          role: ['buyer'],
          updatedAt: new Date()
        }
      })
      // Detele user verification by userId
      await prisma.userVerification.delete({
        where: {
          userId: userId
        }
      })
      // Return response
      res.status(200).send('Verify successful')
    }
  } catch (error: any) {
    // Return error
    next(error)
  }
}
// Login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // Validation login input
    const result = await authLoginSchema.validateAsync(req.body)
    const prisma = new PrismaClient()
    // Find user exist
    const userExist = await prisma.user.findMany({
      where: {
        email: result.email,
        provider: 'email'
      }
    })
    // Check user exist
    if (userExist.length === 0) throw httpError.NotFound('User not registerd')
    // Check verified user
    if (!userExist[0]?.verify) throw httpError.BadRequest("Email hasn't been verified yet. Check your inbox.")
    // Compare password
    const isMatch = await compare(result.password, userExist[0]?.password as string)
    // Check password
    if (!isMatch) throw httpError.Unauthorized('Username/password not valid')
    // Sign access and refresh token
    const accessToken = await signAccessToken(String(userExist[0]?.id), userExist[0]?.role)
    const refreshToken = await signRefreshToken(String(userExist[0]?.id))
    // Return response
    res.status(200).json({ accessToken, refreshToken })
  } catch (error: any) {
    // Return error
    if (error.isJoi === true) next(httpError.BadRequest('Invalid Username/Password'))
    next(error)
  }
}
// Refresh token
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Get refresh token from req.body
    const { refreshToken } = req.body
    // Check refresh token exist
    if (!refreshToken) throw httpError.BadRequest()
    // Get userId from refresh token
    const userId = (await verifyRefreshToken(refreshToken)) as string
    const prisma = new PrismaClient()
    // Find user exist
    const userExist = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    // Check user exist
    if (!userExist) throw httpError.NotFound()
    // Sign access and refresh token
    const accessToken = await signAccessToken(userId, userExist.role)
    const newRefreshToken = await signRefreshToken(userId)
    // Retrun response include access and refresh token
    res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  } catch (error) {
    // Return error
    next(error)
  }
}
// Logout
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Get refresh from req.params
    const { refreshToken } = req.params
    // Check refresh token exist
    if (!refreshToken) throw httpError.BadRequest()
    // Get userId from refresh token
    const userId = (await verifyRefreshToken(refreshToken)) as string
    // Delete refresh token from redis cluter by userId
    client.DEL(userId).catch((next: any) => next(httpError.InternalServerError()))
    // Return response
    res.sendStatus(204)
  } catch (error: any) {
    // Return error
    next(error)
  }
}
// Get profile
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const prisma = new PrismaClient()
    // Find user exist
    const userExist = await prisma.user.findUnique({
      where: {
        id: req.payload.userId
      }
    })
    // Check user exist
    if (!userExist) throw httpError.NotFound('User does not exist.')
    // Return response
    res.status(200).json({
      profile: userExist
    })
  } catch (error: any) {
    // Return error
    next(error)
  }
}
