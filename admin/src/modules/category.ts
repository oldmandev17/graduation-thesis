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
  image: string
  description: string
  level: number
  subCategories: Array<ICategory>
  gigs: Array<IGig>
  features: Array<string>
  status: CategoryStatus
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}
