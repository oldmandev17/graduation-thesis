/* eslint-disable import/no-cycle */
import { IGig } from './gig'
import { IUser } from './user'

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface ICategory {
  _id: string
  name: string
  description: string
  image: string
  status: CategoryStatus
  level: number
  slug: string
  subCategories: Array<ICategory>
  features: Array<string>
  gigs: Array<IGig>
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}
