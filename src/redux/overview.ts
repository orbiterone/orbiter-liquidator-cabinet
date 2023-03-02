import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface overview {
  overview: {
    page: number
    pages: number
    countItems: number
    entities: [
      {
        address: string
        totalSupplyUSD: string
        totalBorrowUSD: string
        health: string
      }
    ]
  }
}

const initialState: overview = {
  overview: {
    page: 0,
    pages: 0,
    countItems: 0,
    entities: [
      {
        address: '',
        totalSupplyUSD: '',
        totalBorrowUSD: '',
        health: '',
      },
    ],
  },
}

export const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<any>) => {
      state.overview = action.payload
    },
  },
})
export const { setOverview } = overviewSlice.actions

export default overviewSlice.reducer
