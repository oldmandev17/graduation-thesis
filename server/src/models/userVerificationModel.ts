import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import mongoose from 'mongoose'
import { IUser } from './userModel'

export interface IUserVerification extends mongoose.Document {
  user: IUser
  verificationString: string
  createdAt: Date
  expiresAt: Date
  isValidVerificationString: any
  isValidExpires: any
}

const userVerificationSchema: mongoose.Schema = new mongoose.Schema<IUserVerification>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  verificationString: {
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

userVerificationSchema.methods.isValidVerificationString = async function (verificationString: string, next: any) {
  try {
    return await bcrypt.compare(verificationString, this.verificationString)
  } catch (error: any) {
    next(error)
  }
}

userVerificationSchema.methods.isValidExpires = function (next: NextFunction) {
  try {
    return new Date(this.expires) <= new Date()
  } catch (error: any) {
    next(error)
  }
}

const UserVerification: mongoose.Model<IUserVerification> = mongoose.model<IUserVerification>(
  'userVerification',
  userVerificationSchema
)
export default UserVerification
