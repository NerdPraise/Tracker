import styles from './Backdrop.styl'

export const Backdrop = ({ onClick }) => {
  return <div onClick={onClick} className={styles.backdrop} />
}
