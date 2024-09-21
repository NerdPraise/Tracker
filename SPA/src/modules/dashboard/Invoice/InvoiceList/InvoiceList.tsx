import { useEffect, useRef, useState } from 'react'
import ClassNames from 'classnames'
import { CellClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useNavigate } from 'react-router-dom'
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs'
import { Users, Plus, Lock } from 'lucide-react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { noRowRenderer } from '_Home/components/Grid/renderer'
import { Button, Grid, Input, Modal } from '_Home/components'
import { useAppDispatch, useAppSelector, useUser } from '_Home/common/hooks'
import { capitalise } from '_Home/common/utils'

import { getAllUserClient } from '../redux/actions'
import { columnDefs } from '../constants'
import styles from '../Invoice.module.styl'

const tabs = ['all', 'draft', 'paid', 'pending', 'overdue']

export const InvoiceList = () => {
  const gridRef = useRef<AgGridReact>(null)
  const [currentTab, setCurrentTab] = useState<string>('all')
  const [filterText, setFilterText] = useState<string>('')
  const { invoice } = useAppSelector((state) => state.invoices)
  const [noInvoiceModalShow, setNoInvoiceModalShow] = useState<boolean>(false)
  const { user } = useUser()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onCellClick = (event: CellClickedEvent<(typeof invoice.invoices)[0]>) => {
    if (event.column.getColId().toLowerCase() === 'name') {
      navigate(`/invoice/${event.data?.uuid}`)
    }
  }

  useEffect(() => {
    dispatch(getAllUserClient())
  }, [])

  const onExport = () => {
    gridRef.current?.api.exportDataAsCsv()
  }
  const filteredRowData = invoice.invoices.filter((item) =>
    currentTab !== 'all' ? item.payment?.status === currentTab : item,
  )

  const hasInvoiceForCurrentMonth = invoice.invoices.filter((item) => {
    const date = new Date(item.createdAt)
    const currentDate = new Date()
    return date.getMonth() === currentDate.getMonth()
  }).length
  const canCreateInvoiceThisMonth = !(
    hasInvoiceForCurrentMonth && user.subscription.toLowerCase() === 'free'
  )

  const onClickAddInvoice = () => {
    if (!canCreateInvoiceThisMonth) {
      setNoInvoiceModalShow(true)
    } else {
      navigate('add')
    }
  }

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceList}>
        <div className={styles.header}>
          <h2>Invoices</h2>
          <div className={styles.header_btn}>
            <Button
              className={styles.track_button}
              text={
                <>
                  <Users size={18} />
                  Clients
                </>
              }
              onClick={() => navigate('./contacts')}
            />
            <Button
              className={styles.track_button}
              logo={canCreateInvoiceThisMonth ? <Plus fill="#fff" size={18} /> : <Lock size={18} />}
              text="Add Invoice"
              onClick={onClickAddInvoice}
            />
          </div>
        </div>

        <div className={styles.Tab}>
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
            <div className={styles.filter}>
              <Input
                type="text"
                name="filter"
                onChange={(e) => setFilterText(e.target.value)}
                labelName="Search"
                className={styles.filter_input}
              />
            </div>
            <div className={styles.invoice_list}>
              <Grid
                className={`${styles.grid} ag-theme-customtracker`}
                innerRef={gridRef}
                pagination
                columnDefs={columnDefs}
                rowData={filteredRowData}
                defaultColDef={{ sortable: true }}
                quickFilterText={filterText}
                onCellClicked={onCellClick}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 15, 20]}
                overlayNoRowsTemplate={noRowRenderer(`${currentTab} invoice`)}
              />
            </div>
          </div>
        </div>
        <div className={styles.export}>
          <p onClick={() => onExport()}>Export all invoice</p>
        </div>
      </div>
      <Modal width="lg" isVisible={noInvoiceModalShow} handleClose={() => setNoInvoiceModalShow(false)}>
        <div className={styles.payment_tab}>
          <div className={styles.first}>
            <h2>Empower your financial decision & take your finances to another level</h2>
            <p>Trusted by humans worldwide.</p>
            <Root defaultValue="general" orientation="vertical">
              <List className={styles.tab_list}>
                <Trigger className={styles.trigger} value="premium">
                  <div>Premium</div>
                  <div className={styles.pricing}>
                    <p>$9.99 / month</p>
                    <p className={styles.small}>Billed monthly</p>
                  </div>
                </Trigger>
                <Trigger className={styles.trigger} value="all_time">
                  <div>All Time</div>
                  <div className={styles.pricing}>
                    <p>$300 / month</p>
                    <p className={styles.small}>Billed monthly</p>
                  </div>
                </Trigger>
              </List>
              <Content value="premium" className={styles.tab_content}>
                premium
              </Content>
              <Content value="all_time" className={styles.tab_content}>
                all time
              </Content>
            </Root>
          </div>
        </div>
      </Modal>
    </SideBarLayout>
  )
}
