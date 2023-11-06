import mongoose from 'mongoose'
import { IOrder } from './orderModel'
import { IReview } from './reviewModel'
import { IService } from './serviceModel'
import { IUser } from './userModel'

export enum GigStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
  WAITING = 'WAITING'
}

export interface IGig extends mongoose.Document {
  name: string
  slug: string
  description: string
  deliveryTime: number
  revisions: number
  features: Array<string>
  price: number
  shortDesc: string
  images: Array<string>
  status: GigStatus
  service: IService
  reviews: Array<IReview>
  orders: Array<IOrder>
  createdAt: Date
  createdBy: IUser
  updatedCustomerAt?: Date
  updatedCustomerBy?: IUser
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}

const gigSchema: mongoose.Schema = new mongoose.Schema<IGig>({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  deliveryTime: {
    type: Number,
    required: true
  },
  revisions: {
    type: Number,
    required: true
  },
  features: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  shortDesc: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: Object.values(GigStatus),
    default: GigStatus.ACTIVE
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review'
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order'
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
  updatedCustomerAt: {
    type: Date
  },
  updatedCustomerBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  updatedAdminAt: {
    type: Date
  },
  updatedAdminBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Gig: mongoose.Model<IGig> = mongoose.model<IGig>('gig', gigSchema)
export default Gig
