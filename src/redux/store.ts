import { configureStore } from '@reduxjs/toolkit'
import overviewSlice from './overview'
export const store = configureStore({
  reducer: {
    overviewReducer: overviewSlice,
  },
})
