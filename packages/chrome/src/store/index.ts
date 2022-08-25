import { configureStore } from '@reduxjs/toolkit'
import appContextReducer from './app-context'

export const store = configureStore({
  reducer: {
    appContext: appContextReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;