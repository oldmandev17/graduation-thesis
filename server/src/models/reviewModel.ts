import mongoose from 'mongoose'
import { ICustomer } from './customerModel'
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
  reviewer: ICustomer
  gig: IGig
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
    ref: 'customer',
    required: true
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'gig',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Review: mongoose.Model<IReview> = mongoose.model<IReview>('review', reviewSchema)
export default Review
