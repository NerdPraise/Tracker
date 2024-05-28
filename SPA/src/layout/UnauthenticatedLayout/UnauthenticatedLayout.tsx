import { Slider } from '_Home/components/'
import { Outlet } from 'react-router'

import styles from './UnauthenticatedLayout.module.styl'

export const UnauthenticatedLayout = () => {
  return (
    <div className={styles.container}>
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
