import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { FilterValue } from 'antd/es/table/interface'

export interface tableParams {
  tableParams: {
    current: number
    pageSize: number
    sortField?: string
    sortOrder?: string
    filters?: Record<string, FilterValue>
  }
}

const initialState: tableParams = {
  tableParams: {
    current: 1,
    pageSize: 10,
    sortField: undefined,
    sortOrder: undefined,
    filters: undefined,
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
