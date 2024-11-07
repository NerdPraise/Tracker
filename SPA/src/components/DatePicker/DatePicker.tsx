import ClassNames from 'classnames'
import ReactDatePicker, { type DatePickerProps } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import styles from './DatePicker.module.styl'

type DatePickerExtendedProps = DatePickerProps & {
  label?: React.ReactNode
  className?: string
}

export const DatePicker = ({ label, className, ...props }: DatePickerExtendedProps) => {
  return (
    <div className={ClassNames(styles.DatePicker, className)}>
      {label && <label className={styles.form_label}>{label}</label>}
      <ReactDatePicker
        {...props}
        className={styles.input_date}
        calendarClassName={styles.calendarPicker}
      />
    </div>
  )
}
