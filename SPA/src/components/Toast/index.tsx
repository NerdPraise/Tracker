import { useEffect, useState } from 'react'
import ClassNames from 'classnames'
import { X } from 'lucide-react'

import { Portal } from '../Portal/Portal'

import style from './Toast.module.styl'

export type ToastLevel = 'alert' | 'success' | 'error'
export interface ToastProps {
  message: string | undefined
  level: ToastLevel
  onClear?: VoidFunction
}

export const Toast = ({ message, level, onClear }: ToastProps) => {
  const [ownMessage, setOwnMessage] = useState(message)

  useEffect(() => {
    setOwnMessage(message)
  }, [message])

  useEffect(() => {
    const interval = setInterval(deleteToast, 3000)
    return () => clearInterval(interval)
  }, [ownMessage])

  const deleteToast = () => {
    setOwnMessage('')
    onClear?.()
  }

  return (
    <Portal>
      {!!ownMessage && (
        <div className={ClassNames(style.Toast)}>
          <div className={ClassNames(style.toast, level)}>
            <div className={style.toast_message}>{message}</div>
            <div className={style.cancel_btn} onClick={deleteToast}>
              <X size={15} />
            </div>
          </div>
        </div>
      )}
    </Portal>
  )
}
