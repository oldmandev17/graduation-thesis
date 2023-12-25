/* eslint-disable import/no-cycle */
import { GigPackageType, IGig } from './gig'
import { IUser } from './user'

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

export interface IOrder {
  _id: string
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
