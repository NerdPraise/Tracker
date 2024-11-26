import { useRef } from 'react'

import LOGO from '_Images/useinvoice.svg'

import styles from './MobileView.module.styl'

const MobileView = () => {
  const refs = useRef<HTMLSpanElement[]>([])

  const setRef = (element, index) => {
    refs.current[index] = element
    element.style.setProperty('--i', `${index + 1}`)
  }

  return (
    <div className={styles.MobileView}>
      <div className={styles.logo}>
        <img id="full" src={LOGO} alt="LOGO" />
      </div>
      <div className={styles.container}>
        <p>Open on your desktop</p>
        <div className={styles.box}>
          <div>
            {Array(20)
              .fill(0)
              .map((item, ind) => (
                <span key={ind} ref={(el) => setRef(el, ind)}></span>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MobileView
