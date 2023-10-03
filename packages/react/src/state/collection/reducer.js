import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  selectedCollectionId: null,
  showMint: false,
  collectionViewOpen: false,
  selectedSpaceId: false,
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateSelectedCollectionId(state, { payload: { id } }) {
      state.selectedCollectionId = id
    },
    updateShowMint(state, { payload: { showMint } }) {
      state.showMint = showMint
    },
    updateCollectionViewOpen(state, { payload: { collectionViewOpen } }) {
      state.collectionViewOpen = collectionViewOpen
    },
    updateSelectedSpaceId(state, { payload: { id } }) {
      state.selectedSpaceId = id
    },
  },
})

export const { updateSelectedCollectionId, updateShowMint, updateCollectionViewOpen, updateSelectedSpaceId } =
  collectionSlice.actions

export default collectionSlice.reducer
