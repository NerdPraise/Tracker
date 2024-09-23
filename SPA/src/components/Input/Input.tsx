import ClassNames from 'classnames'
import { debounce as debounceFunc } from 'lodash'
import { ChangeEvent, useRef } from 'react'
import { omit } from 'lodash'

import styles from './Input.module.styl'

const typeError = {
  email: 'Email provided is not valid',
  text: 'Info provided in the field is not valid',
  tel: 'Phone number format is incorrect',
  date: 'Incorrect Date',
  password: 'Password is not strong enough',
  other: 'Field data is incorrect or unexpected',
}

interface InputProps {
  type: string
  labelName?: Exclude<ReactChildren, () => JSX.Element>
  autoComplete?: React.HTMLInputAutoCompleteAttribute
  name: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  defaultValue?: string | number
  value?: string | number
  icon?: Exclude<ReactChildren, () => JSX.Element>
  max?: number | string | undefined
  min?: number | string | undefined
  maxlength?: number
  placeholder?: string
  disabled?: boolean
  debounce?: boolean
  // customValidation requires the proceeding two
  customValidation?: (value: string | number) => null | string
  error?: Record<string, string>
  setError?: React.Dispatch<React.SetStateAction<Record<string, string>>>
  iconStyle?: React.CSSProperties
}

export const Input = ({
  type,
  labelName,
  autoComplete,
  debounce,
  name,
  onChange,
  className,
  customValidation = null,
  setError = null,
  error = null,
  defaultValue,
  disabled,
  icon,
  iconStyle,
  placeholder,
  ...props
}: PickProps<React.HTMLAttributes<HTMLInputElement>, InputProps>) => {
  const inputRef = useRef(null)
  // const [error, setError] = useState<Record<string, string | boolean>>()

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setError) {
      const { value } = e.target
      const isValid = validate(value)
      // Validate only if error and setError are defined
      if (isValid && customValidation) {
        const errorMessage = customValidation(value)
        errorMessage && setError((prevState) => ({ ...prevState, [name]: errorMessage }))
      }
    }
    if (debounce) {
      debounceFunc(() => onChange?.(e), 1500)()
    } else {
      onChange?.(e)
    }
  }

  const validate = (value) => {
    let isValid = true
    if (!value) {
      // eslint-disable-next-line quotes
      setError((prevState) => ({ ...prevState, [name]: "Field can't be empty" }))
      return false
    }

    if (type === 'email') {
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        isValid = false
      }
    } else if (type === 'password') {
    } else if (type === 'tel') {
    }

    if (!isValid) {
      setError((prevState) => ({ ...prevState, [name]: typeError[type] }))
      return false
    }
    setError((prevState) => omit(prevState, [name]))
    return true
  }
  return (
    <div className={ClassNames(styles.Input, className)}>
      <label htmlFor={name}>{labelName}</label>
      <div className={styles.input_container}>
        {icon && (
          <div className={styles.icon} style={iconStyle}>
            {icon}
          </div>
        )}
        <input
          className={ClassNames({ [styles.has_icon]: icon })}
          ref={inputRef}
          name={name}
          onChange={onInputChange}
          type={type}
          disabled={disabled}
          autoComplete={autoComplete}
          onBlur={onInputChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error?.[name] && <div className={styles.error}>{error[name]}</div>}
    </div>
  )
}
