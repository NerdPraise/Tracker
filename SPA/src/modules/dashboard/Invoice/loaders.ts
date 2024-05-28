import store from '_Home/store'

import { getAllTemplates, getAllInvoices, getAllUserClient } from './redux/actions'

export const getAllTemplatesLoader = async () => {
  store.dispatch(getAllTemplates())
  store.dispatch(getAllInvoices())
  store.dispatch(getAllUserClient())
  return null
}
