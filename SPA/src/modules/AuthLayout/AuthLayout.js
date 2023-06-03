import React from 'react'
import { Slider } from '_Home/components/Slider/Slider'

import styles from './AuthLayout.styl'

export const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className="content">
        <div className="content-sidebar">
          <Slider />
        </div>
        <div className="content-children">{children}</div>
      </div>
    </div>
  )
}
