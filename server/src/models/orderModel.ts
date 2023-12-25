import mongoose from 'mongoose'
import { GigPackageType, IGig } from './gigModel'
import { IUser } from './userModel'

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  ACCEPT = 'ACCEPT',
  SELLER_COMFIRM = 'SELLER_COMFIRM',
  BUYER_COMFIRM = 'BUYER_COMFIRM',
  ADMIN_COMFIRM = 'ADMIN_CONFIRM'
}

export enum OrderMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface IOrder extends mongoose.Document {
  paymentID: string
  method: OrderMethod
  price: number
  quantity: number
  dueOn: Date
  name: string
  status: OrderStatus
  gig: IGig
  type: GigPackageType
  createdAt: Date
  createdBy: IUser
  reason: string
  updatedCustomerAt?: Date
  updatedCustomerBy?: IUser
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}

const orderSchema: mongoose.Schema = new mongoose.Schema<IOrder>({
  paymentID: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: Object.values(OrderMethod)
  },
  type: {
    type: String,
    enum: Object.values(GigPackageType)
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  dueOn: {
    type: Date,
    required: true
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'gig',
    required: true
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

const Order: mongoose.Model<IOrder> = mongoose.model<IOrder>('order', orderSchema)
export default Order
