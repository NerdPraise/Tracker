import { createReducer } from '@reduxjs/toolkit'

import { BUDGET_ACTION_TYPES } from './actions'

const initialBudgetState = {
  transactions: [],
  totalSpent: 0,
  loading: false,
  Budget: 0,
  monthlyIncome: 0,
}

const intialCategoryState = {
  categories: [],
  statusCode: 0,
}

export const budgetReducer = createReducer(initialBudgetState, (budget) => {
  budget
    .addCase(BUDGET_ACTION_TYPES.GET_CURRENT_MONTH_TRANSACTION_START, (state, action) => {
      state.loading = true
    })
    .addCase(BUDGET_ACTION_TYPES.GET_CURRENT_MONTH_TRANSACTION_DONE, (state, action) => {
      state.transactions = action.payload.track.transactions
      state.loading = false
      state.errorMessage = action.payload.errorMessage || ''
      state.monthlyIncome = action.payload.track.monthlyIncome
      state.Budget = action.payload.track.Budget
      state.totalSpent = action.payload.track.totalSpent
    })
})

export const categoryReducer = createReducer(intialCategoryState, (budget) => {
  budget
    .addCase(BUDGET_ACTION_TYPES.CREATE_USER_CATEGORY_START, (state, _) => {
      state.statusCode = 0
    })
    .addCase(BUDGET_ACTION_TYPES.CREATE_USER_CATEGORY_DONE, (state, action) => {
      state.statusCode = action.payload.statusCode
      state.errorMessage = action.payload.errorMessage || ''
      state.categories.push(action.payload.category)
    })
    .addCase(BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_START, (state, _) => {
      state.statusCode = 0
      state.loading = false
    })
    .addCase(BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_DONE, (state, action) => {
      state.statusCode = action.payload.statusCode
      state.loading = false
      state.categories = action.payload.categories
      state.errorMessage = action.payload.errorMessage || ''
    })
})
