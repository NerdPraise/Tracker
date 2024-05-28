import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Backdrop, SideBar } from '_Home/components'

import { ROUTES } from '_Home/routing/routes'
import { capitalise } from '_Home/common/utils'

import styles from './SideBarLayout.module.styl'

interface SideBarLayoutProps {
  backdrop?: boolean
  children: React.ReactNode
  disableHide: boolean
  extraContent?: React.ReactNode
  selectedKey?: string
}

export const SideBarLayout = ({
  backdrop,
  children,
  disableHide,
  extraContent,
  selectedKey,
}: SideBarLayoutProps) => {
  const [showSide, setShowSide] = useState(disableHide)

  const closeSide = () => {
    setShowSide(false)
  }

  const toggleSide = () => {
    setShowSide(!showSide)
  }

  return (
    <div className={styles.container}>
      <SideBar
        show={showSide}
        className={styles.LayoutSide}
        toggleSide={toggleSide}
        closeSide={closeSide}
        disableHide={disableHide}
        selectedKey={selectedKey}
      >
        {Object.entries(ROUTES.authenticatedRoutes)
          .filter(([_, v]) => v.menu)
          .map(([k, v]) => (
            <Link to={v.path} key={v.key}>
              {v?.logo} {capitalise(k)}
            </Link>
          ))}
      </SideBar>
      {showSide && backdrop && <Backdrop onClick={closeSide} />}
      <div className={styles.content}>
        <div className={styles.content_children}>{children}</div>
      </div>
      {extraContent}
    </div>
  )
}
