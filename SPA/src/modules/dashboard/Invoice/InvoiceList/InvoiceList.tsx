import { useEffect, useRef, useState } from 'react'
import ClassNames from 'classnames'
import { CellClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useNavigate } from 'react-router-dom'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { noRowRenderer } from '_Home/components/Grid/renderer'
import { Button, Grid, Input } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'
import { capitalise } from '_Home/common/utils'

import { getAllUserClient } from '../redux/actions'
import { columnDefs } from '../constants'
import Plus from '_Images/plus.svg?react'
import styles from '../Invoice.module.styl'

const tabs = ['all', 'draft', 'paid', 'pending', 'overdue']

export const InvoiceList = () => {
  const gridRef = useRef<AgGridReact>(null)
  const [currentTab, setCurrentTab] = useState<string>('all')
  const [filterText, setFilterText] = useState<string>('')
  const { invoice } = useAppSelector((state) => state.invoices)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onCellClick = (event: CellClickedEvent<(typeof invoice.invoices)[0]>) => {
    navigate(`/invoice/${event.data?.uuid}`)
  }

  useEffect(() => {
    dispatch(getAllUserClient())
  }, [])

  const onExport = () => {
    gridRef.current?.api.exportDataAsCsv()
  }
  const filteredRowData = invoice.invoices.filter((item) =>
    currentTab !== 'all' ? item.status === currentTab : item,
  )

  return (
    <SideBarLayout selectedKey={ROUTES.authenticatedRoutes.INVOICE.key} disableHide>
      <div className={styles.InvoiceList}>
        <div className={styles.header}>
          <h2>Invoices</h2>
          <Button
            className={styles.track_button}
            logo={<Plus fill="#fff" />}
            text="Add Invoice"
            onClick={() => navigate('add')}
            left
          />
        </div>

        <div className={styles.Tab}>
          <div className={styles.filter}>
            <Input
              type="text"
              name="filter"
              onChange={(e) => setFilterText(e.target.value)}
              labelName="Search"
            />
          </div>
          <div className={styles.tab_header}>
            {tabs.map((item) => (
              <div
                className={ClassNames({ [styles.active]: currentTab === item })}
                onClick={() => setCurrentTab(item)}
                key={item}
              >
                {capitalise(item)}
              </div>
            ))}
          </div>
          <div className={styles.tab_body}>
            <div className={styles.invoice_list}>
              <Grid
                className={`${styles.grid} ag-theme-customtracker`}
                innerRef={gridRef}
                columnDefs={columnDefs}
                rowData={filteredRowData}
                defaultColDef={{ sortable: true }}
                quickFilterText={filterText}
                onCellClicked={onCellClick}
                overlayNoRowsTemplate={noRowRenderer(currentTab)}
              />
            </div>
          </div>
        </div>
        <div className={styles.export}>
          <p onClick={() => onExport()}>Export all invoice</p>
        </div>
      </div>
    </SideBarLayout>
  )
}
