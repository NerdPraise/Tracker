import ClassNames from 'classnames'
import { useEffect, useState } from 'react'
import Circle from '@uiw/react-color-circle'
import { Component, Ellipsis, LayoutPanelLeft, Palette, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Spacer } from '_Home/components'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { allWidgets } from '../Widget/constant'
import { createCustomTemplates, updateTemplateSettings } from '../../redux/actions'
import WidgetGridLayout from '../Widget/WidgetGridLayout/WidgetGridLayout'

import styles from './CreateTemplate.module.styl'

interface CreateTemplateProps {
  onLayoutChange?: (...e: any) => void
}

const newSettingsTemp: Settings = {
  theme: {
    background: '#673ab7',
  },
  widgets: [
    {
      name: 'RichTextWidget',
      widgetId: 'RichTextWidget_0',
      layout: {
        left: 367,
        top: 13,
        height: 88,
        width: 323,
      },
      content: '<p><span style="font-size: 72px; font-family: rox">INVOICE</span></p>',
    },
    {
      name: 'RichTextWidget',
      widgetId: 'RichTextWidget_1',
      layout: {
        left: 25,
        top: 156,
        height: 93,
        width: 285,
      },
    },
    {
      name: 'RichTextWidget',
      widgetId: 'RichTextWidget_2',
      layout: {
        left: 325,
        top: 161,
        height: 53,
        width: 375,
      },
    },
    {
      name: 'RichTextWidget',
      widgetId: 'RichTextWidget_3',
      layout: {
        left: 45,
        top: 819,
        height: 73,
        width: 275,
      },
    },
  ],
}

const CreateTemplate = (props: CreateTemplateProps) => {
  const [panelKey, setPanelKey] = useState<string>('')
  // const [settings, setSettings] = useState<Settings>(newSettingsTemp)
  const { selectedTemplate } = useAppSelector((state) => state.invoices.template)
  const dispatch = useAppDispatch()
  const dispatchedCreateCustomTemplates = () => dispatch(createCustomTemplates())
  const { category, settings } = selectedTemplate || {}

  useEffect(() => {
    if (selectedTemplate && selectedTemplate?.category === 'custom') {
      // getTemplates
    } else {
      dispatchedCreateCustomTemplates()
    }
  }, [])

  const setSettings = (settings: Partial<Settings>) => {
    dispatch(updateTemplateSettings(settings))
  }

  const onMenuChange = (value: string) => {
    setPanelKey(value === panelKey ? '' : value)
  }

  const applySettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        applySettings({ theme: { background: '#fff', bgImg: reader.result as string } })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <SideBarLayout disableHide>
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
                      <p>INVOICE BACKGROUND</p>
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
                        color={settings.theme.background}
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
                        onChange={(color) => applySettings({ theme: { background: color.hex } })}
                      />
                    </div>
                    <div>OR</div>
                    <div className={styles.add_image}>
                      <label htmlFor="bg">
                        <input type="file" accept="image/*" id="bg" onChange={handleImageChange} />
                        <p>
                          <Plus size={15} />
                          Add Image
                        </p>
                      </label>
                    </div>
                  </div>
                )}
                {panelKey === 'elements' && (
                  <div className={styles.all_widget}>
                    {allWidgets.map((widget) => (
                      <div
                        key={widget.name}
                        id={widget.id}
                        className={ClassNames(widget.id, styles.widget_lone)}
                        draggable={true}
                        unselectable="on"
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', widget.id)
                        }}
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
        {settings && (
          <div style={{ height: '100%' }}>
            <WidgetGridLayout settings={settings as Settings} setSettings={applySettings} />
            <Spacer />
          </div>
        )}
      </div>
    </SideBarLayout>
  )
}

export default CreateTemplate
