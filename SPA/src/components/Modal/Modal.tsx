import ClassNames from 'classnames'
import { motion } from 'framer-motion'

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

const modalVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: '-100%' },
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
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={modalVariants}
            className={styles.modal}
            style={{ width: modalWidth }}
          >
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.modal_content}>{children}</div>
          </motion.div>
        </div>
      </Portal>
    )
  }
}
