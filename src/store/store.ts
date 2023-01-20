import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import systemReducer from './slices/systemSlice'

export const store = configureStore({
  reducer: {
    system: systemReducer,
    // здесь добавляем редюсеры, например userReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>
