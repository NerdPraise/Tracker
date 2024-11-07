import { useContext, useState } from 'react'
import ClassNames from 'classnames'

import { HoverCard } from '_Home/components'
import { DragContext } from '_Home/components/GridLayout/DragContext'

import styles from './BaseWidget.module.styl'

interface BaseWidgetProps {
  key?: string
  className?: string
  children: ReactChildren
  toolBar?: ReactChildren
  widgetId: string
}

export const BaseWidget = ({ className, children, toolBar, widgetId, ...props }: BaseWidgetProps) => {
  const { isDragging, activeWidget, setActiveWidget } = useContext(DragContext)

  const onFocusHandler = () => {
    setActiveWidget(widgetId)
  }
  const showToolBar = activeWidget === widgetId

  return (
    <>
      {!isDragging && showToolBar && (
        <HoverCard side="top" open={showToolBar} trigger={<div></div>} item={toolBar} />
      )}
      <div
        className={ClassNames('widget', styles.BaseWidget, className)}
        {...props}
        onFocus={onFocusHandler}
      >
        {children}
      </div>
    </>
  )
}
