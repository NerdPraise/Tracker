interface BaseWidgetProps {
  key?: string
  className?: string
  style: CSSStyleRule
  children: ReactChildren
  gridRef: React.MutableRefObject<any>
}

export const BaseWidget = function a({ className, style, children, ...props }: BaseWidgetProps) {
  return (
    <div className={className} ref={props.gridRef} style={{ background: 'green', ...style }} {...props}>
      {children}
      <div style={{ zIndex: 2, position: 'relative' }}>
        <p>sww</p>
      </div>
    </div>
  )
}
