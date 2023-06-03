import { Provider } from 'react-redux'

import store from './store/config'
import BaseRouter from './Routing/BaseRouter'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <BaseRouter />
    </Provider>
  )
}

export default App
