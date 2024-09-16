import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, BellRing, Settings } from 'lucide-react'

import { Backdrop, SideBar, Modal } from '_Home/components'
import { getFirstTwoLetters, hasPermission } from '_Home/common/utils'
import { capitalise } from '_Home/common/utils'
import { useUser } from '_Home/common/hooks'

import { ROUTES } from '_Home/routing/routes'

import styles from './SideBarLayout.module.styl'

interface SideBarLayoutProps {
  backdrop?: boolean
  children: React.ReactNode
  disableHide: boolean
  extraContent?: React.ReactNode
  selectedKey?: string
}

export const SideBarLayout = ({ backdrop, children, disableHide, extraContent }: SideBarLayoutProps) => {
  const [showSide, setShowSide] = useState(disableHide)
  const [showDisabledInfo, setShowDisabledInfo] = useState(false)
  const { user } = useUser()
  const permissions: string[] = []
  const navigate = useNavigate()

  const closeSide = () => {
    setShowSide(false)
  }

  const toggleSide = () => {
    setShowSide(!showSide)
  }

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.first}>
          <div className={styles.account_details}>
            <div>{getFirstTwoLetters(user?.username)}</div>
            <div>
              <div className={styles.username}>{user?.username}</div>
              <div className={styles.email}>{user?.email}</div>
            </div>
          </div>
          <div className={styles.settings} onClick={() => navigate('/settings/general')}>
            <Settings size={19} />
          </div>
        </div>
        <div>
          <BellRing size={22} />
        </div>
      </div>
      <div className={styles.sidebar_e_content}>
        <SideBar
          show={showSide}
          className={styles.LayoutSide}
          toggleSide={toggleSide}
          closeSide={closeSide}
          disableHide={disableHide}
        >
          {Object.entries(ROUTES.authenticatedRoutes)
            .filter(([_, v]) => v.menu)
            .map(([k, v]) =>
              hasPermission(permissions, v.permission) ? (
                <Link to={v.path} key={v.key}>
                  {v?.logo} {capitalise(k)}
                </Link>
              ) : (
                <div onClick={() => setShowDisabledInfo(true)} key={v.key}>
                  <Lock /> {capitalise(k)}
                </div>
              ),
            )}
        </SideBar>
        {showSide && backdrop && <Backdrop onClick={closeSide} />}
        <div className={styles.content}>
          <div className={styles.content_children}>{children}</div>
        </div>
      </div>
      <Modal
        isVisible={showDisabledInfo}
        width="md"
        handleClose={() => setShowDisabledInfo((prev) => !prev)}
      >
        You don't have permission to view this area. To do so, upgrade your plan
      </Modal>
      {extraContent}
    </div>
  )
}
