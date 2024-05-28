import React from 'react'
import ClassNames from 'classnames'

import styles from './Header.module.styl'

interface HeaderProps {
  children: React.JSX.Element[]
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <div className={ClassNames(styles.HeaderContainer)}>
      <div className={styles.children}>
        {children?.map((child) =>
          React.cloneElement(child, {
            className: 'header-child',
          }),
        )}
      </div>
    </div>
  )
}
