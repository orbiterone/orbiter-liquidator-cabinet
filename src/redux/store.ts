import { configureStore } from '@reduxjs/toolkit'
import overviewSlice from './overview'
import userAssetsSlice from "./userAssets";
export const store = configureStore({
  reducer: {
    overviewReducer: overviewSlice,
    userAssetsReducer: userAssetsSlice
  },
})
