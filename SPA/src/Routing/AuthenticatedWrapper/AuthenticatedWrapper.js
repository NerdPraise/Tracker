import { Navigate, Outlet, useLocation } from 'react-router'
import { useEffect, useState, useRef } from 'react'

import { useUser } from '_Home/hooks'
import { ROUTES } from '_Home/routes'

export const AuthenticatedWrapper = () => {
  const { isLoggedIn, isCheckingLoginStatus } = useUser()
  const [hasCheckedLoginStatus, setHasCheckedLoginStatus] = useState(false)
  const didMount = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn) {
      setHasCheckedLoginStatus(true)
    }
  }, [])

  useEffect(() => {
    if (didMount.current) {
      if (!isCheckingLoginStatus) {
        setHasCheckedLoginStatus(true)
      }
    } else didMount.current = true
  })

  if (hasCheckedLoginStatus) {
    if (isLoggedIn) {
      return <Outlet />
    }
    const path = location?.pathname
    const encodedPath = encodeURIComponent(`${path}`)
    return <Navigate to={`${ROUTES.LOGIN.path}?rdr=${encodedPath}`} />
  }
  return null
}
