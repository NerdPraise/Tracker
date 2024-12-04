import { X } from 'lucide-react'
import { useContext, useRef } from 'react'
import ClassNames from 'classnames'
import Moveable, { OnDragEnd, type MoveableProps } from 'react-moveable'

import { HoverCard } from '_Home/components'

import { DragContext, LayoutContext } from '../context'
import styles from './BaseWidget.module.styl'

interface BaseWidgetProps {
  key?: string
  className?: string
  children: ReactChildren
  toolBar?: ReactChildren
  widgetId: string
  moveableProps?: MoveableProps
  defaults: Partial<Layout>
  layout: Layout
}

export const BaseWidget = ({
  className,
  children,
  toolBar,
  widgetId,
  layout,
  moveableProps,
  defaults,
  ...props
}: BaseWidgetProps) => {
  const { isDragging, activeWidget, setActiveWidget, setIsDragging } = useContext(DragContext)
  const { setSettings, settings } = useContext(LayoutContext)
  const ref = useRef()

  const onFocusHandler = () => {
    setActiveWidget(widgetId)
  }
  const isWidgetActive = activeWidget === widgetId
  const handleClick = () => {
    setActiveWidget(widgetId)
  }

  const handleRemove = () => {
    const updatedWidgets = settings.widgets.filter((item) => item.widgetId !== widgetId)
    console.log(settings, widgetId, updatedWidgets)
    setSettings(updatedWidgets)
  }

  const handleDrag = (e: OnDragEnd) => {
    setIsDragging(false)
    if (e.lastEvent) {
      const [dx, dy, ...rest] = e.lastEvent?.beforeTranslate
      const updatedFields = {
        left: layout.left + dx,
        top: layout.top + dy,
      }
      applyNewLayout(updatedFields)
      e.target.style.left = `${layout.left + dx}px`
      e.target.style.top = `${layout.top + dy}px`
      e.target.style.transform = 'translate(0, 0)'
    }
  }

  const applyNewLayout = (changedLayout: Partial<Layout>) => {
    const updatedSettings = settings.widgets.map((item) =>
      item.widgetId === widgetId ? { ...item, layout: { ...layout, ...changedLayout } } : item,
    )
    setSettings(updatedSettings)
  }

  return (
    <>
      <div
        className={ClassNames(widgetId, styles.BaseWidget, className)}
        onClick={handleClick}
        {...props}
        style={{
          position: 'absolute',
          top: `${layout.top}px`,
          left: `${layout.left}px`,
          width: `${layout.width || defaults?.width}px`,
          height: `${layout.height || defaults?.height}px`,
        }}
        onFocus={onFocusHandler}
      >
        {isWidgetActive && (
          <div className={styles.remove} onClick={handleRemove}>
            <X size={14} />
          </div>
        )}
        {!isDragging && (
          <HoverCard side="top" open={isWidgetActive} trigger={<div />} item={toolBar} sideOffset={10} />
        )}
        {children}
      </div>

      <Moveable
        ref={ref}
        target={isWidgetActive ? `.${widgetId}` : ''}
        draggable={isWidgetActive}
        snappable={isWidgetActive}
        resizable={isWidgetActive}
        className={styles.moveable}
        throttleDrag={1}
        edgeDraggable={true}
        startDragRotate={0}
        throttleDragRotate={0}
        keepRatio={false}
        origin={false}
        checkInput={false}
        useResizeObserver
        useMutationObserver
        snapContainer=".widgetContainer"
        throttleResize={1}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        onDragEnd={handleDrag}
        onResizeEnd={(e) => {
          applyNewLayout({ height: e.lastEvent.height, width: e.lastEvent.width })
        }}
        onDrag={(e) => {
          setIsDragging(true)
          const [dx, dy, ...rest] = e.beforeTranslate
          e.target.style.left = `${layout.left + dx}px`
          e.target.style.top = `${layout.top + dy}px`
          e.target.style.transform = 'translate(0, 0)'
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width < defaults?.width ? defaults.width : e.width}px`
          e.target.style.height = `${e.height < defaults?.height ? defaults.height : e.height}px`
          e.target.style.transform = 'translate(0, 0)'
        }}
        padding={{
          left: 5,
          right: 5,
          top: 5,
          bottom: 5,
        }}
        snapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        snapGridWidth={10}
        snapGridHeight={10}
        elementSnapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        useAccuratePosition
        bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: 'css' }}
        // isDisplaySnapDigit
        // isDisplayGridGuidelines
        // isDisplayInnerSnapDigit
        // onRender={({ target }) => {
        //   // target.style.transform = `translate(${layout.left}px, ${layout.top}px)`
        //   target.style.top = `${layout.top}px`
        //   target.style.left = `${layout.left}px`
        // }}
        {...moveableProps}
      />
    </>
  )
}
