import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import mongoose from 'mongoose'
import { IGig } from './gigModel'
import { IOrder } from './orderModel'

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  NONE = 'NONE'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum UserProvider {
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL'
}

export interface IUser extends mongoose.Document {
  name: string
  birthday?: Date
  id?: string
  avatar?: string
  gender?: UserGender
  email: string
  phone?: string
  password?: string
  provider: UserProvider
  verify: boolean
  role: Array<UserRole>
  gigs: Array<IGig>
  orders: Array<IOrder>
  status: UserStatus
  createdAt: Date
  createdBy?: IUser
  updatedAt?: Date
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date
  },
  id: {
    type: String
  },
  avatar: {
    type: String
  },
  gender: {
    type: String,
    enum: Object.values(UserGender)
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  provider: {
    type: String,
    enum: Object.values(UserProvider),
    default: UserProvider.EMAIL
  },
  verify: {
    type: Boolean,
    default: false
  },
  role: {
    type: [String],
    enum: Object.values(UserRole),
    default: [UserRole.NONE]
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  updatedAt: {
    type: Date
  },
  updatedAdminAt: {
    type: Date
  },
  updatedAdminBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    await bcrypt.hash(this.password as string, salt).then((result) => (this.password = result))
    next()
  } catch (error: any) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (password: string, next: NextFunction) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error: any) {
    next(error)
  }
}

const User: mongoose.Model<IUser> = mongoose.model<IUser>('user', userSchema)
export default User
