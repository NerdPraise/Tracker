import { BarChart3, BookOpenText, Receipt, TrainTrack } from 'lucide-react'

interface routes {
  authenticatedRoutes: {
    [key: string]: { path: string; key: string; menu: boolean; logo?: ReactChildren }
  }
  unauthenticatedRoutes: {
    [key: string]: { path: string; key: string }
  }
}

export const ROUTES: routes = {
  authenticatedRoutes: {
    OVERVIEW: { path: '/overview', key: 'OVERVIEW', menu: true, logo: <BarChart3 /> },
    BUDGET: { path: '/budget-studio', key: 'BUDGET_STUDIO', menu: true, logo: <Receipt /> },
    TRACK: { path: '/track', key: 'TRACK', menu: true, logo: <TrainTrack /> },
    INVOICE: { path: '/invoice', key: 'INVOICE', menu: true, logo: <BookOpenText /> },
    ADD_INVOICE: { path: '/invoice/add', key: 'ADD_INVOICE', menu: false },
    ADD_TEMPLATE: { path: '/invoice/add/:templateId', key: 'ADD_TEMPLATE', menu: false },
    EDIT_INVOICE: { path: '/invoice/edit/:invoiceId', key: 'EDIT_INVOICE', menu: false },
    INVOICE_DETAIL: { path: '/invoice/:invoiceId', key: 'INVOICE_DETAIL', menu: false },
  },
  unauthenticatedRoutes: {
    HOME: { path: '/', key: 'HOME' },
    ABOUT: { path: '/about', key: 'ABOUT' },
    LOGIN: { path: '/login', key: 'LOGIN' },
    SIGNUP: { path: '/register', key: 'SIGNUP' },
  },
}
