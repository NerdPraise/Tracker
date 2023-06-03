import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ROUTES } from '_Home/routes'
import { MoneyDashboard } from '_Home/modules/MoneyDashboard'
import { Login } from '_Home/modules/Login'
import { Budget } from '_Home/modules/Budget'

import { AuthenticatedWrapper } from '../AuthenticatedWrapper'
import { SignUp } from '_Home/modules/SignUp'

export const BaseRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthenticatedWrapper />} path="/">
          <Route element={<MoneyDashboard />} path={ROUTES.OVERVIEW_TRACK.path} />
          <Route element={<Budget />} path={ROUTES.BUDGET.path} />
        </Route>
        <Route element={<Login />} path={ROUTES.LOGIN.path} />
        <Route element={<SignUp />} path={ROUTES.SIGNUP.path} />
      </Routes>
    </BrowserRouter>
  )
}
