import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'

import { Slider } from '_Home/components/'

import LOGO from '_Images/useinvoice.svg'

import styles from './UnauthenticatedLayout.module.styl'

export const UnauthenticatedLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.nav_top}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={LOGO} alt="LOGO" />
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
