import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Pencil } from 'lucide-react'

import { Button, Card, Grid, Input, Modal, TextArea } from '_Home/components'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { noRowRenderer } from '_Home/components/Grid/renderer'

import { getClientDetails, updateUserClient } from '../redux/actions'
import styles from './Contacts.module.styl'
import { Link } from 'react-router-dom'

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
  const [showModal, setShowModal] = useState<boolean>(false)
  const {
    client: { selectedClient, clientDetail, loading },
    invoiceSettings: { settings },
  } = useAppSelector((state) => state.invoices)
  const formRef = useRef(null)

  const handleEdit = () => {
    const formData = new FormData(formRef.current)
    dispatch(updateUserClient(formData, selectedClient?.id, () => setShowModal(false)))
  }

  useEffect(() => {
    if (!selectedClient) {
      navigate('../contacts')
    } else {
      dispatch(getClientDetails())
    }
  }, [])
  return (
    <SideBarLayout disableHide>
      <div className={styles.ContactHistory}>
        <div
          style={{
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          <Link to="../contacts" style={{ height: 'fit-content' }}>
            <ArrowLeft color="#fff" />
          </Link>

          <h2>{selectedClient?.name}</h2>
          <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
            <Pencil size={18} />
          </div>
        </div>
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
              <span>{settings?.defaultCurrency}</span> &nbsp;
              {clientDetail?.total || '-'}
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
              <span>{settings?.defaultCurrency}</span>&nbsp;
              {clientDetail?.paid || '-'}
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
              <span>{settings?.defaultCurrency}</span>&nbsp;
              {clientDetail?.pending || '-'}
            </p>
          </Card>
        </div>
        {!!clientDetail?.invoices?.length && (
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
        {!clientDetail?.invoices?.length && (
          <div className={styles.no_invoice}>
            <p>No invoice for selected client</p>
            <Button onClick={() => navigate('/invoice/add')} text="Create an invoice" />
          </div>
        )}
      </div>
      <Modal
        isVisible={showModal}
        width="md"
        className={styles.ContactModal}
        handleClose={() => setShowModal(false)}
      >
        <form onSubmit={(e) => e.preventDefault()} ref={formRef}>
          <div className={styles.input_group}>
            <Input
              labelName={
                <p className={styles.label_name}>
                  Email Address <span>*</span>
                </p>
              }
              defaultValue={selectedClient?.email}
              type="email"
              name="email"
            />
            <Input
              labelName={
                <p className={styles.label_name}>
                  Name <span>*</span>
                </p>
              }
              type="text"
              defaultValue={selectedClient?.name}
              name="name"
            />
            <TextArea
              className={styles.textarea}
              placeholder="Add client's address and other info. (Optional)"
              name="address"
              rows={10}
              defaultValue={selectedClient?.address}
              cols={40}
              labelName={<p className={styles.label_name}>Address</p>}
            />
          </div>
          <div className={styles.send_btn}>
            <Button text="Update contact" loading={loading} onClick={handleEdit} />
          </div>
          {/* <p className="error small" dangerouslySetInnerHTML={{ __html: errorMessage }} /> */}
        </form>
      </Modal>
    </SideBarLayout>
  )
}
export default ContactHistory
