import { Outlet } from 'react-router'

import { Overview } from '_Module/dashboard/Overview'
import { SignUp } from '_Module/authentication/SignUp'
import { Login } from '_Module/authentication/Login'
import { BudgetStudio } from '_Module/dashboard/BudgetStudio'
import { Track } from '_Module/dashboard/Track'
import { InvoiceEdit, InvoiceList, AddInvoice, InvoiceDetail } from '_Module/dashboard/Invoice'
import { getAllTemplatesLoader, getUserLoader } from '_Module/dashboard/Invoice/loaders'
import { UnauthenticatedLayout } from '_Home/layout/UnauthenticatedLayout'
import { InvoicePreview } from '_Module/dashboard/Invoice/InvoiceDetail/InvoicePreview'
import Settings from '_Module/dashboard/Settings/Settings'
import Home from '_Module/presentation/Home'
import Contacts from '_Module/dashboard/Invoice/Contacts/Contacts'
import ContactHistory from '_Module/dashboard/Invoice/Contacts/ContactHistory'
import Subscription from '_Home/modules/dashboard/Settings/Subscription'
import { ROUTES } from '_Home/routing/routes'

import CreateTemplate from '_Home/modules/dashboard/Invoice/ITemplates/CreateTemplate/CreateTemplate'
import InvoiceSettings from '_Home/modules/dashboard/Settings/InvoiceSettings'
import GeneralSettings from '_Home/modules/dashboard/Settings/GeneralSettings'
import Billing from '_Home/modules/dashboard/Settings/Billing'
import TourAuthenticatedWrapper from './TourAuthenticatedWrapper'

const BaseRouter = [
  {
    path: '/',
    element: '',
    children: [
      {
        element: <TourAuthenticatedWrapper />,
        loader: getUserLoader,
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
            path: ROUTES.authenticatedRoutes.MILESTONE.path,
            element: <Track />,
          },
          {
            path: '/settings',
            element: <Settings />,
            children: [
              {
                path: '/settings/general',
                element: <GeneralSettings />,
                index: true,
              },
              {
                path: '/settings/invoice',
                element: <InvoiceSettings />,
              },
              {
                path: '/settings/billing',
                element: <Billing />,
              },
              {
                path: '/settings/subscription',
                element: <Subscription />,
              },
            ],
          },
          {
            path: ROUTES.authenticatedRoutes.INVOICES.path,
            loader: getAllTemplatesLoader,
            children: [
              {
                path: ROUTES.authenticatedRoutes.INVOICES.path,
                element: <InvoiceList />,
                index: true,
              },
              {
                path: ROUTES.authenticatedRoutes.CONTACTS.path,
                element: <Contacts />,
              },
              {
                path: ROUTES.authenticatedRoutes.CONTACT_HISTORY.path,
                element: <ContactHistory />,
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
              {
                path: ROUTES.authenticatedRoutes.CUSTOM_TEMPLATE.path,
                element: <CreateTemplate />,
              },
              {
                path: ROUTES.authenticatedRoutes.CREATE_CUSTOM_TEMPLATE.path,
                element: <CreateTemplate />,
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
      {
        index: true,
        element: <Home />,
      },
      {
        element: (
          <div style={{ height: '100vh', width: '100vw', backgroundColor: 'white' }}>
            <Outlet />
          </div>
        ),
        children: [
          {
            path: ROUTES.externalRoutes.PREVIEW.path,
            element: <InvoicePreview />,
          },
          {
            path: ROUTES.externalRoutes.CLIENT_PREVIEW.path,
            element: <InvoicePreview />,
          },
        ],
      },
    ],
  },
]

export default BaseRouter
