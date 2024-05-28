import ClassNames from 'classnames'
import { cloneElement } from 'react'
import Export from '_Images/export.svg?react'

import styles from './Button.module.styl'

interface ButtonProps {
  className?: string
  text?: string
  onClick: VoidFunction
  loading?: boolean
  disabled?: boolean
  logo?: React.ReactElement
  left?: boolean
}

export const Button = ({ className, text, onClick, loading, disabled, logo, left }: ButtonProps) => {
  const renderLogo = () => {
    const Logo = logo
    if (logo) {
      return cloneElement(Logo as React.ReactElement, {
        className: 'btn__logo',
      })
    }
    return null
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={ClassNames(styles.Button, className, { disabled })}
    >
      {left && renderLogo()}
      {text}
      {!left && renderLogo()}
    </button>
  )
}

interface ExportButtonProps {
  onClick: VoidFunction
  disabled?: boolean
  classname?: string
}

export const ExportButton = ({ onClick, disabled, classname }: ExportButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={ClassNames(styles.ExportButton, classname)}
      logo={<Export fill="white" />}
      disabled={disabled}
    />
  )
}
