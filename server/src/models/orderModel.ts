import mongoose from 'mongoose'
import { IUser } from './userModel'
import { IGig } from './gigModel'
import { IMessage } from './messageModel'

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL'
}

export interface IOrder extends mongoose.Document {
  paymentIntent: string
  price: number
  code: string
  status: OrderStatus
  messages: Array<IMessage>
  gig: IGig
  createdAt: Date
  createdBy: IUser
  updatedCustomerAt?: Date
  updatedCustomerBy?: IUser
  updatedAdminAt?: Date
  updatedAdminBy?: IUser
}

const orderSchema: mongoose.Schema = new mongoose.Schema<IOrder>({
  paymentIntent: {
    type: String,
    unique: true,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message'
    }
  ],
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
