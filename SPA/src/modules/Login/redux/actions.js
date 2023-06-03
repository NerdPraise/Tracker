import { API } from '_Home/store/config'

export const LOGIN_ACTION_TYPES = {
  LOGIN_START: 'LOGIN_ACTION_TYPES/LOGIN_START',
  LOGIN_DONE: 'LOGIN_ACTION_TYPES/LOGIN_DONE',
}

export const USER_ACTION_TYPES = {
  GET_USER_DETAILS_START: 'USER_ACTION_TYPES/GET_USER_DETAILS/START',
  GET_USER_DETAILS_DONE: 'USER_ACTION_TYPES/GET_USER_DETAILS/DONE',
}

export const loginAction = (loginData) => (dispatch) => {
  dispatch({ type: LOGIN_ACTION_TYPES.LOGIN_START })

  API.post('token/', loginData)
    .then((response) => {
      const { access, refresh } = response.data
      localStorage.setItem('ACCESS_TOKEN_KEY', access)
      localStorage.setItem('REFRESH_TOKEN_KEY', refresh)

      dispatch({
        type: LOGIN_ACTION_TYPES.LOGIN_DONE,
        payload: {
          status: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: LOGIN_ACTION_TYPES.LOGIN_DONE,
        payload: {
          status: err.response ? err.response.status : 400,
          errorMessage: err.response ? err.response.data.detail : 'Something terrible happened',
        },
      }),
    )
}

export const getUserAction = () => (dispatch) => {
  dispatch({ type: USER_ACTION_TYPES.GET_USER_DETAILS_START })

  API.get('me/')
    .then((response) => {
      dispatch({
        type: USER_ACTION_TYPES.GET_USER_DETAILS_DONE,
        payload: {
          user: response.data['data'],
        },
      })
    })
    .catch((err) => {
      dispatch({
        type: USER_ACTION_TYPES.GET_USER_DETAILS_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.detail : 'Something terrible happened',
        },
      })
    })
}
