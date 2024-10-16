import { useState } from 'react'
import { Component, Ellipsis, LayoutPanelLeft, Palette } from 'lucide-react'
import Wheel from '@uiw/react-color-wheel'
import { HsvaColor, hsvaToHex } from '@uiw/color-convert'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { GridLayout } from '_Home/components'

import { TextWidget } from '../Widget/TextWidget'

import styles from './CreateTemplate.module.styl'

interface CreateTemplateProps {}

const CreateTemplate = (props: CreateTemplateProps) => {
  const [panelKey, setPanelKey] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<HsvaColor>({ h: 214, s: 43, v: 90, a: 1 })
  const [foregroundColor, setForegroundColor] = useState<HsvaColor>({ h: 3, s: 0, v: 0, a: 1 })

  return (
    <SideBarLayout>
      <div className={styles.CreateTemplate}>
        <div className={styles.panel}>
          <div className={styles.panel_menu}>
            <li onClick={() => setPanelKey('color')}>
              <Palette />
              <p>Colors</p>
            </li>
            <li>
              <LayoutPanelLeft />
              <p>Layouts</p>
            </li>
            <li>
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
          <div className={styles.panel_menu_items}>
            {panelKey === 'color' && (
              <div className={styles.colors}>
                <div className="background">
                  <p>Background</p>
                  <Wheel
                    className={styles.color_wheel}
                    width={150}
                    height={150}
                    color={backgroundColor}
                    onChange={(color) => setBackgroundColor(color.hsva)}
                  />
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
          </div>
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
          <GridLayout className={styles.layout} layout={[{ i: 'Base', x: 1, y: 3, w: 12, h: 5 }]}>
            <TextWidget key="Base" fontSize={16} />
            {/* <div key="a" className={styles.widget} data-grid={{ x: 0, y: 0, w: 12, h: 3 }}>
              <svg
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  left: '0px',
                  top: '0px',
                  overflow: 'visible',
                  zIndex: 0,
                }}
              >
                <rect
                  id="background"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  style={{ fill: 'yellowgreen' }}
                ></rect>
              </svg>
              <div className={styles.header} style={{ zIndex: 2, position: 'relative' }}>
                <p contentEditable>sww</p>
              </div>
            </div> */}
          </GridLayout>
        </div>
      </div>
    </SideBarLayout>
  )
}

export default CreateTemplate
