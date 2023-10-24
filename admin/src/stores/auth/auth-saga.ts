import { takeLatest } from 'redux-saga/effects'
import { authForgotPassowrd, authLogIn, authResetPassword } from './auth-slice'
import { handleAuthForgotPassword, handleAuthLogIn, handleAuthResetPassword } from './auth-handlers'

export default function* authSaga() {
  yield takeLatest(authLogIn.type, handleAuthLogIn)
  yield takeLatest(authForgotPassowrd.type, handleAuthForgotPassword)
  yield takeLatest(authResetPassword.type, handleAuthResetPassword)
}
