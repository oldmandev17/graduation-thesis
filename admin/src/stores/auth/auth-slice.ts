/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AuthState, ForgotPasswordPayload, LogInPayload, ResetPasswordPayload, UpdateUserPayload } from './auth-types'

const initialState: AuthState = {
  user: undefined,
  accessToken: null,
  redirect: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogIn: (state, action: PayloadAction<LogInPayload>) => ({
      ...state
    }),

    authUpdateUser: (state, action: PayloadAction<UpdateUserPayload>) => ({
      user: action.payload.user,
      accessToken: action.payload.accessToken
    }),

    authFetchMe: (state, action: PayloadAction<any>) => ({
      ...state,
      ...action.payload
    }),

    authForgotPassowrd: (state, action: PayloadAction<ForgotPasswordPayload>) => ({}),

    authResetPassword: (state, action: PayloadAction<ResetPasswordPayload>) => ({})
  }
})

export const { authLogIn, authUpdateUser, authFetchMe, authForgotPassowrd, authResetPassword } = authSlice.actions

export default authSlice.reducer
