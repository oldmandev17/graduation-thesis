import mongoose from 'mongoose'
import { IUser } from './userModel'

export enum LogName {
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  CREATE_USER = 'CREATE_USER',
  CREATE_GIG = 'CREATE_GIG',
  CREATE_ORDER = 'CREATE_ORDER',
  CREATE_REVIEW = 'CREATE_REVIEW',
  REGISTER_USER = 'REGISTER_USER',
  REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  LOGIN_USER = 'LOGIN_USER',
  LOGOUT_USER = 'LOGOUT_USER',
  VERIFY_EMAIL_USER = 'VERIFY_EMAIL_USER',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_BY_ADMIN = 'UPDATE_USER_BY_ADMIN',
  UPDATE_GIG_BY_ADMIN = 'UPDATE_GIG_BY_ADMIN',
  UPDATE_GIG = 'UPDATE_GIG',
  UPDATE_ORDER = 'UPDATE_ORDER',
  UPDATE_ORDER_BY_ADMIN = 'UPDATE_ORDER_BY_ADMIN',
  DELETE_LOGS = 'DELETE_LOGS',
  DELETE_USERS = 'DETETE_USERS',
  DELETE_CATEGORIES = 'DELETE_CATEGORIES',
  DELETE_GIG = 'DELETE_GIG',
  DELETE_ORDER = 'DELETE_ORDER',
  SEND_MAIL = 'SEND_MAIL'
}

export enum LogStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum LogMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface ILog extends mongoose.Document {
  user?: IUser
  name: LogName
  method: LogMethod
  status: LogStatus
  url: string
  errorMessage?: string
  content?: object
  createdAt: Date
}

const logSchema: mongoose.Schema = new mongoose.Schema<ILog>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    enum: Object.values(LogName),
    required: true
  },
  method: {
    type: String,
    enum: Object.values(LogMethod),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(LogStatus),
    required: true
  },
  url: {
    type: String,
    required: true
  },
  errorMessage: {
    type: String
  },
  content: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Log: mongoose.Model<ILog> = mongoose.model<ILog>('log', logSchema)
export default Log
