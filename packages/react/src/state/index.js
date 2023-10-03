import { configureStore } from '@reduxjs/toolkit'

import user from './user/reducer'
import collection from './collection/reducer'
import space from './space/reducer'

const PERSISTED_KEYS = []

const store = configureStore({
  reducer: {
    user,
    collection,
    space,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
  // preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
  preloadedState: {},
})

export default store
