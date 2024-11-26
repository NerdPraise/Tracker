import ClassNames from 'classnames'
import { memo } from 'react'
import Colorful from '@uiw/react-color-colorful'
import { Palette } from 'lucide-react'

import { type ColorResult } from '@uiw/color-convert'

import { Popover } from '_Home/components'

import styles from './components.module.styl'

interface ColorPickerProps {
  color?: string
  setColor: (color: ColorResult) => void
  iconSize?: number
  className?: string
  triggerClassName?: string
  icon?: React.ReactNode
}

export const ColorPicker = memo(
  ({ color, setColor, iconSize, className, triggerClassName, icon }: ColorPickerProps) => {
    return (
      <Popover
        side="top"
        className={ClassNames(className, styles.color_list)}
        trigger={
          <div className={ClassNames(styles.trigger, triggerClassName)}>
            {icon ? icon : <Palette size={iconSize} />}
          </div>
        }
        item={
          <div
            style={{
              padding: '12px 0px 12px 9px',
              margin: '0 5px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '5px',
              boxShadow:
                '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
            }}
          >
            <Colorful color={color} onChange={setColor} />
          </div>
        }
      />
    )
  },
)
