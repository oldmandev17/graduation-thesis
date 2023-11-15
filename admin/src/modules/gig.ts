/* eslint-disable import/no-cycle */
import { IUser } from './user'
import { ICategory } from './category'
import { IOrder } from './order'
import { IReview } from './review'

export enum GigStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
  WAITING = 'WAITING'
}

export enum GigPackageType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export interface Feature {
  name?: string
  status?: boolean
}

export interface Package {
  type?: GigPackageType
  name?: string
  description?: string
  revisions?: number
  features?: Array<Feature>
  deliveryTime?: number
  price?: number
}

export interface FAQ {
  question?: string
  answer?: string
}

export interface IGig {
  _id: string
  name?: string
  slug?: string
  description?: string
  packages?: Array<Package>
  images?: Array<string>
  status?: GigStatus
  reason?: string
  category?: ICategory
  reviews?: Array<IReview>
  orders?: Array<IOrder>
  FAQs?: Array<FAQ>
  createdAt: Date
  createdBy?: IUser
  updatedCustomerAt?: Date
  updatedCustomerBy?: IUser
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}
