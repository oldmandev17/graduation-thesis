/* eslint-disable import/no-cycle */
import { IGig } from './gig'
import { IUser } from './user'
import { IMessage } from './message'

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL'
}

export interface IOrder {
  _id: string
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
