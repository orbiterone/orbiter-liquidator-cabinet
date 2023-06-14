import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface chainIdState {
  chain: {
    chainData: {
      chainName: string
      chainId: number
      nativeCurrency: {
        name: string
        decimals: number
        symbol: string
      }
      rpcUrls: string[]
      blockExplorerUrls: string[]
    }
  }
}

const initialState: chainIdState = {
  chain: {
    chainData: {
      chainName: '',
      chainId: 0,
      nativeCurrency: {
        name: '',
        decimals: 0,
        symbol: '',
      },
      rpcUrls: [],
      blockExplorerUrls: [],
    },
  },
}

export const appChainSlice = createSlice({
  name: 'appChain',
  initialState,
  reducers: {
    setAppChain: (state, action: PayloadAction<any>) => {
      state.chain = action.payload
    },
  },
})
export const { setAppChain } = appChainSlice.actions

export default appChainSlice.reducer
