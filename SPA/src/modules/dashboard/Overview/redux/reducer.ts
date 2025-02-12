import { createReducer, Reducer } from '@reduxjs/toolkit'
import { StatusCode } from '_Home/common/utils'
import { MONEY_ACTION_TYPES, OVERVIEW_ACTION_TYPES } from './actions'

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
  overview: {
    loading: boolean
    data: {
      invoiceStats: {
        total: number
        draft: number
        pending: number
        paid: number
      }
      financialStats: {
        totalRevenue: number
        pendingRevenue: number
        averageInvoiceValue: number
      }
      clientStats: {
        totalClients: number
        activeClients: number
      }
      recentActivity: {
        invoicesSent: number
        invoicesPaid: number
        newClients: number
      }
      currency: string
    } | null
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
  overview: {
    loading: false,
    data: null,
  },
}

export const moneyTrackReducer = createReducer(initialState, (track) => {
  track
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_START, (state) => {
      state.transaction.loading = true
    })
    .addCase(MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_DONE, (state, action) => {
      state.transaction.loading = false
      state.transaction.transactions = action.payload.track
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_START, (state) => {
      state.category.loading = true
    })
    .addCase(MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_DONE, (state, action) => {
      state.category.categories = action.payload.categories
      state.category.loading = false
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(OVERVIEW_ACTION_TYPES.GET_OVERVIEW_START, (state) => {
      state.overview.loading = true
    })
    .addCase(OVERVIEW_ACTION_TYPES.GET_OVERVIEW_DONE, (state, action) => {
      state.overview.loading = false
      state.overview.data = action.payload.data
      state.errorMessage = action.payload.errorMessage || ''
    })
})
