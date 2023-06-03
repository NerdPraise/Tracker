import { createReducer } from '@reduxjs/toolkit'

import { LOGIN_ACTION_TYPES, USER_ACTION_TYPES } from '_Home/modules/Login/redux/actions'
import { SIGN_UP_ACTION_TYPES } from '_Home/modules/SignUp/redux/actions'

const userInitialState = {
  isLoggedIn: false,
  user: {
    status: 0,
    username: '',
  },
  isCheckingLoginStatus: false,
  loading: false,
  errorMessage: '',
}

export const userReducer = createReducer(userInitialState, (user) => {
  user
    .addCase(LOGIN_ACTION_TYPES.LOGIN_START, (state, action) => {
      state.loading = true
      state.status = 0
    })
    .addCase(LOGIN_ACTION_TYPES.LOGIN_DONE, (state, action) => {
      state.loading = false
      state.errorMessage = action.payload.errorMessage
      state.isLoggedIn = action.payload.status === 200 ? true : false
    })
    .addCase(USER_ACTION_TYPES.GET_USER_DETAILS_START, (state, action) => {
      state.isCheckingLoginStatus = true
    })
    .addCase(USER_ACTION_TYPES.GET_USER_DETAILS_DONE, (state, action) => {
      state.isLoggedIn = action.payload.user ? true : false
      state.isCheckingLoginStatus = false
      state.user = action.payload.user
      state.errorMessage = action.payload.errorMessage
    })
    .addCase(SIGN_UP_ACTION_TYPES.SIGNUP_START, (state, action) => {
      state.loading = true
      state.status = 0
    })
    .addCase(SIGN_UP_ACTION_TYPES.SIGNUP_DONE, (state, action) => {
      state.loading = false
      state.errorMessage = action.payload.errorMessage
      state.isLoggedIn = action.payload.status === 201 ? true : false
      state.user = action.payload.data?.user
    })
})
