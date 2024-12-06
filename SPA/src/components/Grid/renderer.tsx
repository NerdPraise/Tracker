import type { CustomCellRendererProps } from 'ag-grid-react'
import { NotebookText, OctagonX } from 'lucide-react'
import { useCallback } from 'react'

import styles from './renderer.module.styl'
import { useDispatch } from 'react-redux'

export const StatusRenderer = (params: CustomCellRendererProps) => {
  const data = params.value?.status

  return (
    <div className={`status_render ${data}`}>
      <div>{(data || '').toUpperCase()}</div>
    </div>
  )
}

export const noRowRenderer = (tab: string) => {
  return `<span style="padding: 10px; border: 2px solid #F5F5F5; color:#F5F5F5;">No ${tab} in sight 👀</span>`
}

export const ActionsCellRenderer = ({
  api,
  node,
  DeleteBtn,
  view,
  deleteAction,
}: CustomCellRendererProps & { deleteAction: (...e) => null; DeleteBtn: any; view: boolean }) => {
  const dispatch = useDispatch()
  const onRemoveClick = useCallback(() => {
    const rowData = node.data
    dispatch(deleteAction(node.data.uuid || node.data.id))
    api.applyTransaction({ remove: [rowData] })
  }, [node, api])

  const handleViewClick = useCallback(() => {
    const rowData = node.data

    api.applyTransaction({ update: [rowData] })
  }, [node, api])

  return (
    <div className={styles.ActionsRenderer}>
      {view && (
        <div onClick={handleViewClick}>
          <NotebookText size={19} />
        </div>
      )}
      <div onClick={onRemoveClick}>
        {!DeleteBtn ? <OctagonX fill="#891919" size={19} /> : <DeleteBtn size={19} />}
      </div>
    </div>
  )
}
