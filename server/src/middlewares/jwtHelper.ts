import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import * as JWT from 'jsonwebtoken'
import client from 'src/helpers/initRedis'

interface MyPayload extends JWT.JwtPayload {
  userId?: string
  role?: string[]
}

// Sign access token by jsonwebtoken
export function signAccessToken(userId: string, role: string[]) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise((resolve, reject) => {
    // Payload jwt
    const payload: MyPayload = {
      userId,
      role
    }
    //  Option jwt
    const options = {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    // Sign token by payload, secret key and options
    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, options, (err: any, token: any) => {
      if (err) return reject(httpError.InternalServerError())

      // Return access token
      resolve(token)
    })
  })
}
// Verify access token
export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  // Check req.headers['authorization] exist
  if (!req.headers['authorization']) return next(httpError.Unauthorized())
  // Get access token from header
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]
  // Verify access token by secret key
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, payload: any) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(httpError.Forbidden(message))
    }
    // Return req.payload = payload access token = userId
    req.payload = payload

    next()
  })
}
// Authorize user
export function authorizeRoles(...roles: Array<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Find user by req.payload.userId
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
      where: {
        id: req.payload.userId
      }
    })
    // Check user exist and role
    if (user)
      if (!roles.includes(String(user.role))) {
        return next(httpError.Unauthorized(`Role ${user.role} is not allow to access this resource.`))
      }

    next()
  }
}
// Sign refresh token by jsonwebtoken
export function signRefreshToken(userId: string) {
  return new Promise((resolve, reject) => {
    // Payload jwt
    const payload = {}
    // Option jwt
    const options = {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    // Sign token by payload, secret key and options
    JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, options, async (err: any, token: any) => {
      if (err) return reject(httpError.InternalServerError())
      // Save refresh token to redis cluter with key userId
      await client.SET(userId, token, { EX: 365 * 24 * 60 * 60 }).catch((reject: any) => {
        reject(httpError.InternalServerError())
      })
      // Return refresh token
      resolve(token)
    })
  })
}
// Verify refresh token
export function verifyRefreshToken(refreshToken: string) {
  return new Promise((resolve, reject) => {
    // Verify refresh token by secret key
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, payload: any) => {
      if (err) return reject(httpError.Unauthorized())
      // Get userId from payload.aud refresh token
      const userId = payload.aud
      // Get refresh token from redis cluter by userId
      await client
        .GET(userId)
        .then((result) => {
          // Return userId if refresh token from input equal refresh token from redis cluter
          if (refreshToken === result) return resolve(userId)
          // Return unauthorized if not equal
          reject(httpError.Unauthorized())
        })
        .catch((reject: any) => reject(httpError.InternalServerError()))
      // Return userId
      resolve(userId)
    })
  })
}
