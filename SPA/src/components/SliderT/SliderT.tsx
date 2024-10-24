import * as Slider from '@radix-ui/react-slider'
import ClassNames from 'classnames'

import styles from './SliderT.module.styl'

interface SliderTProps {
  defaultValue: number
  max: number
  step: number
  min: number
  onValueChange: (e: number[]) => void
  rootClassName?: string
  thumbClassName?: string
  value?: number
  rangeClassName?: string
}

export const SliderT = ({
  defaultValue,
  max,
  step,
  min,
  onValueChange,
  rootClassName,
  value,
  thumbClassName,
  rangeClassName,
}: SliderTProps) => (
  <form>
    <Slider.Root
      className={ClassNames(styles.Root, rootClassName)}
      onValueChange={onValueChange}
      defaultValue={[defaultValue]}
      min={min}
      max={max}
      step={step}
      value={[value]}
    >
      <Slider.Track className={styles.Track}>
        <Slider.Range className={ClassNames(styles.Range, rangeClassName)} />
      </Slider.Track>
      <Slider.Thumb className={ClassNames(styles.Thumb, thumbClassName)} aria-label="Volume" />
    </Slider.Root>
  </form>
)
