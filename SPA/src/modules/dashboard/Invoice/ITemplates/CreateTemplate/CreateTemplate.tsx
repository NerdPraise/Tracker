import { useParams } from 'react-router'
import ClassNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Circle from '@uiw/react-color-circle'
import { Component, Ellipsis, LayoutPanelLeft, Lock, Palette, Plus, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Spacer } from '_Home/components'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { screenshotElement } from '_Home/common/utils'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { allWidgets } from '../Widget/constant'
import {
  createCustomTemplates,
  saveCustomTemplates,
  setSelectedTemplate,
  updateTemplateSettings,
} from '../../redux/actions'
import WidgetGridLayout from '../Widget/WidgetGridLayout/WidgetGridLayout'
import { ColorPicker } from '../Widget/components/ColorPicker'

import styles from './CreateTemplate.module.styl'

interface CreateTemplateProps {
  onLayoutChange?: (...e: any) => void
}

const CreateTemplate = (props: CreateTemplateProps) => {
  const templateContainerRef = useRef<HTMLDivElement>(null)
  const [panelKey, setPanelKey] = useState<string>('')
  const { selectedTemplate } = useAppSelector((state) => state.invoices.template)
  const dispatch = useAppDispatch()
  const dispatchedCreateCustomTemplates = () => dispatch(createCustomTemplates())
  const dispatchSaveTemplateToDB = () => dispatch(saveCustomTemplates())
  const dispatchedUpdateTemplateSettings = (e: Partial<ITemplate>) =>
    dispatch(updateTemplateSettings({ ...e }))
  const settings = selectedTemplate?.settings as Settings | undefined
  const { templateId } = useParams()

  useEffect(() => {
    if (!templateId) {
      dispatchedCreateCustomTemplates()
    }
  }, [])

  const handleManualSave = () => {
    screenshotElement(templateContainerRef, (e: string) => {
      dispatchedUpdateTemplateSettings({ customImage: e })
      dispatchSaveTemplateToDB()
    })
  }

  const saveReduxSettings = (settings: Settings) => {
    dispatchedUpdateTemplateSettings({ settings })
  }
  const applySettings = (newSettings: Partial<Settings>) => {
    saveReduxSettings({ ...settings, ...newSettings })
  }

  const onMenuChange = (value: string) => {
    setPanelKey(value === panelKey ? '' : value)
  }

  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        applySettings({
          theme: { background: '#fff', bgImg: reader.result as string },
        })
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
                      <ColorPicker
                        setColor={(color) => applySettings({ theme: { background: color.hex } })}
                        color={settings.theme?.background}
                        triggerClassName={styles.template_trigger}
                      />
                    </div>
                    <div>OR</div>
                    <div className={styles.add_image}>
                      <label htmlFor="bg">
                        <input
                          type="file"
                          accept="image/*"
                          id="bg"
                          onChange={handleBackgroundImageChange}
                        />
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
                          <img id="full" src={widget.logo} alt={widget.name} />
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
            <WidgetGridLayout
              settings={settings}
              applySettings={applySettings}
              containerRef={templateContainerRef}
              handleSave={handleManualSave}
            />
            <Spacer />
          </div>
        )}
        <div className={styles.toolbar}>
          <div onClick={handleManualSave}>
            <Save />
          </div>
          <div>
            <Lock />
          </div>
        </div>
      </div>
    </SideBarLayout>
  )
}

export default CreateTemplate
