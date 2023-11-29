/* eslint-disable import/no-cycle */
import { IUser } from './user'

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  BANNED = 'BANNED'
}

export interface IReview {
  _id: string
  reviewText?: string
  rating: number
  status: ReviewStatus
  reviewer: IUser
  createdAt: Date
}
