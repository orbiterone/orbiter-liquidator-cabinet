import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface tableParams {
  tableParams: {
    current: number
    pageSize: number
  }
}

const initialState: tableParams = {
  tableParams: {
    current: 1,
    pageSize: 10,
  },
}

export const tableParamsSlice = createSlice({
  name: 'tableParams',
  initialState,
  reducers: {
    setTableParams: (state, action: PayloadAction<any>) => {
      state.tableParams = action.payload
    },
  },
})

export const { setTableParams } = tableParamsSlice.actions

export default tableParamsSlice.reducer
