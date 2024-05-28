import { AuthenticatedAPI } from '_Home/store/api'

export const MONEY_ACTION_TYPES = {
  GET_MONTHLY_TRANSACTION: 'MONEY_ACTION_TYPES/GET_MONTHLY_TRANSACTION',
  GET_ALL_TRANSACTION_START: 'MONEY_ACTION_TYPES/GET_ALL_TRANSACTION/START',
  GET_ALL_TRANSACTION_DONE: 'MONEY_ACTION_TYPES/GET_ALL_TRANSACTION/DONE',
  GET_TRANSACTION_BY_CATEGORY_START: 'MONEY_ACTION_TYPES/GET_TRANSACTION_BY_CATEGORY/START',
  GET_TRANSACTION_BY_CATEGORY_DONE: 'MONEY_ACTION_TYPES/GET_TRANSACTION_BY_CATEGORY/DONE',
}

export const getTransactions = (date) => (dispatch) => {
  dispatch({ type: MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_START })

  AuthenticatedAPI.get(`month-track/all-transactions/?month=${date}`)
    .then((response) => {
      const { data } = response.data
      dispatch({
        type: MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_DONE,
        payload: {
          track: data,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: MONEY_ACTION_TYPES.GET_ALL_TRANSACTION_DONE,
        payload: {
          track: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getTransactionReportByCategory = (date) => (dispatch) => {
  dispatch({ type: MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_START })

  AuthenticatedAPI.get(`wallet/report/categories/?month=${date}`)
    .then((response) => {
      const { data } = response.data
      dispatch({
        type: MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_DONE,
        payload: {
          categories: data,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: MONEY_ACTION_TYPES.GET_TRANSACTION_BY_CATEGORY_DONE,
        payload: {
          categories: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}
