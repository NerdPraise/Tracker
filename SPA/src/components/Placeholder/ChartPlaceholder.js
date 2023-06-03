import ClassNames from 'classnames'

import ChartImg from '_Images/chart-mask.svg'

import { Placeholder } from './Placeholder'
import styles from './Placeholder.styl'

export const ChartPlaceholder = ({ className, width, height }) => {
  return (
    <div className={ClassNames(className, styles.ChartPlaceholder)}>
      <img src={ChartImg} alt="chart-placeholder" />
      <Placeholder width={width} height={height} />
    </div>
  )
}
