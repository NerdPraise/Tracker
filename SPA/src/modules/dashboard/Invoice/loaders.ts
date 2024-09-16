import store from '_Home/store'

import { getAllTemplates, getAllInvoices, getAllUserClient, getInvoiceSettings } from './redux/actions'

export const getAllTemplatesLoader = async () => {
  store.dispatch(getAllTemplates())
  store.dispatch(getAllInvoices())
  store.dispatch(getAllUserClient())
  store.dispatch(getInvoiceSettings())
  return null
}
