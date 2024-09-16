import { moneyTrackReducer } from '_Home/modules/dashboard/Overview/redux/reducer'
import { budgetReducer, categoryReducer } from '_Home/modules/dashboard/BudgetStudio/redux/reducer'
import { invoiceReducer } from '_Home/modules/dashboard/Invoice/redux/reducer'
import { userReducer } from '_Home/common/reducer'
import { settingsReducer } from '_Home/modules/dashboard/Settings/redux/reducer'

export const reducer = {
  moneyTrack: moneyTrackReducer,
  user: userReducer,
  budget: budgetReducer,
  categories: categoryReducer,
  invoices: invoiceReducer,
  settings: settingsReducer,
}
