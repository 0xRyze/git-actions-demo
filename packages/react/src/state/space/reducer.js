import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  balance: 0,
}

const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    updateSpaceBalance(state, action) {
      state.balance = Number(action.payload)
    },
  },
})

export const { updateSpaceBalance } = spaceSlice.actions

export default spaceSlice.reducer
