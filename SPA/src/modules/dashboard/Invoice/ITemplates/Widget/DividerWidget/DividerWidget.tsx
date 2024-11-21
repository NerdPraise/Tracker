import { Quote } from 'lucide-react'
import { useState } from 'react'

import { Popover } from '_Home/components'

import { BaseWidget } from '../BaseWidget'
import styles from './DividerWidget.module.styl'
import { ColorPicker } from '../components/ColorPicker'

interface DividerProps {
  name?: string
  color?: string
  widgetId: string
  layout: Layout
}

const defaults = {
  width: 150,
}

const DividerToolbar = ({
  color,
  setColor,
}: {
  setColor: React.Dispatch<React.SetStateAction<string>>
  color: string
}) => {
  return (
    <div className={styles.DividerToolbar}>
      <div>
        <ColorPicker color={color} setColor={(color) => setColor(color.hex)} />
        <Popover
          trigger={
            <div className={styles.trigger}>
              <Quote />
            </div>
          }
          item={<div></div>}
        />
      </div>
    </div>
  )
}

export const DividerWidget = (props: DividerProps) => {
  const [color, setColor] = useState<string>('#d2d5d9')
  const moveableProps = {
    renderDirections: ['w', 'e'],
  }

  return (
    <BaseWidget
      {...props}
      defaults={defaults}
      moveableProps={moveableProps}
      toolBar={<DividerToolbar color={color} setColor={setColor} />}
    >
      <div className={styles.DividerWidget} style={{ color: color, background: color }} />
    </BaseWidget>
  )
}
