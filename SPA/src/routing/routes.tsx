import { BarChart3, BookOpenText, Cog, Receipt, TrainTrack } from 'lucide-react'

interface routes {
  authenticatedRoutes: {
    [key: string]: {
      path: string
      key: string
      menu: boolean
      logo?: ReactChildren
      permission: string | null
    }
  }
  unauthenticatedRoutes: {
    [key: string]: { path: string; key: string }
  }
  externalRoutes: {
    [key: string]: { path: string; key: string }
  }
}

export const ROUTES: routes = {
  authenticatedRoutes: {
    OVERVIEW: {
      path: '/overview',
      key: 'OVERVIEW',
      menu: true,
      logo: <BarChart3 />,
      permission: '',
    },
    INVOICES: { path: '/invoice', key: 'INVOICE', menu: true, logo: <BookOpenText />, permission: '' },
    BUDGET: {
      path: '/budget-studio',
      key: 'BUDGET_STUDIO',
      menu: true,
      logo: <Receipt />,
      permission: 'view-budget',
    },
    TRACK: {
      path: '/track',
      key: 'TRACK',
      menu: true,
      logo: <TrainTrack />,
      permission: 'view-track',
    },
    SETTINGS: { path: '/settings/general', key: 'SETTINGS', menu: true, logo: <Cog />, permission: '' },
    ADD_INVOICE: { path: '/invoice/add', key: 'ADD_INVOICE', menu: false, permission: '' },
    CONTACTS: { path: '/invoice/contacts', key: 'CONTACTS', menu: false, permission: '' },
    CONTACT_HISTORY: {
      path: '/invoice/contacts/history',
      key: 'CONTACT_HISTORY',
      menu: false,
      permission: '',
    },
    CREATE_CUSTOM_TEMPLATE: {
      path: '/invoice/custom',
      key: 'CREATE_CUSTOM_TEMPLATE',
      menu: false,
      permission: '',
    },
    CUSTOM_TEMPLATE: {
      path: '/invoice/custom/:templateId',
      key: 'CUSTOM_TEMPLATE',
      menu: false,
      permission: '',
    },
    ADD_TEMPLATE: { path: '/invoice/add/:templateId', key: 'ADD_TEMPLATE', menu: false, permission: '' },
    EDIT_INVOICE: { path: '/invoice/edit/:invoiceId', key: 'EDIT_INVOICE', menu: false, permission: '' },
    INVOICE_DETAIL: { path: '/invoice/:invoiceId', key: 'INVOICE_DETAIL', menu: false, permission: '' },
  },
  unauthenticatedRoutes: {
    HOME: { path: '/', key: 'HOME' },
    ABOUT: { path: '/about', key: 'ABOUT' },
    LOGIN: { path: '/login', key: 'LOGIN' },
    SIGNUP: { path: '/register', key: 'SIGNUP' },
    SIGNUP_SUB: { path: '/register/subscribe', key: 'SIGNUP' },
  },
  externalRoutes: {
    PREVIEW: { path: '/preview/:invoiceId', key: 'PREVIEW' },
    CLIENT_PREVIEW: { path: 'client/:invoiceCode', key: 'PREVIEW' },
  },
}
