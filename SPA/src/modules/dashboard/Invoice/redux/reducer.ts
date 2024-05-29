// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit'

import { StatusCode } from '_Home/common/utils'

import { INVOICE_ACTION_TYPE } from './actions'

type InvoiceState = {
  errorMessage: string
  invoice: {
    loading: boolean
    invoices: IInvoice[]
    selectedInvoice: IInvoice | null
    statusCode: IStatusCode
  }
  client: {
    loading: boolean
    clients: IClient[]
  }
  template: {
    loading: boolean
    selectedTemplate: ITemplate | null
    templates: ITemplate[]
  }
  transaction: {
    loading: boolean
    statusCode: IStatusCode
    transactions: {
      amount: string
      paymentDate: string
      mode: string
    }[]
  }
}

const initialState: InvoiceState = {
  errorMessage: '',
  invoice: {
    loading: false,
    invoices: [],
    selectedInvoice: null,
  },
  client: {
    loading: false,
    clients: [],
  },
  template: {
    loading: false,
    selectedTemplate: null,
    templates: [],
  },
  transaction: {
    loading: false,
    transactions: [],
    statusCode: StatusCode.CLEARED,
  },
}

export const invoiceReducer = createReducer(initialState, (invoice) => {
  invoice
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_INVOICES_START, (state, _) => {
      state.invoice.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.CLEAR_INVOICE_STATUS_CODE, (state, _) => {
      state.invoice.statusCode = StatusCode.CLEARED
    })
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_INVOICES_DONE, (state, action) => {
      state.invoice.loading = false
      state.invoice.invoices = action.payload.data || []
      state.errorMessage = action.payload.errorMessage || ''
      state.statusCode = StatusCode.CLEARED
    })
    .addCase(INVOICE_ACTION_TYPE.GET_USER_CLIENT_START, (state, _) => {
      state.client.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.GET_USER_CLIENT_DONE, (state, action) => {
      state.client.loading = false
      state.client.clients = action.payload.data || []
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_TEMPLATES_START, (state, _) => {
      state.template.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_TEMPLATES_DONE, (state, action) => {
      state.template.loading = false
      state.template.templates = action.payload.data || []
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(INVOICE_ACTION_TYPE.SET_SELECTED_TEMPLATE_DONE, (state, action) => {
      state.template.selectedTemplate = state.template.templates.find(
        (item) => item.uuid === action.payload.data,
      )
    })
    .addCase(INVOICE_ACTION_TYPE.SET_SELECTED_INVOICE_DONE, (state, action) => {
      switch (action.payload.type) {
        case 'new':
          state.invoice.selectedInvoice = {
            invoiceItems: [],
            name: '',
            uuid: '',
            dueDate: '',
            description: '',
            extraInfo: '',
            client: null,
            template: state.template.selectedTemplate,
            amount: 0,
            currency: '',
            payment: {
              status: '',
              totalDue: 0,
            },
          }
          break
        case 'exist':
          state.invoice.selectedInvoice = state.invoice.invoices.find(
            (item) => item.uuid === action.payload.id,
          )
          break
        default:
          break
      }
    })
    .addCase(INVOICE_ACTION_TYPE.CREATE_TRANSACTION_START, (state, _) => {
      state.transaction.statusCode = StatusCode.CLEARED
      state.transaction.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.CREATE_TRANSACTION_DONE, (state, action) => {
      state.transaction.loading = false
      state.transaction.transactions.push(action.payload.data)
      state.transaction.statusCode = action.payload.statusCode
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_TRANSACTION_DONE, (state, action) => {
      state.transaction.transactions = action.payload.data
      state.errorMessage = action.payload.errorMessage || ''
    })
    .addCase(INVOICE_ACTION_TYPE.DELETE_TRANSACTION_START, (state, action) => {
      state.transaction.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.SAVE_INVOICE_START, (state, action) => {
      state.invoice.loading = true
    })
    .addCase(INVOICE_ACTION_TYPE.SAVE_INVOICE_DONE, (state, action) => {
      state.invoice.loading = false
      state.invoice.statusCode = action.payload.statusCode
      state.invoice.selectedInvoice = action.payload.data
    })
    .addCase(INVOICE_ACTION_TYPE.DELETE_TRANSACTION_DONE, (state, action) => {
      state.transaction.loading = false
      state.transaction.statusCode = action.payload.statusCode
      state.errorMessage = action.payload.errorMessage || ''
      if (action.payload.statusCode === StatusCode.NO_CONTENT) {
        let invoice = state.invoice.selectedInvoice
        invoice['payment'] = invoice.invoiceItems.reduce((acc, cur) => acc + cur.amount, 0)
        state.transaction.transactions = []
      }
    })
    .addCase(INVOICE_ACTION_TYPE.UPDATE_INVOICE, (state, action) => {
      let { selectedInvoice } = state.invoice
      const { section } = action.payload.data
      switch (section) {
        case 'invoiceItems':
          const { name, value, ind } = action.payload.data
          selectedInvoice.invoiceItems[ind][name] = value
          break

        case 'theme':
          const { color, name: colorName } = action.payload.data
          selectedInvoice.template.settings.theme[colorName] = color
          break

        case 'delete':
          const { id } = action.payload.data
          selectedInvoice.invoiceItems.splice(id, 1)
          break

        case 'add':
          selectedInvoice.invoiceItems.push({
            description: '',
            unitPrice: 0,
            quantity: 0,
            invoice: state.invoice.selectedInvoice.id,
          })
          break

        case 'client':
          const { id: clientId } = action.payload.data
          state.invoice.selectedInvoice.client = state.client.clients.find(
            (item) => item.id === clientId,
          )
          break
        case 'others':
          const { field, res } = action.payload.data
          state.invoice.selectedInvoice[field] = res
          break
        default:
          break
      }
    })
})
