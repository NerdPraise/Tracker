import React, { MouseEventHandler } from 'react'
import { useLocation, useNavigate } from 'react-router'
import ClassNames from 'classnames'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

import { useAppDispatch } from '_Home/common/hooks'
import { logOutAction } from '_Home/modules/authentication/Login/redux/actions'
import { ROUTES } from '_Home/routing/routes'

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
}

export const SideBar = ({
  children,
  position = 'left',
  show,
  toggleSide,
  closeSide,
  disableHide,
  className,
}: SideBarProps) => {
  const onChildClick = (callable: VoidFunction) => {
    callable()
    closeSide()
  }
  const location = useLocation().pathname
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const logOut = () => {
    dispatch(logOutAction())
    navigate(ROUTES.unauthenticatedRoutes.LOGIN.path)
  }

  return (
    <div
      className={ClassNames(className, styles.SideBar, {
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
        <ul>
          {show &&
            children?.map((child, ind) => {
              return (
                <React.Fragment key={`side ${ind}`}>
                  {location.startsWith(`/${child.props.to?.split('/')[1]}`) && (
                    <motion.li layoutId="active-pill" className={styles.active_cursor} />
                  )}
                  <li
                    onClick={disableHide ? child.props.onClick : () => onChildClick(child.props.onClick)}
                    className={ClassNames(styles.sidebar_child)}
                  >
                    {child}
                  </li>
                </React.Fragment>
              )
            })}
        </ul>

        <div className={styles.logout} onClick={logOut}>
          <LogOut size={19} />
          &nbsp; Log out
        </div>
      </div>
    </div>
  )
}
