import { ICellRendererParams } from 'ag-grid-community'
import ClassNames from 'classnames'

export const StatusRenderer = (params: ICellRendererParams<any>) => {
  const data = params.value
  return (
    <div className={`status_render ${data}`}>
      <div>{data.toUpperCase()}</div>
    </div>
  )
}

export const noRowRenderer = (tab: string) => {
  return `<span style="padding: 10px; border: 2px solid #F5F5F5; color:#F5F5F5;">No ${tab} invoice in sight 👀</span>`
}
