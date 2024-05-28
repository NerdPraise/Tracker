import React, { MouseEventHandler } from 'react'
import ClassNames from 'classnames'

import styles from './SideBar.module.styl'

type ReactChildrenWithKey = (React.ReactElement & { key: string })[]

interface SideBarProps {
  children: ReactChildrenWithKey
  position?: 'left' | 'right'
  show: boolean
  toggleSide: MouseEventHandler<HTMLDivElement>
  closeSide: VoidFunction
  disableHide?: boolean
  className?: string
  selectedKey: string
}

export const SideBar = ({
  children,
  position = 'left',
  show,
  toggleSide,
  closeSide,
  disableHide,
  className,
  selectedKey,
}: SideBarProps) => {
  return (
    <div
      className={ClassNames(className, styles.SideBarContainer, {
        [styles.show]: show,
        [styles.right]: position === 'right',
      })}
    >
      {!disableHide && (
        <div onClick={toggleSide} className={styles.hamburger}>
          {show ? 'close' : 'open'}
        </div>
      )}
      <div className={styles.children}>
        {show &&
          children?.map((child, ind) =>
            React.cloneElement(child, {
              className: ClassNames(styles.sidebar_child, { active: selectedKey === child.key }),
              onClick: disableHide ? undefined : closeSide,
              key: `side ${ind}`,
            }),
          )}
      </div>
    </div>
  )
}
