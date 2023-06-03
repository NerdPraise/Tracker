import React from 'react'
import ClassNames from 'classnames'

import styles from './Header.styl'

export const Header = ({ children, ...props }) => {
  return (
    <div className={ClassNames(styles.HeaderContainer)}>
      <div className="children">
        {children?.map((child) =>
          React.cloneElement(child, {
            className: 'header-child',
          }),
        )}
      </div>
    </div>
  )
}
