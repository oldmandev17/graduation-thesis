import mongoose from 'mongoose'
import { IAdmin } from './adminModel'
import { ICategory } from './categoryModel'
import { ICustomer } from './customerModel'
import { IOrder } from './orderModel'
import { IReview } from './reviewModel'

export enum GigStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  BANNED = 'BANNED'
}

export interface IGig extends mongoose.Document {
  name: string
  description: string
  deliveryTime: number
  revisions: number
  features: Array<string>
  price: number
  shortDesc: string
  images: Array<string>
  status: GigStatus
  category: ICategory
  reviews: Array<IReview>
  orders: Array<IOrder>
  createdAt: Date
  createdBy: ICustomer
  updatedCustomerAt?: Date
  updatedCustomerBy?: ICustomer
  updatedAdminAt?: Date
  updatedAdminBy?: IAdmin
}

const gigSchema: mongoose.Schema = new mongoose.Schema<IGig>({
  name: {
    type: String,
    required: true
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
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
    ref: 'customer',
    required: true
  },
  updatedCustomerAt: {
    type: Date
  },
  updatedCustomerBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer'
  },
  updatedAdminAt: {
    type: Date
  },
  updatedAdminBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  }
})

const Gig: mongoose.Model<IGig> = mongoose.model<IGig>('gig', gigSchema)
export default Gig
