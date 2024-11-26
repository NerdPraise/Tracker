import { Quote } from 'lucide-react'
import { useContext, useState } from 'react'

import { Popover } from '_Home/components'

import { BaseWidget } from '../BaseWidget'
import styles from './DividerWidget.module.styl'
import { ColorPicker } from '../components/ColorPicker'
import { LayoutContext } from '../../context'

interface DividerProps {
  name?: string
  color?: string
  widgetId: string
  layout: Layout
}

const defaults = {
  width: 150,
  color: '#000',
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
  const { setSettings, settings } = useContext(LayoutContext)
  const moveableProps = {
    renderDirections: ['w', 'e'],
  }

  const handleColorChange = (color: string) => {
    const updatedWidgetSettings = settings.widgets.map((item) =>
      item.widgetId === props.widgetId
        ? {
            ...item,
            color: color,
          }
        : item,
    )
    setSettings(updatedWidgetSettings)
  }

  return (
    <BaseWidget
      {...props}
      defaults={defaults}
      moveableProps={moveableProps}
      toolBar={<DividerToolbar color={props.color || defaults.color} setColor={handleColorChange} />}
    >
      <div className={styles.DividerWidget} style={{ background: props.color || defaults.color }} />
    </BaseWidget>
  )
}
