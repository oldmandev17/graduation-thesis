import { User } from 'modules/user'

export interface AuthState {
  user?: User
  accessToken?: string | null
  redirect?: boolean
}
