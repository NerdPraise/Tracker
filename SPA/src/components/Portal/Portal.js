import { createPortal } from 'react-dom'

const flowRootDiv = document.getElementById('flow-root')
export const Portal = ({ children }) => {
  return createPortal(children, flowRootDiv)
}
