import { configureStore } from '@reduxjs/toolkit'
import overviewSlice from './overview'
import userAssetsSlice from './userAssets'
import tableParamsSlice from './tableParams'
import loadingSlice from './loading'
export const store = configureStore({
  reducer: {
    loadingReducer: loadingSlice,
    overviewReducer: overviewSlice,
    userAssetsReducer: userAssetsSlice,
    tableParamsReducer: tableParamsSlice,
  },
})
