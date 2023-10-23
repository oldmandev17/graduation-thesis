import { call, put } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { saveToken } from 'utils/auth'
import { requestAuthFetchMe, requestAuthSignIn, requestAuthSignUp } from './auth-requests'
import { SignInPayload, SignUpPayload } from './auth-types'
import { authUpdateUser } from './auth-slice'

function* handleAuthSignUp({ payload }: { payload: SignUpPayload; type: string }): Generator<any, void, any> {
  try {
    const response = yield call(requestAuthSignUp, payload)
    if (response.status === 201) toast.success('Please check your email')
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

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

function* handleAuthSignIn({ payload }: { payload: SignInPayload; type: string }): Generator<any, void, any> {
  try {
    const response = yield call(requestAuthSignIn, payload)
    if (response.data.accessToken && response.data.refreshToken) {
      saveToken(response.data.accessToken, response.data.refreshToken)
      yield call(handleAuthFetchMe, { payload: response.data.accessToken })
    }
  } catch (error: any) {
    toast.error(error.response.data.error.message)
  }
}

export { handleAuthSignUp, handleAuthSignIn }
