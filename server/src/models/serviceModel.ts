import mongoose from 'mongoose'
import { IUser } from './userModel'

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface IService extends mongoose.Document {
  name: string
  description: string
  image: string
  status: ServiceStatus
  level: number
  slug: string
  subServices: Array<IService>
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}

const serviceSchema: mongoose.Schema = new mongoose.Schema<IService>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ServiceStatus),
    default: ServiceStatus.ACTIVE
  },
  level: {
    type: Number,
    default: 1
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  subServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Service: mongoose.Model<IService> = mongoose.model<IService>('service', serviceSchema)
export default Service
