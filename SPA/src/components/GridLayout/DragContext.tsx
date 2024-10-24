import { createContext } from 'react'

type DragContextArgs = {
  isDragging: boolean
  activeWidget: string
  setActiveWidget: React.Dispatch<React.SetStateAction<string>>
}
export const DragContext = createContext<DragContextArgs>({
  isDragging: false,
  activeWidget: '',
  setActiveWidget: () => null,
})
