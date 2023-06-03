import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Backdrop, SideBar } from '_Home/components'
import { ROUTES } from '_Home/routes'

import styles from './Layout.styl'

export const Layout = ({ backdrop, children, disableHide, extraContent, selectedKey }) => {
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
        <Link to={ROUTES.OVERVIEW_TRACK.path} key={ROUTES.OVERVIEW_TRACK.key}>
          Overview
        </Link>
        <Link to={ROUTES.BUDGET.path} key={ROUTES.BUDGET.key}>
          Budget
        </Link>
        <Link to={ROUTES.BUDGET.path}>Reports</Link>
        <Link to={ROUTES.BUDGET.path}>Great</Link>
        <Link to={ROUTES.BUDGET.path}>Budget</Link>
      </SideBar>
      {showSide && backdrop && <Backdrop onClick={closeSide} />}
      <div className="content">
        <div className="content-children">{children}</div>
      </div>
      {extraContent && extraContent}
    </div>
  )
}
