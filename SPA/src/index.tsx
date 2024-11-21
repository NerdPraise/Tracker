import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import store from '_Home/store'

import App from './App'
import MobileView from './MobileView'
import isMobile from './common/isMobile'

let View

if (isMobile()) {
  View = <MobileView />
} else {
  View = (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID}>
        <RouterProvider router={App} />
      </GoogleOAuthProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>{View}</React.StrictMode>)
