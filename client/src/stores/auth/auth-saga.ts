import { takeLatest } from 'redux-saga/effects'
import {
  handleAuthForgotPassword,
  handleAuthLogIn,
  handleAuthLogInGoolge,
  handleAuthLogout,
  handleAuthRefreshToken,
  handleAuthResetPassword,
  handleAuthSignUp
} from './auth-handlers'
import {
  authForgotPassowrd,
  authLogIn,
  authLogInGoogle,
  authLogout,
  authRefreshToken,
  authResetPassword,
  authSignUp
} from './auth-slice'

export default function* authSaga() {
  yield takeLatest(authSignUp.type, handleAuthSignUp)
  yield takeLatest(authLogIn.type, handleAuthLogIn)
  yield takeLatest(authLogInGoogle.type, handleAuthLogInGoolge)
  yield takeLatest(authForgotPassowrd.type, handleAuthForgotPassword)
  yield takeLatest(authResetPassword.type, handleAuthResetPassword)
  yield takeLatest(authLogout.type, handleAuthLogout)
  yield takeLatest(authRefreshToken.type, handleAuthRefreshToken)
}
