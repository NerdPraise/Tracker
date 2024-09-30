import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Button, Card, Grid } from '_Home/components'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { getClientDetails } from '../redux/actions'
import styles from './Contacts.module.styl'
import { noRowRenderer } from '_Home/components/Grid/renderer'

export const columnDefs = [
  {
    headerName: '',
    valueGetter: 'node.rowIndex + 1',
    width: 3,
    flex: 0,
  },
  {
    headerName: 'Name',
    field: 'name',
    flex: 1,
    cellClass: 'grid_click',
  },
  {
    headerName: 'Client',
    field: 'client.name',
    flex: 1,
  },
  {
    headerName: 'Amount',
    field: 'amount',
    maxWidth: 120,
    valueFormatter: (params) => `${params.data.currency} ${params.data.amount}`,
  },
  {
    headerName: 'Issue Date',
    field: 'issueDate',
    valueFormatter: (params) => {
      if (!params.value) {
        return 'Still in Draft'
      }
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
  },
  {
    headerName: 'Due Date',
    field: 'dueDate',
    valueFormatter: (params) => {
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
  },
]
const ContactHistory = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    client: { selectedClient, clientDetail },
    invoiceSettings: {
      settings: { defaultCurrency },
    },
  } = useAppSelector((state) => state.invoices)

  useEffect(() => {
    if (!selectedClient) {
      navigate('..')
    } else {
      dispatch(getClientDetails())
    }
  }, [])
  return (
    <SideBarLayout disableHide>
      <div className={styles.ContactHistory}>
        <h2>{selectedClient.name}</h2>
        <div className={styles.client_details}>
          <Card className={styles.card}>
            <p
              className={styles.card_title}
              style={{
                background: 'grey',
              }}
            >
              Total Payment
            </p>
            <p className={styles.card_price}>
              <span>{defaultCurrency}</span> &nbsp;
              {clientDetail?.total}
            </p>
          </Card>
          <Card className={styles.card}>
            <p
              className={styles.card_title}
              style={{
                background: '#048540',
              }}
            >
              Paid
            </p>
            <p className={styles.card_price}>
              <span>{defaultCurrency}</span>&nbsp;
              {clientDetail?.paid}
            </p>
          </Card>
          <Card className={styles.card}>
            <p
              className={styles.card_title}
              style={{
                background: '#f4984e',
              }}
            >
              Pending
            </p>
            <p className={styles.card_price}>
              <span>{defaultCurrency}</span>&nbsp;
              {clientDetail?.pending}
            </p>
          </Card>
        </div>
        {!!clientDetail?.invoices.length && (
          <div className={styles.grid_cont}>
            <Grid
              className={`${styles.grid} ag-theme-customtracker`}
              rowHeight={80}
              columnDefs={columnDefs}
              rowData={clientDetail?.invoices}
              defaultColDef={{ sortable: true }}
              overlayNoRowsTemplate={noRowRenderer('Invoice')}
            />
          </div>
        )}
        {!clientDetail?.invoices.length && (
          <div className={styles.no_invoice}>
            <p>No invoice for selected client</p>
            <Button onClick={() => navigate('/invoice/add')} text="Create an invoice" />
          </div>
        )}
      </div>
    </SideBarLayout>
  )
}
export default ContactHistory
