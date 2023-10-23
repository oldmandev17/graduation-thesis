import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AuthState, SignUpPayload, UpdateUserPayload } from './auth-types'

const initialState: AuthState = {
  user: undefined,
  accessToken: null,
  redirect: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authSignIn: (state) => ({
      ...state
    }),

    authSignUp: (state, action: PayloadAction<SignUpPayload>) => ({
      ...state,
      ...action.payload
    }),

    authUpdateUser: (state, action: PayloadAction<UpdateUserPayload>) => ({
      user: action.payload.user,
      accessToken: action.payload.accessToken
    }),

    authFetchMe: (state, action: PayloadAction<any>) => ({
      ...state,
      ...action.payload
    })
  }
})

export const { authSignIn, authSignUp, authUpdateUser, authFetchMe } = authSlice.actions

export default authSlice.reducer
