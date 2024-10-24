import RGridLayout, { WidthProvider } from 'react-grid-layout'
import type { ReactGridLayoutProps } from 'react-grid-layout'

import { DragContext } from './DragContext'

import './GridLayout.css'
import 'react-resizable/css/styles.css'
import { useState } from 'react'

const ResponsiveGridLayout = WidthProvider(RGridLayout)

interface GridLayoutProps extends ReactGridLayoutProps {
  children: ReactChildren
}

export const GridLayout = ({
  children,
  className,
  layout,
  onDrop,
  isDroppable,
  onLayoutChange,
}: GridLayoutProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [activeWidget, setActiveWidget] = useState<string>('')

  return (
    <DragContext.Provider value={{ isDragging, activeWidget, setActiveWidget }}>
      <ResponsiveGridLayout
        className={className}
        autoSize={false}
        containerPadding={[0, 0]}
        rowHeight={30}
        isDroppable={isDroppable}
        width={1200}
        compactType={null}
        layout={layout}
        onLayoutChange={onLayoutChange}
        onDrop={onDrop}
        onDrag={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        allowOverlap={true}
      >
        {children}
      </ResponsiveGridLayout>
    </DragContext.Provider>
  )
}
