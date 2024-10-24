import { useState } from 'react'
import { SprayCan } from 'lucide-react'
import Circle from '@uiw/react-color-circle'

import { Select, HoverCard } from '_Home/components'

import { BaseWidget } from '../BaseWidget'
import styles from './TextWidget.module.styl'

interface TextWidgetProps {
  settings: {
    fontSize: string
    fontWeight: 'normal' | 'bold' | 'thin'
    italic?: boolean
    underline?: boolean
    color: string
    widgetId: string
  }
  children: React.ReactNode
}

const fontSizes = [
  { label: '8', value: '8px' },
  { label: '10', value: '10px' },
  { label: '11', value: '11px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '22', value: '22px' },
  { label: '30', value: '30px' },
  { label: '32', value: '32px' },
  { label: '64', value: '64px' },
  { label: '70', value: '70px' },
]

const fontVariant = [
  { label: 'Select Variant', value: '' },
  { label: 'Header', value: 'header' },
  { label: 'Title', value: 'title' },
  { label: 'Label', value: 'label' },
]

const fontVariantTemp = {
  header: {
    fontSize: '64px',
    fontWeight: 'bold',
    italic: false,
  },
  title: {
    fontSize: '30px',
    fontWeight: '100',
    italic: false,
  },
  label: {
    fontSize: '12px',
    fontWeight: '100',
    italic: true,
  },
}

export const TextWidget = ({ settings, ...rest }: TextWidgetProps) => {
  const [settingsToApply, setSettingsToApply] = useState(settings)
  const [showColor, setShowColor] = useState<boolean>(false)

  const onChange = (payload: Partial<typeof settings>) => {
    setSettingsToApply((prev) => ({ ...prev, ...payload }))
  }
  const applySettings = (key: string) => {
    onChange(fontVariantTemp[key])
  }

  const toggleStyle = (style: keyof TextWidgetProps['settings']) => {
    onChange({ [style]: !settingsToApply[style] })
  }
  const defaultFont = settingsToApply.fontSize
    ? fontSizes.filter((item) => item.value === settingsToApply.fontSize)
    : fontSizes[0]

  const toolBar = (
    <div className={styles.toolBar}>
      <div className={styles.font_variant}>
        <Select
          options={fontVariant}
          defaultValue={fontVariant[0]}
          className={styles.select}
          onChange={(e) => applySettings(e)}
          styles={{
            indicatorSeparator: (provided) => ({
              ...provided,
              display: 'none',
            }),
            input: (provided) => ({
              ...provided,
              fontSize: '12px',
            }),
            menuList: (provided) => ({
              ...provided,
              fontSize: '12px',
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              padding: 0,
            }),
          }}
        />
      </div>
      <div className={styles.font_bar}>
        <div
          onClick={() =>
            onChange({ fontWeight: settingsToApply.fontWeight === 'bold' ? 'normal' : 'bold' })
          }
        >
          <b>B</b>
        </div>
        <div onClick={() => toggleStyle('italic')}>
          <i>I</i>
        </div>
        <div onClick={() => toggleStyle('underline')}>
          <u>U</u>
        </div>
        <div>
          X <sub>2</sub>
        </div>
        <div>
          X <sup>2</sup>
        </div>
      </div>
      <div className={styles.function_bar}>
        <div className={styles.color_wheel} onClick={() => setShowColor(!showColor)}>
          <SprayCan stroke={settingsToApply.color} />
        </div>
        <HoverCard
          side="top"
          open={showColor}
          className={styles.color_list}
          trigger={<div></div>}
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
              <Circle
                colors={[
                  '#fff',
                  '#000',
                  '#f44336',
                  '#e91e63',
                  '#9c27b0',
                  '#673ab7',
                  '#3f51b5',
                  '#2196f3',
                ]}
                color={settingsToApply?.color}
                className={styles.circle_color}
                pointProps={{
                  style: {
                    marginRight: 12,
                    height: 25,
                    borderRadius: '50%',
                    border: '1px solid #00000030',
                    width: 25,
                  },
                }}
                onChange={(color) => onChange({ color: color.hex })}
              />
            </div>
          }
        />
        <div>
          <Select
            options={fontSizes}
            defaultValue={defaultFont}
            className={styles.select}
            onChange={(e) => onChange({ fontSize: e })}
            styles={{
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
            }}
          />
        </div>
      </div>
    </div>
  )

  return (
    <BaseWidget {...rest} toolBar={toolBar} widgetId={settings.widgetId}>
      <div className={styles.TextWidget}>
        <div
          contentEditable
          style={{
            ...settingsToApply,
            textDecoration: settingsToApply.underline ? 'underline' : undefined,
            fontStyle: settingsToApply.italic ? 'italic' : undefined,
          }}
        ></div>
      </div>
    </BaseWidget>
  )
}

TextWidget.widgetId = 'TextWidget'
TextWidget.defaultWidth = 5
TextWidget.minWidth = 2
TextWidget.minHeight = 2
TextWidget.defaults = {
  fontSize: '32px',
  fontWeight: 'normal',
  italic: false,
  underline: false,
}
