import ClassNames from 'classnames'

import styles from './Divider.module.styl'

interface DividerProps {
  className?: string
}

export const Divider = ({ className }: DividerProps) => {
  return <div className={ClassNames(className, styles.divider)} />
}
