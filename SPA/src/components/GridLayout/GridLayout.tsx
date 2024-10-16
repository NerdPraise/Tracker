import RGridLayout, { WidthProvider } from 'react-grid-layout'

import './GridLayout.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(RGridLayout)

interface GridLayoutProps {
  className?: string
  children: ReactChildren
  layout?: object
}
export const GridLayout = ({ children, className, layout }: GridLayoutProps) => {
  return (
    <ResponsiveGridLayout
      className={className}
      autoSize={false}
      containerPadding={[0, 0]}
      cols={12}
      rowHeight={30}
      width={1200}
      compactType={null}
      layout={layout}
    >
      {children}
    </ResponsiveGridLayout>
  )
}
