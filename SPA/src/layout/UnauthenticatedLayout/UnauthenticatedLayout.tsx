import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { Slider } from '_Home/components/'
import { useUser } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'

import LOGO from '_Images/useinvoice.svg'

import styles from './UnauthenticatedLayout.module.styl'

export const UnauthenticatedLayout = () => {
  const { isLoggedIn, isCheckingLoginStatus, hasCheckedLoginStatus } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn) {
      const queryParams = new URLSearchParams(location.search)
      const redirectPath = queryParams.get('rdr') ?? ROUTES.authenticatedRoutes.OVERVIEW.path
      navigate(redirectPath)
    }
  }, [isLoggedIn])

  if (isCheckingLoginStatus || !hasCheckedLoginStatus) {
    return null
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.nav_top}>
          <div className={styles.logo}>
            <Link to="/">
              <img id="full" src={LOGO} alt="LOGO" />
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.content_sidebar}>
            <Slider />
          </div>
          <div className={styles.content_children}>
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  return null
}
