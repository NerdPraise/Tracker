import { Navigate, Outlet, useLocation } from 'react-router'

import { ROUTES } from '_Home/routing/routes'
import { useUser } from '_Home/common/hooks'

export const AuthenticatedWrapper = () => {
  const { isLoggedIn, isCheckingLoginStatus, hasCheckedLoginStatus } = useUser()
  const location = useLocation()

  if (isCheckingLoginStatus || !hasCheckedLoginStatus) {
    return null
  }

  if (hasCheckedLoginStatus) {
    if (isLoggedIn) {
      if (location.pathname === '/') {
        return <Navigate to={ROUTES.authenticatedRoutes.OVERVIEW.path} />
      }
      return <Outlet />
    }
    const path = location.pathname === '/' ? ROUTES.authenticatedRoutes.OVERVIEW.path : location.pathname
    const encodedPath = encodeURIComponent(`${path}`)
    return <Navigate to={`${ROUTES.unauthenticatedRoutes.LOGIN.path}?rdr=${encodedPath}`} />
  }
  return null
}
