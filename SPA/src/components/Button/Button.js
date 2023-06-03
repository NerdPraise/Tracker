import ClassNames from 'classnames'

import styles from './Button.styl'

export const Button = ({ className, text, onClick, loading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={ClassNames(styles.Button, className, { disabled })}
    >
      {text}
    </button>
  )
}
