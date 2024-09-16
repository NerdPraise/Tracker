import { ReactNode, forwardRef } from 'react'
import ClassNames from 'classnames'

import styles from './Card.module.styl'

interface CardProps {
  headerClassname?: string
  className?: string
  title?: string
  childrenClassName?: string
  children?: ReactNode
  onClick?: VoidFunction
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseLeave?: VoidFunction
}

export const Card = forwardRef(function Card(
  {
    headerClassname,
    className,
    childrenClassName,
    title,
    children,
    onClick,
    onMouseMove,
    onMouseLeave,
  }: CardProps,
  ref: React.MutableRefObject<any>,
) {
  const containerClassName = ClassNames(className, styles.CardContainer)
  const headerClasses = ClassNames(headerClassname, styles.cardHeader)
  const childrenClasses = ClassNames(childrenClassName, 'children')
  return (
    <div
      className={containerClassName}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      ref={ref}
    >
      {title && <div className={headerClasses}> {title}</div>}
      <div className={childrenClasses}>{children}</div>
    </div>
  )
})
