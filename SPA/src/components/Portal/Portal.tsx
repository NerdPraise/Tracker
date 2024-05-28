import { createPortal } from 'react-dom'

const flowRootDiv = document.getElementById('flow-root')

interface PortalProps {
  children: React.ReactNode
}
export const Portal = ({ children }: PortalProps) => {
  return createPortal(children, flowRootDiv)
}
