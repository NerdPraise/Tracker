import styles from './Placeholder.module.styl'

export interface PlaceholderProps {
  width: number | string
  height: number | string
}

export const Placeholder = ({ width, height }: PlaceholderProps) => {
  const style = {
    width,
    height,
  }
  return <div style={style} className={styles.PlaceholderCont}></div>
}
