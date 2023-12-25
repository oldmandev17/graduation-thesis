import { NextFunction, Request, Response } from 'express'
import httpError from 'http-errors'
import * as JWT from 'jsonwebtoken'
import client from 'src/helpers/initRedis'
import User, { UserRole } from 'src/models/userModel'
import { MESSAGE_FORBIDDEN, MESSAGE_INTERNALSERVERERROR, MESSAGE_UNAUTHORIZED } from 'src/utils/message'

interface MyPayload extends JWT.JwtPayload {
  userId?: string
  role?: string[]
}

export function signAccessToken(userId: string, role: string[]) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise((resolve, reject) => {
    const payload: MyPayload = {
      userId,
      role
    }
    const options = {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, options, (err: any, token: any) => {
      if (err) return reject(httpError.InternalServerError(MESSAGE_INTERNALSERVERERROR))
      resolve(token)
    })
  })
}

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers['authorization']) return next(httpError.Unauthorized(MESSAGE_UNAUTHORIZED))
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, payload: any) => {
    if (err) {
      return next(httpError.Forbidden(MESSAGE_FORBIDDEN))
    }
    req.payload = payload
    next()
  })
}
export function authorizeRoles(roles: Array<UserRole>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userExist = await User.findOne({
      _id: req.payload.userId
    })
    if (userExist)
      if (roles.every((item) => !userExist.role.includes(item))) {
        return next(httpError.Unauthorized(MESSAGE_UNAUTHORIZED))
      }
    next()
  }
}

export function signRefreshToken(userId: string) {
  return new Promise((resolve, reject) => {
    const payload = {}
    const options = {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
      issuer: process.env.JWT_ISS,
      audience: userId
    }
    JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, options, async (err: any, token: any) => {
      if (err) return reject(httpError.InternalServerError(MESSAGE_INTERNALSERVERERROR))
      await client.SET(userId, token, { EX: 365 * 24 * 60 * 60 }).catch((reject: any) => {
        reject(httpError.InternalServerError(MESSAGE_INTERNALSERVERERROR))
      })
      resolve(token)
    })
  })
}

export function verifyRefreshToken(refreshToken: string) {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, payload: any) => {
      if (err) return reject(httpError.Unauthorized(MESSAGE_UNAUTHORIZED))
      const userId = payload.aud
      await client
        .GET(userId)
        .then((result) => {
          if (refreshToken === result) return resolve(userId)
          reject(httpError.Unauthorized(MESSAGE_UNAUTHORIZED))
        })
        .catch((reject: any) => reject(httpError.InternalServerError(MESSAGE_INTERNALSERVERERROR)))
      resolve(userId)
    })
  })
}
