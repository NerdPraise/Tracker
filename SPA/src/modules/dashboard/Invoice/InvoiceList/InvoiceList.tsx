import { useEffect, useRef, useState } from 'react'
import ClassNames from 'classnames'
import { CellClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useNavigate } from 'react-router-dom'
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs'
import { Users, Plus, Lock, Check } from 'lucide-react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { noRowRenderer } from '_Home/components/Grid/renderer'
import { Button, Grid, Input, Modal } from '_Home/components'
import { useAppDispatch, useAppSelector, useUser } from '_Home/common/hooks'
import { capitalise } from '_Home/common/utils'
import { PricingDeets } from '_Home/modules/presentation/Home/constants'
import { useTourContext } from '_Home/routing/context'

import { getAllUserClient } from '../redux/actions'
import { columnDefs } from '../constants'
import styles from '../Invoice.module.styl'

const tabs = ['all', 'draft', 'paid', 'pending', 'overdue']

export const InvoiceList = () => {
  const gridRef = useRef<AgGridReact>(null)
  const {
    setState,
    state: { tourActive },
  } = useTourContext()
  const [currentTab, setCurrentTab] = useState<string>('all')
  const [filterText, setFilterText] = useState<string>('')
  const { invoice } = useAppSelector((state) => state.invoices)
  const [noInvoiceModalShow, setNoInvoiceModalShow] = useState<boolean>(false)
  const { user } = useUser()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onCellClick = (event: CellClickedEvent<IInvoice>) => {
    if (event.column.getColId().toLowerCase() === 'name') {
      navigate(`/invoice/${event.data?.uuid}`)
    }
  }

  useEffect(() => {
    dispatch(getAllUserClient())
    // Tour shenanigans
    if (tourActive) {
      setTimeout(() => {
        setState((prev) => ({ ...prev, run: true, stepIndex: 1 }))
      }, 600)
    }
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
          <h2 id="invoice">Invoices</h2>
          <div className={styles.header_btn}>
            <Button
              className={ClassNames(styles.track_button, 'clients')}
              text={
                <>
                  <Users size={18} />
                  Clients
                </>
              }
              onClick={() => navigate('./contacts')}
            />
            <Button
              className={ClassNames(styles.track_button, 'add_invoice')}
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
        <div id="export" className={styles.export}>
          <p onClick={() => onExport()}>Export all invoice</p>
        </div>
      </div>
      <Modal
        width="lg"
        isVisible={noInvoiceModalShow}
        extraStyles={{ width: 850 }}
        handleClose={() => setNoInvoiceModalShow(false)}
      >
        <div className={styles.payment_tab}>
          <div className={styles.first}>
            <h2>Empower your financial decision & take your finances to another level</h2>
            <p>Trusted by humans worldwide.</p>
            <p>
              Join the paid wagon and enjoy the various pros of the best invoice generator and
              customiser.
            </p>
            <Root defaultValue="premium" orientation="vertical" className={styles.tab_root}>
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
              <div className={styles.tab_content_cont}>
                <Content value="premium" className={styles.tab_content}>
                  <div>
                    <h5 className={styles.title}>Premium</h5>
                    <p className={styles.for}>For small businesses and solo freelancers</p>
                    <p className={styles.price}>$9.99</p>
                    <p className={styles.month}>per month</p>
                    <p className={styles.features}>Features you will love</p>
                    <div className={styles.offers}>
                      {PricingDeets[1].offers.map((item) => (
                        <p key={item}>
                          <Check size={16} stroke="#00ddb3" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <Button
                    className={styles.tab_btn}
                    onClick={() => navigate('../../settings/subscription')}
                    text="Get the Premium package today"
                  />
                </Content>
                <Content value="all_time" className={styles.tab_content}>
                  <div>
                    <h5 className={styles.title}>All Time</h5>
                    <p className={styles.for}>For Everyone</p>
                    <p className={styles.price}>$250</p>
                    <p className={styles.month}>ALL TIME</p>
                    <p className={styles.features}>Features you will love</p>
                    <div className={styles.offers}>
                      {PricingDeets[2].offers.map((item) => (
                        <p key={item}>
                          <Check size={16} stroke="#00ddb3" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <Button
                    className={styles.tab_btn}
                    onClick={() => navigate('../../settings/subscription')}
                    text="Get the All Time package today"
                  />
                </Content>
              </div>
            </Root>
          </div>
        </div>
      </Modal>
    </SideBarLayout>
  )
}
