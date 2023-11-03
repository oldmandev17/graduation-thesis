import { IUser } from './user'

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface IService {
  _id: string
  name: string
  image: string
  description: string
  level: number
  subServices: Array<IService>
  status: ServiceStatus
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}
