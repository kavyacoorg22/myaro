import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice/userSlice'
import userLocation from './LocationSlice/locationSlice'
export const AppStore=configureStore({
  reducer:{
   user:userReducer,
   location:userLocation
  }
})

export type RootState=ReturnType<typeof AppStore.getState>
export type AppDispatch=typeof AppStore.dispatch