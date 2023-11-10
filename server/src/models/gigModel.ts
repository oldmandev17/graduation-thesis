import mongoose from 'mongoose'
import { ICategory } from './categoryModel'
import { IOrder } from './orderModel'
import { IReview } from './reviewModel'
import { IUser } from './userModel'

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

export interface IGig extends mongoose.Document {
  name?: string
  slug?: string
  description?: string
  packages?: Array<Package>
  images?: Array<string>
  status?: GigStatus
  category?: ICategory
  reviews?: Array<IReview>
  orders?: Array<IOrder>
  FAQs?: Array<FAQ>
  createdAt?: Date
  createdBy?: IUser
  updatedCustomerAt?: Date
  updatedCustomerBy?: IUser
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}

const gigSchema: mongoose.Schema = new mongoose.Schema<IGig>({
  name: {
    type: String
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  packages: [
    {
      type: {
        type: String,
        enum: Object.values(GigPackageType)
      },
      name: {
        type: String
      },
      description: {
        type: String
      },
      revisions: {
        type: Number
      },
      features: [
        {
          name: {
            type: String
          },
          status: {
            type: Boolean
          }
        }
      ],
      deliveryTime: {
        type: Number
      },
      price: {
        type: Number
      }
    }
  ],
  FAQs: [
    {
      question: {
        type: String
      },
      answer: {
        type: String
      }
    }
  ],
  images: {
    type: [String]
  },
  status: {
    type: String,
    enum: Object.values(GigStatus),
    default: GigStatus.ACTIVE
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
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
    ref: 'user'
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
