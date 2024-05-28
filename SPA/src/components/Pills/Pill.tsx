import ClassNames from 'classnames'

import styles from './Pill.module.styl'

interface PillProps {
  label: string
  className?: string
  click: VoidFunction
  selected?: boolean
}

export const Pill = ({ label, className, click, selected }: PillProps) => {
  return (
    <div onClick={click} className={ClassNames(styles.Pill, className, { active: selected })}>
      {label}
    </div>
  )
}
