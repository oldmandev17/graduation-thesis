import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import mongoose from 'mongoose'
import { IUser } from './userModel'

export interface IUserReset extends mongoose.Document {
  user: IUser
  resetString: string
  createdAt: Date
  expiresAt: Date
  isValidResetString: any
  isValidExpires: any
}

const userResetSchema: mongoose.Schema = new mongoose.Schema<IUserReset>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  resetString: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

userResetSchema.methods.isValidResetString = async function (resetString: string, next: any) {
  try {
    return await bcrypt.compare(resetString, this.resetString)
  } catch (error: any) {
    next(error)
  }
}

userResetSchema.methods.isValidExpires = function (next: NextFunction) {
  try {
    return new Date(this.expires) <= new Date()
  } catch (error: any) {
    next(error)
  }
}

const UserReset: mongoose.Model<IUserReset> = mongoose.model<IUserReset>('userReset', userResetSchema)
export default UserReset
