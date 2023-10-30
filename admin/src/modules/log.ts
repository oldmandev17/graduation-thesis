import { IUser } from './user'

export enum LogName {
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  CREATE_USER = 'CREATE_USER',
  REGISTER_USER = 'REGISTER_USER',
  REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  LOGIN_USER = 'LOGIN_USER',
  LOGOUT_USER = 'LOGOUT_USER',
  VERIFY_EMAIL_USER = 'VERIFY_EMAIL_USER',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  UPDATE_CATEGORY_STATUS = 'UPDATE_CATEGORY_STATUS',
  UPDATE_USER = 'UPDATE_CATEGORY',
  UPDATE_USER_BY_ADMIN = 'UPDATE_USER_BY_ADMIN',
  DELETE_LOGS = 'DELETE_LOGS',
  DELETE_USERS = 'DETETE_USERS',
  DELETE_CATEGORIES = 'DELETE_CATEGORIES'
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

export interface ILog {
  _id: string
  user?: IUser
  name: LogName
  method: LogMethod
  status: LogStatus
  url: string
  errorMessage?: string
  content?: JSON
  createdAt: Date
}
