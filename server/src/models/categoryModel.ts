import mongoose from 'mongoose'
import { IGig } from './gigModel'
import { IUser } from './userModel'

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export interface ICategory extends mongoose.Document {
  name: string
  description: string
  image: string
  status: CategoryStatus
  level: number
  slug: string
  subCategories: Array<ICategory>
  gigs: Array<IGig>
  createdAt: Date
  createdBy: IUser
  updatedAt?: Date
  updatedBy?: IUser
}

const serviceSchema: mongoose.Schema = new mongoose.Schema<ICategory>({
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
    enum: Object.values(CategoryStatus),
    default: CategoryStatus.ACTIVE
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
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category'
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

const Category: mongoose.Model<ICategory> = mongoose.model<ICategory>('category', serviceSchema)
export default Category
