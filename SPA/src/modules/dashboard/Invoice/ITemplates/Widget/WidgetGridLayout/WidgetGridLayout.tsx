import ClassNames from 'classnames'
import { Fragment, useContext, useMemo, useRef } from 'react'

import { useAutoSave } from '_Home/common/hooks/useAutoSave'
import * as AllWidget from '..'

import { DragContext, DragStore, LayoutContext } from '../../context'
import { allWidgets } from '../constant'
import styles from './WidgetGridLayout.module.styl'

interface WidgetGridLayoutProps {
  settings: Settings | null
  applySettings: (settings: Partial<Settings>) => void
  containerRef: React.MutableRefObject<HTMLDivElement>
  handleSave: (e: string) => void
}

const WidgetGridLayout = ({
  settings,
  applySettings,
  containerRef,
  handleSave,
}: WidgetGridLayoutProps) => {
  const rectRef = useRef<SVGRectElement | SVGImageElement>(null)
  const { setActiveWidget } = useContext(DragContext)
  useAutoSave({ data: settings, interval: 3000, callback: handleSave })

  const onHandleDragOver = (e) => {
    e.preventDefault()
  }
  const saveWidgetChanges = (updatedWidgets: Settings['widgets']) => {
    applySettings({ widgets: updatedWidgets })
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
    const widgetId = `${newWidgetId}_${settings.widgets.length}_${Math.floor(
      Math.random() * settings.widgets.length,
    )}`
    applySettings({
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
    <LayoutProvider value={{ setSettings: saveWidgetChanges, settings: settings }}>
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

const ContextedWidgetGridLayout = ({
  settings,
  applySettings,
  containerRef,
  handleSave,
}: WidgetGridLayoutProps) => {
  return (
    <DragStore>
      <WidgetGridLayout
        settings={settings}
        applySettings={applySettings}
        containerRef={containerRef}
        handleSave={handleSave}
      />
    </DragStore>
  )
}
export default ContextedWidgetGridLayout
