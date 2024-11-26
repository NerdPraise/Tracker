import ClassNames from 'classnames'

import type { PlaceholderProps } from './Placeholder'

import ChartImg from '_Images/chart-mask.svg'

import { Placeholder } from './Placeholder'
import styles from './Placeholder.module.styl'

interface ChartPlaceholderProps extends PlaceholderProps {
  className?: string
}

export const ChartPlaceholder = ({ className, width, height }: ChartPlaceholderProps) => {
  return (
    <div className={ClassNames(className, styles.ChartPlaceholder)}>
      <img id="full" src={ChartImg} alt="chart-placeholder" />
      <Placeholder width={width} height={height} />
    </div>
  )
}
