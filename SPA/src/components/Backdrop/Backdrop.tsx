import styles from './Backdrop.module.styl'

interface BackdropProps {
  onClick: VoidFunction
}

export const Backdrop = ({ onClick }: BackdropProps) => {
  return <div onClick={onClick} className={styles.backdrop} />
}
