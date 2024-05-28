import ClassNames from 'classnames'
import ReactSelect, { GroupBase, Props } from 'react-select'
import { omit } from 'lodash'

import style from './Select.module.styl'
interface SelectProp {
  label: Exclude<ReactChildren, () => JSX.Element>
  onChange?: (e) => void
  customValidation?: (value: string) => null | string
  error?: Record<string, string>
  setError?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const customStyles = {
  container: (base) => ({
    ...base,
    ':focus-visible': {
      outline: 'none',
    },
  }),
  control: (base) => ({
    ...base,
    height: 35,
  }),
  input: (provided) => ({
    ...provided,
    height: '100%',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '100%',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '35px',
  }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#181c1f' : isFocused ? '#181c1f' : undefined,
      ':active': {
        ...styles[':active'],
        backgroundColor: '#474747',
      },
    }
  },
}

export const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  className,
  name,
  label,
  onChange,
  customValidation = null,
  setError = null,
  error = null,
  ...props
}: Props<Option, IsMulti, Group> & SelectProp) => {
  const validate = (value: string) => {
    let errorMessage = null
    if (setError) {
      if (!value) {
        errorMessage = 'Please select out of given options'
      }
      if (!errorMessage && customValidation) {
        errorMessage = customValidation?.(value)
      }
      if (errorMessage) {
        setError((prevState) => ({ ...prevState, [name]: errorMessage }))
        return
      }
      setError((prevState) => omit(prevState, [name]))
    }
  }
  const changeHandler = (e) => {
    validate(e.value)
    onChange?.(e.value)
  }

  return (
    <div className={ClassNames(className, style.Select)}>
      <label className={style.form_label}>{label}</label>
      <ReactSelect
        name={name}
        {...props}
        classNamePrefix="select"
        onChange={changeHandler}
        styles={{ ...customStyles, ...props.styles }}
      />
      {error?.[name] && <span className="error">{error[name]}</span>}
    </div>
  )
}
