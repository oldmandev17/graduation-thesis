import mongoose from 'mongoose'
import { IUser } from './userModel'
import { IGig } from './gigModel'

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  BANNED = 'BANNED'
}

export interface IReview extends mongoose.Document {
  reviewText?: string
  rating: number
  status: ReviewStatus
  reviewer: IUser
  createdAt: Date
}

const reviewSchema: mongoose.Schema = new mongoose.Schema<IReview>({
  reviewText: {
    type: String
  },
  rating: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.ACTIVE
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Review: mongoose.Model<IReview> = mongoose.model<IReview>('review', reviewSchema)
export default Review
