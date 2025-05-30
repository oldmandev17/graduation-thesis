/* eslint-disable import/no-cycle */
import { ICategory } from './category'
import { IGig } from './gig'
import { IOrder } from './order'

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  REQUEST_SELLER = 'REQUEST_SELLER',
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

export interface IUser {
  _id: string
  name: string
  birthday?: Date
  id?: string
  avatar?: string
  gender?: UserGender
  email: string
  phone?: string
  provider: UserProvider
  verify: boolean
  role: Array<UserRole>
  orders: Array<IOrder>
  gigs: Array<IGig>
  target: Array<ICategory>
  wishlist: Array<IGig>
  status: UserStatus
  language?: string
  description?: string
  occupation?: string
  skill?: string
  education?: string
  certification?: string
  createdAt: Date
  createdBy?: IUser
  updatedAt?: Date
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}
