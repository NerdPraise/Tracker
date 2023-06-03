import { createReducer } from '@reduxjs/toolkit'

import { MONEY_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
  errorMessage: '',
  track: {},
  categories: [],
  categoriesLoading: false,
}

export const moneyTrackReducer = createReducer(initialState, (track) => {
  track
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_START, (state, action) => {
      state.loading = true
    })
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_DONE, (state, action) => {
      state.track = action.payload.track
      state.loading = false
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_START, (state, action) => {
      state.categoriesLoading = true
    })
    .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_DONE, (state, action) => {
      state.track = action.payload.categories
      state.categoriesLoading = false
      state.errorMessage = action.payload.errorMessage || ''
    })
})
