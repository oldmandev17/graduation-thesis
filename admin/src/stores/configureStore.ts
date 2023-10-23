import createSagaMiddleware from '@redux-saga/core'
import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/auth-slice'
import rootSaga from './rootSaga'

const reducer = combineReducers({
  auth: authReducer
})

const sagaMiddleWare = createSagaMiddleware()
export const store = configureStore({
  reducer,
  middleware: (gDM) => gDM().concat(sagaMiddleWare)
  // middleware: (gDM) => gDM().concat(logger, sagaMiddleWare),
})

sagaMiddleWare.run(rootSaga)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
