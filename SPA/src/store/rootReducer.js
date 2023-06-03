import { combineReducers } from 'redux'

import { moneyTrackReducer } from '_Home/modules/MoneyDashboard/redux/reducer'
import { budgetReducer, categoryReducer } from '_Home/modules/Budget/redux/reducer'
import { userReducer } from '_Home/common/reducer'

export const rootReducer = combineReducers({
  moneyTrack: moneyTrackReducer,
  user: userReducer,
  budget: budgetReducer,
  categories: categoryReducer,
})
