import ClassNames from 'classnames'

import { Portal } from '../Portal/Portal'

import styles from './Modal.module.styl'

interface ModalProps {
  isVisible: boolean
  title?: string
  width: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  handleClose: VoidFunction
}
export const Modal = ({ isVisible, title, width, className, children, handleClose }: ModalProps) => {
  const modalWidth = {
    sm: '300px',
    md: '600px',
    lg: '1100px',
  }[width]

  if (!isVisible) {
    return null
  }

  if (isVisible) {
    return (
      <Portal>
        <div className={ClassNames(styles.Modal, className)}>
          <div className={styles.backdrop} onClick={handleClose}></div>
          <div className={styles.modal} style={{ width: modalWidth }}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.modal_content}>{children}</div>
          </div>
        </div>
      </Portal>
    )
  }
}
