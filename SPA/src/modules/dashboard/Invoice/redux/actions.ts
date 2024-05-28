import { camelize, snakify } from '_Home/common/utils'
import { AuthenticatedAPI } from '_Home/store/api'

export const INVOICE_ACTION_TYPE = {
  GET_ALL_INVOICES_START: 'INVOICE_ACTION_TYPE/GET_ALL_INVOICES/START',
  GET_ALL_INVOICES_DONE: 'INVOICE_ACTION_TYPE/GET_ALL_INVOICES/DONE',
  GET_SINGLE_INVOICE_START: 'INVOICE_ACTION_TYPE/GET_SINGLE_INVOICE/START',
  GET_SINGLE_INVOICE_DONE: 'INVOICE_ACTION_TYPE/GET_SINGLE_INVOICE/DONE',
  CREATE_INVOICE_START: 'INVOICE_ACTION_TYPE/CREATE_INVOICE/START',
  CREATE_INVOICE_DONE: 'INVOICE_ACTION_TYPE/CREATE_INVOICE/DONE',
  GET_USER_CLIENT_START: 'INVOICE_ACTION_TYPE/GET_USER_CLIENT/START',
  GET_USER_CLIENT_DONE: 'INVOICE_ACTION_TYPE/GET_USER_CLIENT/DONE',
  CREATE_USER_CLIENT_START: 'INVOICE_ACTION_TYPE/CREATE_USER_CLIENT/START',
  CREATE_USER_CLIENT_DONE: 'INVOICE_ACTION_TYPE/CREATE_USER_CLIENT/DONE',
  GET_ALL_TEMPLATES_START: 'INVOICE_ACTION_TYPE/GET_ALL_TEMPLATES/START',
  GET_ALL_TEMPLATES_DONE: 'INVOICE_ACTION_TYPE/GET_ALL_TEMPLATES/DONE',
  SET_SELECTED_TEMPLATE_DONE: 'INVOICE_ACTION_TYPE/SET_SELECTED_TEMPLATE/DONE',
  CREATE_TRANSACTION_START: 'INVOICE_ACTION_TYPE/CREATE_TRANSACTION/START',
  CREATE_TRANSACTION_DONE: 'INVOICE_ACTION_TYPE/CREATE_TRANSACTION/DONE',
  GET_ALL_TRANSACTION_DONE: 'INVOICE_ACTION_TYPE/GET_ALL_TRANSACTION/DONE',
  DELETE_TRANSACTION_START: 'INVOICE_ACTION_TYPE/DELETE_TRANSACTION/START',
  DELETE_TRANSACTION_DONE: 'INVOICE_ACTION_TYPE/DELETE_TRANSACTION/DONE',
  UPDATE_INVOICE: 'INVOICE_ACTION_TYPE/UPDATE_INVOICE/DONE',
  SET_SELECTED_INVOICE_DONE: 'INVOICE_ACTION_TYPE/SET_SELECTED_INVOICE/DONE',
  SAVE_INVOICE_START: 'INVOICE_ACTION_TYPE/SAVE_INVOICE/START',
  SAVE_INVOICE_DONE: 'INVOICE_ACTION_TYPE/SAVE_INVOICE/DONE',
  SET_SELECTED_CLIENT_DONE: 'INVOICE_ACTION_TYPE/SET_SELECTED_CLIENT/DONE',
}

export const getAllInvoices = () => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.GET_ALL_INVOICES_START })

  AuthenticatedAPI.get(`invoices/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_INVOICES_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_INVOICES_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getSingleInvoice = (id) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.GET_SINGLE_INVOICE_START })

  AuthenticatedAPI.get(`invoice/${id}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_SINGLE_INVOICE_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_SINGLE_INVOICE_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const setSelectedTemplate = (id) => (dispatch) => {
  dispatch({
    type: INVOICE_ACTION_TYPE.SET_SELECTED_TEMPLATE_DONE,
    payload: {
      data: id,
    },
  })
}

export const getAllTemplates = () => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.GET_ALL_TEMPLATES_START })

  AuthenticatedAPI.get('invoice/templates/')
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_TEMPLATES_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_TEMPLATES_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const createInvoice = () => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CREATE_INVOICE_START })

  AuthenticatedAPI.post(`invoices/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_INVOICE_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_INVOICE_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getAllUserClient = () => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.GET_USER_CLIENT_START })

  AuthenticatedAPI.get(`clients/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_USER_CLIENT_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_USER_CLIENT_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const createUserClient = (data) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_START })

  AuthenticatedAPI.post(`invoices/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const createInvoiceTransaction = (data) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CREATE_TRANSACTION_START })

  AuthenticatedAPI.post(`invoice/payment/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_TRANSACTION_DONE,
        payload: {
          data: camelize(response.data),
          statusCode: response.status,
        },
      })
      dispatch(getAllInvoices())
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_TRANSACTION_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getInvoiceTransactions = (uuid: string) => (dispatch) => {
  AuthenticatedAPI.get(`invoice/payment/?invoice=${uuid}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_TRANSACTION_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_ALL_TRANSACTION_DONE,
        payload: {
          data: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const deleteTransactions = (uuid: string) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.DELETE_TRANSACTION_START })

  AuthenticatedAPI.delete(`invoice/payment/?invoice=${uuid}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_TRANSACTION_DONE,
        payload: {
          uuid,
          statusCode: response.status,
        },
      })
      dispatch(getAllInvoices())
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_TRANSACTION_DONE,
        payload: {
          statusCode: err.response.status,
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const updateInvoice = (data: Record<string, string | number>) => (dispatch) => {
  dispatch({
    type: INVOICE_ACTION_TYPE.UPDATE_INVOICE,
    payload: { data },
  })
}

export const setSelectedInvoice = (id) => (dispatch) => {
  dispatch({
    type: INVOICE_ACTION_TYPE.SET_SELECTED_INVOICE_DONE,
    payload: {
      data: id,
    },
  })
}

export const saveInvoice = (uuid?: string) => (dispatch, getState) => {
  const { selectedInvoice } = getState().invoices.invoice
  const data = snakify(selectedInvoice)
  console.log(data)

  let request, url
  dispatch({ type: INVOICE_ACTION_TYPE.SAVE_INVOICE_START })
  if (uuid) {
    request = AuthenticatedAPI.patch
    url = `invoice/${uuid}/`
  } else {
    request = AuthenticatedAPI.post
    url = `invoices/`
  }

  request(url, data)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.SAVE_INVOICE_DONE,
        payload: {
          statusCode: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.SAVE_INVOICE_DONE,
        payload: {
          statusCode: err.response.status,
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const setSelectedClient = (id: number) => (dispatch) => {
  dispatch({
    type: INVOICE_ACTION_TYPE.SET_SELECTED_CLIENT_DONE,
    payload: {
      data: id,
    },
  })
}
