import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

import LOGO from '_Images/useinvoice.png'

import styles from './Nav.module.styl'

const NavMenu = [
  { path: 'features', name: 'Features' },
  { path: 'pricing', name: 'Pricing' },
  { path: 'about', name: 'About' },
]

export const Nav = () => {
  const [lightMode, setLightMode] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const goToSection = (id: string) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  }
  const location = useLocation().hash

  const { scrollY } = useScroll()
  const width = useTransform(scrollY, [0, 200], ['100%', '70%'])
  const y = useTransform(scrollY, [0, 50], [0, 0])
  const borderRadius = useTransform(scrollY, [0, 200], ['0px', '15px'])
  const backgroundColor = useTransform(scrollY, [0, 200], ['transparent', '#181c1e'])
  const boxShadow = useTransform(scrollY, [0, 200], ['none', '0px 4px 10px rgba(0, 0, 0, 0.5)'])

  return (
    <motion.nav
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        width,
        borderRadius,
        backgroundColor,
        y,
        zIndex: 1000,
        padding: '0px 0px',
        boxShadow,
        transition: 'all 0.3s ease',
      }}
    >
      <div className={styles.Nav}>
        <div className={styles.logo}>
          <img src={LOGO} alt="LOGO" />
        </div>
        <div className={styles.hamburger} onClick={() => setIsMenuOpen((prev) => !prev)}>
          {isMenuOpen ? <X /> : <Menu />}
        </div>
        <div className={`${styles.nav_menu} ${isMenuOpen ? styles.show : styles.hide}`}>
          <ul>
            {NavMenu.map((item) => (
              <>
                <li>
                  {location.startsWith(`#${item.path}`) && (
                    <motion.li layoutId="active-menu" className={styles.active_menu} />
                  )}
                  <Link to={`#${item.path}`} onClick={() => goToSection(item.path)}>
                    {item.name}
                  </Link>
                </li>
              </>
            ))}
          </ul>
        </div>
        <div className={styles.nav_login}>
          <Link to="/login">Sign in</Link>
          <span style={{ cursor: 'pointer' }} onClick={() => setLightMode((prev) => !prev)}>
            {lightMode ? <Sun /> : <Moon />}
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
