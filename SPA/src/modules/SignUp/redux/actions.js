import { API } from '_Home/store/config'

export const SIGN_UP_ACTION_TYPES = {
  SIGNUP_START: 'SIGN_UP_ACTION_TYPES/SIGNUP_START',
  SIGNUP_DONE: 'SIGN_UP_ACTION_TYPES/SIGNUP_DONE',
}

export const signUpAction = (signUpData) => (dispatch) => {
  dispatch({ type: SIGN_UP_ACTION_TYPES.SIGNUP_START })

  API.post('accounts/register/', signUpData)
    .then((response) => {
      const data = response.data['data']
      const { access, refresh } = data
      localStorage.setItem('ACCESS_TOKEN_KEY', access)
      localStorage.setItem('REFRESH_TOKEN_KEY', refresh)

      dispatch({
        type: SIGN_UP_ACTION_TYPES.SIGNUP_DONE,
        payload: {
          data: data,
          status: response.status,
        },
      })
    })
    .catch((err) => {
      dispatch({
        type: SIGN_UP_ACTION_TYPES.SIGNUP_DONE,
        payload: {
          status: err.response ? err.response.status : 400,
          errorMessage: err.response ? err.response.data.detail : 'Something terrible happened',
        },
      })
    })
}
