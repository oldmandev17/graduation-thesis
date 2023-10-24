import { User } from 'modules/user'

export interface AuthState {
  user?: User
  accessToken?: string | null
  redirect?: boolean
}

export interface LogInPayload {
  email: string
  password: string
}

export interface UpdateUserPayload {
  user?: User
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
