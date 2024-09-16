import { createReducer, Reducer } from '@reduxjs/toolkit'

import { parseErrorFromResponse, StatusCode } from '_Home/common/utils'
import { SETTINGS_ACTION_TYPE } from './actions'

type SettingState = {
  errorMessage: string
  userTransaction: {
    userTransactions: IUserTransaction[]
    loading: boolean
  }
  loading: boolean // Used for all non-specific loading situations
  billing: null
  statusCode: number // Used for all non-specific loading situations, always run CLEAR_STATUS_CODE
}

const initialState: SettingState = {
  errorMessage: '',
  userTransaction: {
    loading: false,
    userTransactions: [],
  },
  billing: null,
  loading: false,
  statusCode: StatusCode.CLEARED,
}

export const settingsReducer: Reducer<SettingState> = createReducer(initialState, (settings) => {
  settings
    .addCase(SETTINGS_ACTION_TYPE.GET_USER_TRANSACTION_DONE, (state, action) => {
      state.userTransaction.loading = false
      state.userTransaction.userTransactions = action.payload.data
    })
    .addCase(SETTINGS_ACTION_TYPE.CLEAR_STATUS_CODE, (state, _) => {
      state.loading = true
      state.statusCode = StatusCode.CLEARED
    })
    .addCase(SETTINGS_ACTION_TYPE.CHANGE_PASSWORD_DONE, (state, action) => {
      state.loading = false
      state.statusCode = action.payload.statusCode
    })
})
