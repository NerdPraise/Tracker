import ClassNames from 'classnames'
import { useEffect, useState } from 'react'
import Wheel from '@uiw/react-color-wheel'
import Circle from '@uiw/react-color-circle'
import { HsvaColor, hsvaToHex } from '@uiw/color-convert'
import { Component, Ellipsis, LayoutPanelLeft, Palette, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Layout } from 'react-grid-layout'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { GridLayout } from '_Home/components'

import * as AllWidget from '../Widget'
import { allWidgets } from '../Widget/constant'

import styles from './CreateTemplate.module.styl'

interface CreateTemplateProps {
  onLayoutChange?: (...e: any) => void
}

const settingsTemp = {
  settings: {
    layout: [],
    widgets: [],
  },
}

const CreateTemplate = (props: CreateTemplateProps) => {
  const [panelKey, setPanelKey] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<HsvaColor>({ a: 1, h: 0, s: 0, v: 100 })
  const [foregroundColor, setForegroundColor] = useState<HsvaColor>({ h: 3, s: 0, v: 0, a: 1 })
  const [settings, setSettings] = useState<{ layout: Layout[]; widgets: { [key: string]: string }[] }>(
    settingsTemp.settings,
  )
  const { layout, widgets } = settings

  const onMenuChange = (value: string) => {
    setPanelKey(value === panelKey ? '' : value)
  }
  const onDrop = (layout, layoutItem, _event) => {
    const widget = AllWidget[_event.dataTransfer.getData('text')]
    const { minWeight, defaults, defaultWidth, widgetId, minHeight } = widget
    const updatedWidgetId = `${widgetId}/${layout.length}`
    const newLayoutItem = {
      ...layoutItem,
      isResizable: true,
      minW: minWeight,
      w: defaultWidth,
      h: minHeight,
      i: updatedWidgetId,
    }
    setSettings((prev) => ({
      layout: [...prev.layout, newLayoutItem],
      widgets: [...prev.widgets, { widgetId: updatedWidgetId, ...defaults }],
    }))
  }

  const removeLayoutItem = (widgetId: string) => {
    const newLayout = settings.layout.filter((item) => item.i !== widgetId)
    console.log(newLayout, widgetId, settings.layout)
    setSettings((prev) => ({ ...prev, layout: newLayout }))
  }
  console.log(settings.layout)
  const onLayoutChange = (currentLayout: Layout[]) => {
    setSettings((prev) => ({ ...prev, layout: currentLayout }))
  }

  return (
    <SideBarLayout>
      <div className={styles.CreateTemplate}>
        <div className={styles.panel}>
          <div className={styles.panel_menu}>
            <li onClick={() => onMenuChange('color')}>
              <Palette />
              <p>Colors</p>
            </li>
            <li>
              <LayoutPanelLeft />
              <p>Layouts</p>
            </li>
            <li onClick={() => onMenuChange('elements')}>
              <Component />
              <p>Elements</p>
            </li>
            <li>
              <Palette />
            </li>
            <li>
              <Ellipsis />
            </li>
          </div>
          <AnimatePresence>
            {!!panelKey.length && (
              <motion.div
                key="menu"
                className={styles.panel_menu_items}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                {panelKey === 'color' && (
                  <div className={styles.colors}>
                    <div className={styles.colors_bg}>
                      <p>INVOICE COLOR</p>
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
                        color={backgroundColor}
                        className={styles.circle_color}
                        pointProps={{
                          style: {
                            marginRight: 12,
                            marginBottom: 10,
                            height: 25,
                            borderRadius: '50%',
                            border: '1px solid white',
                            width: 25,
                          },
                        }}
                        onChange={(color) => setBackgroundColor(color.hsva)}
                      />
                      {/* <Wheel
                    className={styles.color_wheel}
                    width={150}
                    height={150}
                    color={backgroundColor}
                    onChange={(color) => setBackgroundColor(color.hsva)}
                  /> */}
                    </div>

                    <div className="foreground">
                      <p>Foreground</p>
                      <Wheel
                        className={styles.color_wheel}
                        width={150}
                        height={150}
                        color={foregroundColor}
                        onChange={(color) => setForegroundColor(color.hsva)}
                      />
                    </div>
                  </div>
                )}
                {panelKey === 'elements' && (
                  <div className={styles.all_widget}>
                    {allWidgets.map((widget) => (
                      <div
                        key={widget.name}
                        id={widget.name}
                        className={ClassNames(widget.name, styles.widget_lone)}
                        draggable={true}
                        unselectable="on"
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', widget.name)}
                      >
                        <div className={styles.widget_logo}>
                          <img src={widget.logo} alt={widget.name} />
                        </div>
                        <p style={{ fontSize: 13, marginTop: 6 }}>{widget.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.template}>
          <div className={styles.background_s}>
            <svg
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: '0px',
                top: '0px',
                overflow: 'visible',
              }}
            >
              <rect
                id="background"
                x="0"
                y="0"
                width="700"
                height="100%"
                style={{ fill: hsvaToHex(backgroundColor) || 'rgb(255, 255, 255)' }}
              ></rect>
            </svg>
          </div>

          <GridLayout
            className={styles.layout}
            layout={layout}
            onDrop={onDrop}
            isDroppable
            onLayoutChange={onLayoutChange}
          >
            {widgets.map((widget) => {
              const widgetId = widget.widgetId.split('/')[0]
              const Component = AllWidget[widgetId]

              return (
                <div key={widget.widgetId} className={ClassNames(styles.widget_container)}>
                  <Component settings={{ ...widget }} />
                  <div className={styles.remove} onClick={() => removeLayoutItem(widget.widgetId)}>
                    <X />
                  </div>
                </div>
              )
            })}
          </GridLayout>
        </div>
      </div>
    </SideBarLayout>
  )
}

export default CreateTemplate
