import store from '_Home/store'
import { getUserAction } from '_Home/modules/authentication/Login/redux/actions'

import { getAllTemplates, getAllInvoices, getAllUserClient, getInvoiceSettings } from './redux/actions'

export const getAllTemplatesLoader = async () => {
  store.dispatch(getAllTemplates())
  store.dispatch(getAllInvoices())
  store.dispatch(getAllUserClient())
  store.dispatch(getInvoiceSettings())
  return null
}

export const getUserLoader = async () => {
  store.dispatch(getUserAction())
  return null
}
