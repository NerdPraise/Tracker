import { createReducer } from '@reduxjs/toolkit'

import { MONEY_ACTION_TYPES } from './actions'

type ITransaction = {
  source: 'credit' | 'debit'
  description: string
  amount: number
  category: {
    name: string
    isOwner: boolean
  }
  isWalletTransaction: boolean
  createdAt: string
  uuid: string
}

type DashboardState = {
  errorMessage: string
  transaction: {
    loading: boolean
    transactions: ITransaction[]
  }
  category: {
    loading: boolean
    categories?: []
  }
}

const initialState: DashboardState = {
  errorMessage: '',
  transaction: {
    loading: false,
    transactions: [],
  },
  category: {
    loading: false,
    categories: [],
  },
}

export const moneyTrackReducer = createReducer(initialState, (track) => {
  track
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_START, (state, action) => {
      state.transaction.loading = true
    })
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_DONE, (state, action) => {
      state.transaction.loading = false
      state.transaction.transactions = action.payload.track
      state.errorMessage = action.payload.errorMessage || ''
    })
  // .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_START, (state, action) => {
  //   state.categoriesLoading = true
  // })
  // .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_DONE, (state, action) => {
  //   state.track = action.payload.categories
  //   state.categoriesLoading = false
  //   state.errorMessage = action.payload.errorMessage || ''
  // })
})
