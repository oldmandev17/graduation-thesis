import { User } from 'modules/user'

export interface AuthState {
  user?: User
  accessToken?: string | null
  redirect?: boolean
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface UpdateUserPayload {
  user?: User
  accessToken?: string | null
}
