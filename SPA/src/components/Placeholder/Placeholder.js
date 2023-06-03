import styles from './Placeholder.styl'

export const Placeholder = ({ width, height }) => {
  const style = {
    width,
    height,
  }
  return <div style={style} className={styles.PlaceholderCont}></div>
}
