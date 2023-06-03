import React from 'react'
import ClassNames from 'classnames'

import styles from './SideBar.styl'

export const SideBar = ({
  children,
  position = 'left',
  show,
  toggleSide,
  closeSide,
  disableHide,
  className,
  selectedKey,
  ...props
}) => {
  return (
    <div
      className={ClassNames(className, styles.SideBarContainer, {
        show: show,
        right: position === 'right',
      })}
    >
      {!disableHide && (
        <div onClick={toggleSide} className="hamburger">
          {show ? 'close' : 'open'}
        </div>
      )}
      <div className="children">
        {show &&
          children?.map((child, ind) =>
            React.cloneElement(child, {
              className: ClassNames('sidebar-child', { active: selectedKey === child.key }),
              onClick: disableHide ? undefined : closeSide,
              key: `side ${ind}`,
            }),
          )}
      </div>
    </div>
  )
}
