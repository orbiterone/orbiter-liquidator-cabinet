import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface assetState {
  supplied: [
    {
      key: ''
      symbol: ''
      address: ''
      supplied: ''
    }
  ]
  borrowed: [
    {
      key: ''
      symbol: ''
      address: ''
      borrowed: ''
    }
  ]
}

const initialState: assetState = {
  supplied: [
    {
      key: '',
      symbol: '',
      address: '',
      supplied: '',
    },
  ],
  borrowed: [
    {
      key: '',
      symbol: '',
      address: '',
      borrowed: '',
    },
  ],
}

export const userAssetsSlice = createSlice({
  name: 'userAssets',
  initialState,
  reducers: {
    setUserAssets: (state, action: PayloadAction<any>) => {
      state.supplied = action.payload.supplied.map((item) => {
        return {
          key: item.token._id,
          symbol: item.token.symbol,
          address: item.token.tokenAddress,
          supplied: item.value,
          suppliedUSD: item.token.lastPrice * item.value,
          item,
        }
      })
      state.borrowed = action.payload.borrowed.map((item) => {
        return {
          key: item.token._id,
          symbol: item.token.symbol,
          address: item.token.tokenAddress,
          borrowed: item.value,
          borrowedUSD: item.token.lastPrice * item.value,
          item,
        }
      })
    },
  },
})

export const { setUserAssets } = userAssetsSlice.actions

export default userAssetsSlice.reducer
