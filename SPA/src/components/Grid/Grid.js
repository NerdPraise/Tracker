import { AgGridReact } from 'ag-grid-react'
import ClassNames from 'classnames'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'

export const Grid = ({ className, ...props }) => {
  return (
    <div className={ClassNames('ag-theme-alpine-dark', className)}>
      <AgGridReact reactUi {...props} />
    </div>
  )
}
