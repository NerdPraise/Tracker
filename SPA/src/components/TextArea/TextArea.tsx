import ClassNames from 'classnames'
import { ChangeEvent, useRef } from 'react'
import { omit } from 'lodash'

import styles from './TextArea.module.styl'

interface TextAreaProps {
  labelName?: Exclude<ReactChildren, () => JSX.Element>
  name: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  defaultValue?: string | number
  value?: string | number
  // customValidation requires the proceeding two
  customValidation?: (value: string | number) => null | string
  error?: Record<string, string>
  setError?: React.Dispatch<React.SetStateAction<Record<string, string>>>
  rows: number
  cols: number
  placeholder?: string
}

export const TextArea = ({
  labelName,
  name,
  onChange,
  rows,
  cols,
  className,
  setError = null,
  error = null,
  defaultValue,
  placeholder,
  ...props
}: TextAreaProps) => {
  const onTAChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (setError) {
      const { value } = e.target
      validate(value)
    }
    onChange?.(e)
  }

  const validate = (value) => {
    if (!value) {
      // eslint-disable-next-line quotes
      setError((prevState) => ({ ...prevState, [name]: "Field can't be empty" }))
      return false
    }
    return true
  }
  return (
    <div className={ClassNames(styles.TextArea, className)}>
      <label htmlFor={name}>{labelName}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={onTAChange}
        onBlur={onTAChange}
        defaultValue={defaultValue}
        rows={rows}
        cols={cols}
        {...props}
      />
      {error?.[name] && <div className={styles.error}>{error[name]}</div>}
    </div>
  )
}
