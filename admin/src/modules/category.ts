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
  status: CategoryStatus
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}
