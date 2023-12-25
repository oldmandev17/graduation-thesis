import { IUser } from 'modules/user'

export interface AuthState {
  user?: IUser
  accessToken?: string | null
  redirect?: boolean
}

export interface LogInPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LogInGooglePayload {
  accessToken: string
  refreshToken: string
}

export interface UpdateUserPayload {
  user?: IUser
  accessToken?: string | null
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  userId: string
  resetString: string
  password: String
  confirmPassword: string
}
