import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  selectedWallet: undefined,
  selectedSolanaWallet: undefined,
  accessKey: null,
  details: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
    },
    updateSolanaSelectedWallet(state, { payload: { wallet } }) {
      state.selectedSolanaWallet = wallet
    },
    updateAccessKey(state, { payload: { accessKey } }) {
      state.accessKey = accessKey
    },
    updateUserDetails(state, { payload: { details } }) {
      state.details = details
    },
  },
})

export const { updateSelectedWallet, updateSolanaSelectedWallet, updateAccessKey, updateUserDetails } =
  userSlice.actions

export default userSlice.reducer
