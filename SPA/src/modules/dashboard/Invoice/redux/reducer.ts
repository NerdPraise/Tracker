// @ts-nocheck
import { createReducer, current, original } from '@reduxjs/toolkit'
import { color } from '@uiw/color-convert'

import { StatusCode } from '_Home/common/utils'

import { INVOICE_ACTION_TYPE } from './actions'

type InvoiceState = {
  errorMessage: string
  invoice: {
    loading: boolean
    invoices: IInvoice[]
    selectedInvoice: IInvoice | null
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
    .addCase(INVOICE_ACTION_TYPE.GET_ALL_INVOICES_DONE, (state, action) => {
      state.invoice.loading = false
      state.invoice.invoices = action.payload.data || []
      state.errorMessage = action.payload.errorMessage || ''
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
      const selected = original(state.invoice.invoices).find((item) => item.uuid === action.payload.data)
      state.invoice.selectedInvoice = selected
    })
    .addCase(INVOICE_ACTION_TYPE.SET_SELECTED_CLIENT_DONE, (state, action) => {
      state.invoice.selectedInvoice.client = state.client.clients.find(
        (item) => item.id === action.payload.data,
      )
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
      console.log(section)
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
        default:
          break
      }
    })
})
