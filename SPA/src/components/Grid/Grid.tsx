import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import ClassNames from 'classnames'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import React from 'react'

export interface GridProps extends AgGridReactProps {
  className?: string
  innerRef?: React.LegacyRef<AgGridReact>
}

export const Grid = ({ innerRef, className, ...props }: GridProps) => {
  return (
    <div className={ClassNames('ag-theme-alpine-dark', className)}>
      <AgGridReact ref={innerRef} {...props} />
    </div>
  )
}
