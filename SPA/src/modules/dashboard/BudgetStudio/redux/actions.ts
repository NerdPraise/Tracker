import { toCamel, toSnake } from 'snake-camel'

import { AuthenticatedAPI } from '_Home/store/api'
import { parseErrorFromResponse, camelize } from '_Home/common/utils'

export const BUDGET_ACTION_TYPES = {
  GET_CURRENT_MONTH_TRANSACTION_START: 'BUDGET_ACTION_TYPES/GET_CURRENT_MONTH_TRANSACTION/START',
  GET_CURRENT_MONTH_TRANSACTION_DONE: 'BUDGET_ACTION_TYPES/GET_CURRENT_MONTH_TRANSACTION/DONE',
  GET_ALL_CATEGORIES_START: 'BUDGET_ACTION_TYPES/GET_ALL_CATEGORIES/START',
  GET_ALL_CATEGORIES_DONE: 'BUDGET_ACTION_TYPES/GET_ALL_CATEGORIES/DONE',
  CREATE_USER_CATEGORY_START: 'BUDGET_ACTION_TYPES/CREATE_USER_CATEGORY/START',
  CREATE_USER_CATEGORY_DONE: 'BUDGET_ACTION_TYPES/CREATE_USER_CATEGORY/DONE',
}

export const getCurrentMonthTransaction = () => (dispatch) => {
  dispatch({ type: BUDGET_ACTION_TYPES.GET_CURRENT_MONTH_TRANSACTION_START })

  AuthenticatedAPI.get('wallet/track-transact/')
    .then((response) => {
      const { data } = response.data

      dispatch({
        type: BUDGET_ACTION_TYPES.GET_CURRENT_MONTH_TRANSACTION_DONE,
        payload: {
          track: camelize(data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: BUDGET_ACTION_TYPES.GET_CURRENT_MONTH_TRANSACTION_DONE,
        payload: {
          track: {},
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getAllCategories = () => (dispatch) => {
  dispatch({
    type: BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_START,
  })

  AuthenticatedAPI.get('categories/')
    .then((response) => {
      const data = response.data

      dispatch({
        type: BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_DONE,
        payload: {
          categories: camelize(data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_DONE,
        payload: {
          categories: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const createUserCategory = (values) => (dispatch) => {
  dispatch({
    type: BUDGET_ACTION_TYPES.CREATE_USER_CATEGORY_START,
  })

  AuthenticatedAPI.post('categories/', JSON.stringify(toSnake(values)))
    .then((response) => {
      const { data } = response.data

      dispatch({
        type: BUDGET_ACTION_TYPES.CREATE_USER_CATEGORY_DONE,
        payload: {
          statusCode: response.status,
          category: data,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: BUDGET_ACTION_TYPES.GET_ALL_CATEGORIES_DONE,
        payload: {
          statusCode: err.response.status,
          errorMessage: err.response
            ? parseErrorFromResponse(err.response.data)
            : 'Something terrible occurred',
        },
      }),
    )
}
