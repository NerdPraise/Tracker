import { ReactNode } from 'react'
import ClassNames from 'classnames'

import styles from './Card.module.styl'

interface CardProps {
  headerClassname?: string
  className?: string
  title?: string
  childrenClassName?: string
  children?: ReactNode
  onClick?: VoidFunction
}

export const Card = ({
  headerClassname,
  className,
  childrenClassName,
  title,
  children,
  onClick,
}: CardProps) => {
  const containerClassName = ClassNames(className, styles.CardContainer)
  const headerClasses = ClassNames(headerClassname, styles.cardHeader)
  const childrenClasses = ClassNames(childrenClassName, 'children')
  return (
    <div className={containerClassName} onClick={onClick}>
      {title && <div className={headerClasses}> {title}</div>}
      <div className={childrenClasses}>{children}</div>
    </div>
  )
}
