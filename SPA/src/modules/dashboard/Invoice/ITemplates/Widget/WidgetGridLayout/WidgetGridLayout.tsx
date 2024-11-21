import ClassNames from 'classnames'
import { Fragment, useContext, useMemo, useRef } from 'react'

import { useAutoSave } from '_Home/common/hooks/useAutoSave'
import { useAppDispatch } from '_Home/common/hooks'
import * as AllWidget from '..'

import styles from './WidgetGridLayout.module.styl'
import { DragContext, DragStore, LayoutContext } from '../../context'
import { allWidgets } from '../constant'
import { saveCustomTemplates } from '../../../redux/actions'

interface WidgetGridLayoutProps {
  settings: Settings | null
  setSettings: (settings: Partial<Settings>) => void
}

const WidgetGridLayout = ({ settings, setSettings }: WidgetGridLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<SVGRectElement | SVGImageElement>(null)
  const { setActiveWidget } = useContext(DragContext)
  const dispatch = useAppDispatch()
  const dispatchSaveTemplateToDB = (data) => dispatch(saveCustomTemplates())
  useAutoSave({ data: settings, interval: 3000, callback: dispatchSaveTemplateToDB })

  const onHandleDragOver = (e) => {
    e.preventDefault()
  }
  const saveSettings = (updatedWidgets: Settings['widgets']) => {
    setSettings({ ...settings, widgets: updatedWidgets })
  }

  const renderInvoiceBg = useMemo(() => {
    if (settings.theme.bgImg) {
      return <image href={settings.theme.bgImg} height="100%" width="700" ref={rectRef} fill="#fff" />
    }
    return (
      <rect
        ref={rectRef}
        id="background"
        x="0"
        y="0"
        width="700"
        height="100%"
        style={{
          fill: settings.theme.background,
        }}
      />
    )
  }, [settings.theme.background])

  const onDrop = (e) => {
    e.preventDefault()
    const newWidgetId = e.dataTransfer.getData('text')
    if (!allWidgets.filter((item) => newWidgetId === item.id).length) {
      return
    }
    const { clientX, clientY } = e
    const { left, top } = containerRef.current.getBoundingClientRect()
    const positionX = clientX - left
    const positionY = clientY - top
    const widgetId = `${newWidgetId}_${settings.widgets.length}`
    setSettings({
      ...settings,
      widgets: [
        ...settings?.widgets,
        {
          name: newWidgetId,
          widgetId: widgetId,
          layout: {
            left: positionX,
            top: positionY,
          },
        },
      ],
    })
    setActiveWidget(widgetId)
  }
  const LayoutProvider = LayoutContext.Provider

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === rectRef.current) {
      setActiveWidget('')
    }
  }

  return (
    <LayoutProvider value={{ setSettings: saveSettings, settings: settings }}>
      <div className={styles.WidgetGridLayout}>
        <div
          className={ClassNames(styles.template, 'widgetContainer')}
          onDrop={onDrop}
          onDragOver={onHandleDragOver}
          ref={containerRef}
          onClick={handleClick}
        >
          <div className={styles.background_s}>
            <svg
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: '0px',
                top: '0px',
                overflow: 'visible',
                fill: '#fff',
              }}
            >
              {renderInvoiceBg}
            </svg>
          </div>
          <div className={styles.all_widgets}>
            {settings.widgets.map((widget, ind) => {
              const Component = AllWidget[widget.name]

              return (
                <Fragment key={`${widget.name}/${ind}`}>
                  <Component {...widget} />
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </LayoutProvider>
  )
}

const ContextedWidgetGridLayout = ({ settings, setSettings }: WidgetGridLayoutProps) => {
  return (
    <DragStore>
      <WidgetGridLayout settings={settings} setSettings={setSettings} />
    </DragStore>
  )
}
export default ContextedWidgetGridLayout
