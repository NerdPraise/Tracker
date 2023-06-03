import ClassNames from 'classnames'

import styles from './Divider.styl'

export const Divider = ({ className }) => {
  return <div className={ClassNames(className, styles.divider)} />
}
