import ClassNames from 'classnames'

import { Portal } from '../Portal/Portal'

import styles from './Modal.styl'

export const Modal = ({ isVisible, title, width, className, children, handleClose }) => {
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
          <div className="backdrop" onClick={handleClose}></div>
          <div className="modal" style={{ width: modalWidth }}>
            {title && <div className="title">{title}</div>}
            <div className="modal-content">{children}</div>
          </div>
        </div>
      </Portal>
    )
  }
}
