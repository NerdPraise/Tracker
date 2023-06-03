import ClassNames from 'classnames'
import { useRef } from 'react'

import styles from './Input.styl'

export const Input = ({
  type,
  labelName,
  autoComplete,
  name,
  error,
  setError,
  onChange = null,
  className,
  customValidation = null,
}) => {
  const inputRef = useRef(null)

  const typeError = {
    email: 'Email provided is not valid',
    text: 'Info provided in the field is not valid',
    tel: 'Phone number format is incorrect',
    date: 'Incorrect Date',
    password: 'Password is not strong enough',
    other: 'Field data is incorrect or unexpected',
  }

  const onInputChange = (e) => {
    const { value } = e.target
    const isValid = validate(value)

    if (isValid && customValidation) {
      const errorMessage = customValidation(value)
      errorMessage && setError((prevState) => ({ ...prevState, [name]: errorMessage }))
    }
    if (isValid && onChange) {
      onChange(e)
    }
  }

  const validate = (value) => {
    let isValid = true
    if (!value) {
      setError((prevState) => ({ ...prevState, [name]: "Field can't be empty" }))
      return false
    }

    if (type === 'email') {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        isValid = false
      }
    } else if (type === 'password') {
    } else if (type === 'tel') {
    }

    if (!isValid) {
      setError((prevState) => ({ ...prevState, [name]: typeError[type] }))
      return false
    }
    setError('')
    return true
  }

  return (
    <div className={ClassNames(styles.Input, className)}>
      <label htmlFor={name}>{labelName}</label>
      <input
        ref={inputRef}
        name={name}
        onChange={onInputChange}
        type={type}
        autoComplete={autoComplete}
      />
      {error?.[name] && <div className="error">{error[name]}</div>}
    </div>
  )
}
