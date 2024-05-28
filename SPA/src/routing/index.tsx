import { Overview } from '_Home/modules/dashboard/Overview'
import { SignUp } from '_Home/modules/authentication/SignUp'
import { Login } from '_Home/modules/authentication/Login'
import { BudgetStudio } from '_Home/modules/dashboard/BudgetStudio'
import { Track } from '_Home/modules/dashboard/Track'
import { InvoiceEdit, InvoiceList, AddInvoice, InvoiceDetail } from '_Home/modules/dashboard/Invoice'
import { getAllTemplatesLoader } from '_Home/modules/dashboard/Invoice/loaders'
import { UnauthenticatedLayout } from '_Home/layout/UnauthenticatedLayout'

import { ROUTES } from '_Home/routing/routes'

import { AuthenticatedWrapper } from './AuthenticatedWrapper'

const BaseRouter = [
  {
    path: '/',
    element: '',

    children: [
      {
        element: <AuthenticatedWrapper />,
        children: [
          {
            path: ROUTES.authenticatedRoutes.OVERVIEW.path,
            element: <Overview />,
            index: true,
          },
          {
            path: ROUTES.authenticatedRoutes.BUDGET.path,
            element: <BudgetStudio />,
          },
          {
            path: ROUTES.authenticatedRoutes.TRACK.path,
            element: <Track />,
          },
          {
            path: ROUTES.authenticatedRoutes.INVOICE.path,
            loader: getAllTemplatesLoader,
            children: [
              {
                path: ROUTES.authenticatedRoutes.INVOICE.path,
                element: <InvoiceList />,
                index: true,
              },
              {
                path: ROUTES.authenticatedRoutes.ADD_INVOICE.path,
                element: <AddInvoice />,
              },
              {
                path: ROUTES.authenticatedRoutes.EDIT_INVOICE.path,
                element: <InvoiceEdit />,
              },
              {
                path: ROUTES.authenticatedRoutes.ADD_TEMPLATE.path,
                element: <InvoiceEdit />,
              },
              {
                path: ROUTES.authenticatedRoutes.INVOICE_DETAIL.path,
                element: <InvoiceDetail />,
              },
            ],
          },
        ],
      },
      {
        element: <UnauthenticatedLayout />,
        children: [
          {
            path: ROUTES.unauthenticatedRoutes.LOGIN.path,
            element: <Login />,
          },
          {
            path: ROUTES.unauthenticatedRoutes.SIGNUP.path,
            element: <SignUp />,
          },
        ],
      },
    ],
  },
]

export default BaseRouter
