import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from './auth-types'

const initialState: AuthState = {
  user: undefined,
  accessToken: null,
  redirect: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
})

export const {} = authSlice.actions

export default authSlice.reducer
