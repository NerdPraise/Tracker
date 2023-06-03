import ClassNames from 'classnames'

import styles from './Card.styl'

export const Card = ({ headerClassname, className, title, children }) => {
  const childrenClassname = ClassNames(className, styles.CardContainer)
  const headerClasses = ClassNames(headerClassname, styles.cardHeader)
  return (
    <div className={childrenClassname}>
      {title && <div className={headerClasses}> {title}</div>}
      <div className="children">{children}</div>
    </div>
  )
}
