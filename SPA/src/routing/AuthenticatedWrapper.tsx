import { Navigate, Outlet, useLocation } from 'react-router'
import { useEffect, useState, useRef } from 'react'

import { getUserAction } from '_Home/modules/authentication/Login/redux/actions'
import { ROUTES } from '_Home/routing/routes'
import { useAppSelector, useAppDispatch } from '_Home/common/hooks'

export const AuthenticatedWrapper = () => {
  const [hasCheckedLoginStatus, setHasCheckedLoginStatus] = useState<boolean>(false)
  const didMount = useRef<boolean>(false)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isLoggedIn, isCheckingLoginStatus } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUserAction())
    } else {
      setHasCheckedLoginStatus(true)
    }
  }, [hasCheckedLoginStatus])

  useEffect(() => {
    if (didMount.current) {
      if (!isCheckingLoginStatus) {
        setHasCheckedLoginStatus(true)
      }
    } else {
      didMount.current = true
    }
  })

  if (isCheckingLoginStatus) {
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
