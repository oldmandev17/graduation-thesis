import { IAdmin } from './admin'
import { ICustomer } from './customer'

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

export interface IUser {
  _id: string
  name: string
  birthday?: Date
  avatar?: string
  gender?: UserGender
  email: string
  phone?: string
  provider: UserProvider
  verify: boolean
  role: Array<UserRole>
  status: UserStatus
  admin?: IAdmin
  customer?: ICustomer
  createdAt: Date
  createdBy?: IAdmin
  updatedAt?: Date
  updatedAdminAt?: Date
  updatedAdminBy?: IAdmin
}
