import React, { useRef } from 'react'
import { createContext, useState } from 'react'

export const RefContext = createContext({ ref: null })

export const RefStore = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>()
  return <RefContext.Provider value={{ ref }}>{children}</RefContext.Provider>
}
type LayoutContextArgs = {
  settings: Settings | null
  setSettings: (value: Settings['widgets']) => void
}

export const LayoutContext = createContext<LayoutContextArgs>({
  setSettings: (e) => null,
  settings: null,
}) // WidgetLayoutContext

type DragContextArgs = {
  isDragging: boolean
  activeWidget: string
  setActiveWidget: React.Dispatch<React.SetStateAction<string>>
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
}
export const DragContext = createContext<DragContextArgs>({
  isDragging: false,
  activeWidget: '',
  setActiveWidget: () => null,
  setIsDragging: () => null,
})

export const DragStore = ({ children }: { children: React.ReactNode }) => {
  // Provide context that encompasses all of widgetGrid Layout
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [activeWidget, setActiveWidget] = useState<string>('')
  return (
    <DragContext.Provider value={{ isDragging, activeWidget, setActiveWidget, setIsDragging }}>
      {children}
    </DragContext.Provider>
  )
}
