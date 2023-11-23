import { takeLatest } from 'redux-saga/effects'
import {
  handleAuthForgotPassword,
  handleAuthLogIn,
  handleAuthLogout,
  handleAuthRefreshToken,
  handleAuthResetPassword
} from './auth-handlers'
import { authForgotPassowrd, authLogIn, authLogout, authRefreshToken, authResetPassword } from './auth-slice'

export default function* authSaga() {
  yield takeLatest(authLogIn.type, handleAuthLogIn)
  yield takeLatest(authForgotPassowrd.type, handleAuthForgotPassword)
  yield takeLatest(authResetPassword.type, handleAuthResetPassword)
  yield takeLatest(authLogout.type, handleAuthLogout)
  yield takeLatest(authRefreshToken.type, handleAuthRefreshToken)
}
