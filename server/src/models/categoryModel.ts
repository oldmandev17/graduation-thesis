import mongoose from 'mongoose'
import { IUser } from './userModel'

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface ICategory extends mongoose.Document {
  name: string
  image: string
  status: CategoryStatus
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}

const categorySchema: mongoose.Schema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(CategoryStatus),
    default: CategoryStatus.ACTIVE
  },
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

const Category: mongoose.Model<ICategory> = mongoose.model<ICategory>('category', categorySchema)
export default Category
