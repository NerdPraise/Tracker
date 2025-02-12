import { useEffect, useState } from 'react'
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs'
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router'
import { motion } from 'framer-motion'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import styles from './Settings.module.styl'

import GeneralSettings from './GeneralSettings'
import Billing from './Billing'
import InvoiceSettings from './InvoiceSettings'
import Subscription from './Subscription'

import { useTourContext } from '_Home/routing/context'

const tabs = [
  {
    name: 'General',
    component: <GeneralSettings />,
  },
  {
    name: 'Invoice',
    component: <InvoiceSettings />,
  },
  {
    name: 'Billing',
    component: <Billing />,
  },
  {
    name: 'Subscription',
    component: <Subscription />,
  },
]

const Settings = () => {
  const navigate = useNavigate()
  const {
    setState,
    state: { tourActive },
  } = useTourContext()
  const { pathname } = useLocation()
  const match = pathname.split('/')
  const [activeTab, setActiveTab] = useState<string>()

  const handleTabChange = (e) => {
    navigate(`/settings/${e}`)
    setActiveTab(e)
  }

  useEffect(() => {
    setActiveTab(match[match.length - 1] || 'general')
  }, [pathname])

  useEffect(() => {
    // Tour shenanigans
    if (tourActive) {
      setTimeout(() => {
        setState((prev) => ({ ...prev, run: true, stepIndex: 5 }))
      }, 600)
    }
  }, [])

  return (
    <SideBarLayout disableHide>
      <div className={styles.Settings}>
        <div className={styles.header}>
          <div>
            <h2 id="settings" className="text-2xl font-semibold">
              Settings
            </h2>
            <p>Manage your details and personal preferences here.</p>
          </div>
        </div>
        <div className="tabs_menu">
          <Root defaultValue="general" onValueChange={handleTabChange}>
            <List className={styles.tab_list}>
              {tabs.map((item) => (
                <Trigger className={styles.trigger} key={item.name} value={item.name.toLowerCase()}>
                  {activeTab === item.name.toLowerCase() && (
                    <motion.div layoutId="active" className={styles.active_cursor} />
                  )}
                  {item.name}
                </Trigger>
              ))}
            </List>
            {tabs.map((item) => (
              <Content value={item.name.toLowerCase()} key={item.name} className={styles.tab_content}>
                <Outlet />
              </Content>
            ))}
          </Root>
        </div>
      </div>
    </SideBarLayout>
  )
}
export default Settings
