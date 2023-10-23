import { takeLatest } from 'redux-saga/effects'
import { authSignIn, authSignUp } from './auth-slice'
import { handleAuthSignIn, handleAuthSignUp } from './auth-handlers'

export default function* authSaga() {
  yield takeLatest(authSignUp.type, handleAuthSignUp)
  yield takeLatest(authSignIn.type, handleAuthSignIn)
}
