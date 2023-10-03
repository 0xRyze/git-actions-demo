import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  showLaunchpad: false,
}

const launchpadSlice = createSlice({
  name: 'launchpad',
  initialState,
  reducers: {
    updateShowLaunchpad(state, { payload: { showLaunchpad } }) {
      state.showLaunchpad = showLaunchpad
    },
  },
})

export const { updateShowLaunchpad } = launchpadSlice.actions

export default launchpadSlice.reducer
