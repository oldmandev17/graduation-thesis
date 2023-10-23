import mongoose from 'mongoose'
import { IAdmin } from './adminModel'
import { ICustomer } from './customerModel'
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
  status: OrderStatus
  messages: Array<IMessage>
  gig: IGig
  createdAt: Date
  createdBy: ICustomer
  updatedCustomerAt?: Date
  updatedCustomerBy?: ICustomer
  updatedAdminAt?: Date
  updatedAdminBy?: IAdmin
}

const orderSchema: mongoose.Schema = new mongoose.Schema<IOrder>({
  paymentIntent: {
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

const Order: mongoose.Model<IOrder> = mongoose.model<IOrder>('order', orderSchema)
export default Order
