import { camelize, snakify } from '_Home/common/utils'
import { AuthenticatedAPI } from '_Home/store/api'

export const SETTINGS_ACTION_TYPE = {
  SAVE_USER_DETAIL_DONE: 'SETTINGS_ACTION_TYPE/SAVE_USER_DETAIL/DONE',
  GET_USER_TRANSACTION_DONE: 'SETTINGS_ACTION_TYPE/GET_USER_TRANSACTION/DONE',
  CHANGE_PASSWORD_START: 'SETTINGS_ACTION_TYPE/CHANGE_PASSWORD/START',
  CHANGE_PASSWORD_DONE: 'SETTINGS_ACTION_TYPE/CHANGE_PASSWORD/DONE',
  CLEAR_STATUS_CODE: 'SETTINGS_ACTION_TYPE/CLEAR_STATUS_CODE/DONE',
  UPDATE_TRANSACTION_DONE: 'SETTINGS_ACTION_TYPE/UPDATE_TRANSACTION/DONE',
}

export const saveUserDetails =
  (data: Partial<Record<keyof IUser, string>>, isUser?: boolean) => (dispatch) => {
    let updatedData
    if (isUser) {
      updatedData = { user: data }
    } else {
      updatedData = data
    }
    updatedData = JSON.stringify(snakify(updatedData))

    AuthenticatedAPI.patch(`me/`, updatedData)
      .then((response) => {
        dispatch({
          type: SETTINGS_ACTION_TYPE.SAVE_USER_DETAIL_DONE,
          payload: {
            data: camelize(response.data),
          },
        })
      })
      .catch((err) =>
        dispatch({
          type: SETTINGS_ACTION_TYPE.SAVE_USER_DETAIL_DONE,
          payload: {
            errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
          },
        }),
      )
  }

export const getUserTransactions = () => (dispatch) => {
  dispatch({
    type: SETTINGS_ACTION_TYPE.CLEAR_STATUS_CODE,
  })
  AuthenticatedAPI.get(`transactions/get_user_transaction/`)
    .then((response) => {
      dispatch({
        type: SETTINGS_ACTION_TYPE.GET_USER_TRANSACTION_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: SETTINGS_ACTION_TYPE.GET_USER_TRANSACTION_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const changePasswordAction = (data: FormData) => (dispatch) => {
  dispatch({
    type: SETTINGS_ACTION_TYPE.CLEAR_STATUS_CODE,
  })

  AuthenticatedAPI.put(`me/change_password/`, data)
    .then((response) => {
      dispatch({
        type: SETTINGS_ACTION_TYPE.CHANGE_PASSWORD_DONE,
        payload: {
          statusCode: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: SETTINGS_ACTION_TYPE.CHANGE_PASSWORD_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const updateTransaction = (data: object) => (dispatch) => {
  dispatch({
    type: SETTINGS_ACTION_TYPE.CLEAR_STATUS_CODE,
  })
  AuthenticatedAPI.post(`transactions/update_user_payment/`, data)
    .then((response) => {
      dispatch({
        type: SETTINGS_ACTION_TYPE.UPDATE_TRANSACTION_DONE,
        payload: {
          statusCode: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: SETTINGS_ACTION_TYPE.UPDATE_TRANSACTION_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}
