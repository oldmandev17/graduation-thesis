import { Admin } from './admin'
import { Customer } from './customer'

export interface User {
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
  admin?: Admin
  customer?: Customer
  createdAt: Date
  createdBy?: Admin
  updatedAt?: Date
  updatedAdminAt?: Date
  updatedAdminBy?: Admin
}

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
