import { ColorResult } from '@uiw/color-convert'

import { camelize, snakify } from '_Home/common/utils'
import { API, AuthenticatedAPI } from '_Home/store/api'

export const INVOICE_ACTION_TYPE = {
  GET_ALL_INVOICES_START: 'INVOICE_ACTION_TYPE/GET_ALL_INVOICES/START',
  GET_ALL_INVOICES_DONE: 'INVOICE_ACTION_TYPE/GET_ALL_INVOICES/DONE',
  GET_SINGLE_INVOICE_START: 'INVOICE_ACTION_TYPE/GET_SINGLE_INVOICE/START',
  GET_SINGLE_INVOICE_DONE: 'INVOICE_ACTION_TYPE/GET_SINGLE_INVOICE/DONE',
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
  CLEAR_INVOICE_STATUS_CODE: 'INVOICE_ACTION_TYPE/CLEAR_INVOICE_STATUS_CODE/DONE',
  UPDATE_TEMPLATE_START: 'INVOICE_ACTION_TYPE/UPDATE_TEMPLATE/START',
  UPDATE_TEMPLATE_DONE: 'INVOICE_ACTION_TYPE/UPDATE_TEMPLATE/DONE',
  DELETE_USER_CLIENT_DONE: 'INVOICE_ACTION_TYPE/DELETE_USER_CLIENT/DONE',
  DELETE_INVOICE_DONE: 'INVOICE_ACTION_TYPE/DELETE_INVOICE/DONE',
  SEND_INVOICE_DONE: 'INVOICE_ACTION_TYPE/SEND_INVOICE/DONE',
  GET_USER_INVOICE_SETTINGS_DONE: 'INVOICE_ACTION_TYPE/GET_USER_INVOICE_SETTINGS/DONE',
  UPDATE_INVOICE_SETTINGS_DONE: 'INVOICE_ACTION_TYPE/UPDATE_INVOICE_SETTINGS/DONE',
}

export const getAllInvoices = () => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })
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
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })
  dispatch({ type: INVOICE_ACTION_TYPE.GET_SINGLE_INVOICE_START })

  API.get(`invoice/${id}/`)
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

export const saveTemplate = () => (dispatch, getState) => {
  dispatch({
    type: INVOICE_ACTION_TYPE.UPDATE_TEMPLATE_START,
  })

  const data = snakify({
    ...getState().invoices.invoice.selectedInvoice.template,
    invoice: getState().invoices.invoice.selectedInvoice.uuid,
  })
  AuthenticatedAPI.put(
    `invoice/templates/${getState().invoices.invoice.selectedInvoice.template.id}`,
    JSON.stringify(data),
  )
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.UPDATE_TEMPLATE_DONE,
        payload: {
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.UPDATE_TEMPLATE_DONE,
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

export const getInvoiceSettings = () => (dispatch) => {
  AuthenticatedAPI.get(`invoice-settings/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_USER_INVOICE_SETTINGS_DONE,
        payload: {
          data: camelize(response.data),
          statusCode: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.GET_USER_INVOICE_SETTINGS_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const updateInvoiceSettings = (id: string, data: FormData) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })

  AuthenticatedAPI.put(`invoice-settings/${id}`, data)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.UPDATE_INVOICE_SETTINGS_DONE,
        payload: {
          data: camelize(response.data),
          statusCode: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.UPDATE_INVOICE_SETTINGS_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const createUserClient = (data: FormData) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_START })

  AuthenticatedAPI.post(`clients/`, data)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_DONE,
        payload: {
          data: camelize(response.data),
          status: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.CREATE_USER_CLIENT_DONE,
        payload: {
          errorMessage: err.response ? err.response.data : 'Something terrible occurred',
        },
      }),
    )
}

export const deleteUserClient = (id: number) => (dispatch) => {
  AuthenticatedAPI.delete(`clients/${id}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_USER_CLIENT_DONE,
        payload: {
          status: response.status,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_USER_CLIENT_DONE,
        payload: {
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const deleteInvoice = (id: number) => (dispatch) => {
  AuthenticatedAPI.delete(`invoices/${id}/`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_INVOICE_DONE,
        payload: {
          status: response.status,
          id,
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.DELETE_INVOICE_DONE,
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
          amount: data['amount'],
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

export const updateInvoice = (data: Record<string, string | number | ColorResult>) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })

  dispatch({
    type: INVOICE_ACTION_TYPE.UPDATE_INVOICE,
    payload: { data },
  })
}

export const setSelectedInvoice = (data: Record<'invoiceID' | 'type', string>) => (dispatch) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })
  dispatch({
    type: INVOICE_ACTION_TYPE.SET_SELECTED_INVOICE_DONE,
    payload: {
      type: data.type,
      id: data.invoiceID,
    },
  })
}

export const saveInvoice = (uuid?: string) => (dispatch, getState) => {
  dispatch({ type: INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE })
  const { selectedInvoice } = getState().invoices.invoice
  const data = snakify({
    ...selectedInvoice,
    client: selectedInvoice.client.id,
    template: selectedInvoice.template.id,
  })

  let request, url
  dispatch({ type: INVOICE_ACTION_TYPE.SAVE_INVOICE_START })
  if (uuid) {
    request = AuthenticatedAPI.patch
    url = `invoices/${uuid}/`
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
          data: camelize(response.data),
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

export const sendInvoiceToClient = (uuid: string) => (dispatch) => {
  AuthenticatedAPI.get(`invoices/send_invoice_to_client/?invoice=${uuid}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.SEND_INVOICE_DONE,
        payload: {
          statusCode: response.status,
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.SEND_INVOICE_DONE,
        payload: {
          data: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}

export const getAllDataForInvoiceView = (invoiceCode: string) => (dispatch) => {
  AuthenticatedAPI.get(`invoices/send_invoice_to_client/?invoice=${invoiceCode}`)
    .then((response) => {
      dispatch({
        type: INVOICE_ACTION_TYPE.SEND_INVOICE_DONE,
        payload: {
          statusCode: response.status,
          data: camelize(response.data),
        },
      })
    })
    .catch((err) =>
      dispatch({
        type: INVOICE_ACTION_TYPE.SEND_INVOICE_DONE,
        payload: {
          data: [],
          errorMessage: err.response ? err.response.data.message : 'Something terrible occurred',
        },
      }),
    )
}
