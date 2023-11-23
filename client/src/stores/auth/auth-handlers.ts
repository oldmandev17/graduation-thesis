import { toast } from 'react-toastify'
import { call, put } from 'redux-saga/effects'
import { logout, saveToken } from 'utils/auth'
import {
  requestAuthFetchMe,
  requestAuthLogIn,
  requestAuthLogout,
  requestAuthRefreshToken,
  requestForgotPassword,
  requestResetPassword
} from './auth-requests'
import { authUpdateUser } from './auth-slice'
import { ForgotPasswordPayload, LogInPayload, ResetPasswordPayload } from './auth-types'

function* handleAuthFetchMe({ payload }: { payload: string }): Generator<any, void, any> {
  try {
    const response = yield call(requestAuthFetchMe, payload)
    if (response.data)
      yield put(
        authUpdateUser({
          user: response.data.profile,
          accessToken: payload
        })
      )
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

function* handleAuthLogIn({ payload }: { payload: LogInPayload; type: string }): Generator<any, void, any> {
  try {
    const response = yield call(requestAuthLogIn, payload)
    if (response.data.accessToken && response.data.refreshToken) {
      saveToken(response.data.accessToken, response.data.refreshToken)
      yield call(handleAuthFetchMe, { payload: response.data.accessToken })
    }
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

function* handleAuthForgotPassword({
  payload
}: {
  payload: ForgotPasswordPayload
  type: string
}): Generator<any, void, any> {
  try {
    const response = yield call(requestForgotPassword, payload)
    if (response.status === 200) toast.success('Please check your email')
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

function* handleAuthLogout({ payload }: { payload: string; type: any }): Generator<any, void, any> {
  try {
    logout()
    yield put(
      authUpdateUser({
        user: undefined,
        accessToken: null
      })
    )
    yield call(requestAuthLogout, payload)
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

function* handleAuthRefreshToken({ payload }: { payload: string; type: string }): Generator<any, void, any> {
  try {
    const response = yield call(requestAuthRefreshToken, payload)
    if (response.status === 200) {
      saveToken(response.data.accessToken, response.data.refreshToken)
      yield call(handleAuthFetchMe, { payload: response.data.accessToken })
    } else {
      yield handleAuthLogout({
        payload: response.data.accessToken,
        type: null
      })
    }
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

function* handleAuthResetPassword({
  payload
}: {
  payload: ResetPasswordPayload
  type: string
}): Generator<any, void, any> {
  try {
    const response = yield call(requestResetPassword, payload)
    if (response.status === 200) {
      toast.success('Reset password successfully')
    }
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

export {
  handleAuthFetchMe,
  handleAuthForgotPassword,
  handleAuthLogIn,
  handleAuthLogout,
  handleAuthRefreshToken,
  handleAuthResetPassword
}
