import ClassNames from 'classnames'
import { LoaderCircle } from 'lucide-react'
import Export from '_Images/export.svg?react'

import styles from './Button.module.styl'

interface ButtonProps {
  className?: string
  text?: ReactChildren
  onClick: VoidFunction
  loading?: boolean
  disabled?: boolean
  logo?: React.ReactElement
}

export const Button = ({ className, text, onClick, loading, disabled, logo }: ButtonProps) => {
  const Logo = logo

  return (
    <button
      onClick={!disabled ? onClick : null}
      disabled={disabled || loading}
      className={ClassNames(styles.Button, className, { disabled })}
    >
      {loading ? <LoaderCircle className={styles.loader} size={19} /> : logo}
      <p className={styles.text}>{text}</p>
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
