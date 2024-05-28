import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, CalendarCheck2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'
import { Button, Card, Grid, Input, Modal, Select } from '_Home/components'
import { StatusCode, capitalise, isFormValid } from '_Home/common/utils'

import { createInvoiceTransaction, deleteTransactions, setSelectedInvoice } from '../redux/actions'
import { FrameDetails } from '../common/FrameDetails'
import styles from '../Invoice.module.styl'
import { paymentColumnDefs, a, getContext } from '../constants'
import { useEffect } from 'react'
import { getInvoiceTransactions } from '../redux/actions'

const options = [
  { value: 'BT', label: 'Bank Transfer' },
  { value: 'CS', label: 'Cash' },
  { value: 'OT', label: 'Others' },
]
const customStyles = {
  control: (base) => ({
    ...base,
    height: 50,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '50px',
  }),
}

export const InvoiceDetail = () => {
  const {
    invoice: { invoices, selectedInvoice },
    errorMessage,
    transaction: { loading: transLoading, transactions, statusCode },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const sendFormRef = useRef<HTMLFormElement>(null)
  const reportFormRef = useRef<HTMLFormElement>(null)
  const [isSendToClient, setIsSendToClient] = useState<boolean>(false)
  const [isRecordPayment, setIsRecordPayment] = useState<boolean>(false)
  const [error, setError] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const invoiceID = useParams().invoiceId
  const templateSettings = selectedInvoice?.template?.settings

  useEffect(() => {
    dispatch(getInvoiceTransactions(invoiceID))
  }, [])

  useEffect(() => {
    dispatch(setSelectedInvoice(invoiceID))
  }, [invoices])

  const context = useMemo(() => getContext(selectedInvoice, user), [selectedInvoice])

  const onHandleReportPayment = () => {
    const formData = new FormData(reportFormRef.current)
    formData.append('invoice', selectedInvoice.uuid)
    dispatch(createInvoiceTransaction(formData))
  }
  const onHandleMarkUpaid = () => {
    dispatch(deleteTransactions(selectedInvoice.uuid))
  }
  const handleClose = () => {
    setIsRecordPayment(false)
    setIsSendToClient(false)
  }

  const onHandleSendToClient = () => {
    const formData = new FormData(sendFormRef.current)
    // dispatch(createInvoiceTransaction(formData))
  }

  useEffect(() => {
    if (!transLoading && statusCode === StatusCode.CREATED) {
      setIsRecordPayment(false)
    }
  }, [statusCode])

  const gridData = transactions?.map((item) => ({ ...item, client: selectedInvoice?.client }))
  const clientHasPaidAll = !Number(selectedInvoice?.payment)

  return (
    <SideBarLayout selectedKey={ROUTES.authenticatedRoutes.INVOICE.key} disableHide>
      <div className={styles.InvoiceDetail}>
        <div className={styles.header}>
          <h2>Invoice {selectedInvoice?.name}</h2>
          <div className={styles.edit_actions}>
            <Button text="Edit Invoice" onClick={() => navigate(`../edit/${invoiceID}`)} />
            <Button
              text="More actions"
              onClick={() => null}
              logo={<ChevronDown width="13" height="10" />}
            />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <FrameDetails template={templateSettings?.html || ''} context={context} />
            {!!transactions.length && (
              <div className={styles.transactions}>
                <Grid
                  className={`${styles.grid} ag-theme-customtracker`}
                  columnDefs={paymentColumnDefs}
                  rowData={gridData}
                  defaultColDef={{ sortable: false }}
                />
              </div>
            )}
          </div>
          <div className={styles.client_actions}>
            <Card className={styles.card}>
              {!clientHasPaidAll ? (
                <div className={styles.card_paid}>
                  <p>Send Invoice to client via email to get paid faster</p>
                  <Button text="Send to Client" onClick={() => setIsSendToClient(true)} />
                </div>
              ) : (
                <div className={styles.card_paid}>
                  <p>Congrats!!🎉 Your selectedInvoice is all paid for</p>
                  <Button text="Send Receipt" onClick={() => setIsSendToClient(true)} />
                </div>
              )}
            </Card>
            <Card className={styles.card}>
              {clientHasPaidAll ? (
                <div className={styles.card_paid}>
                  <p>Wish to reverse selectedInvoice payment? Click below button.</p>
                  <Button text="Mark Unpaid" onClick={onHandleMarkUpaid} />
                </div>
              ) : (
                <div className={styles.card_paid}>
                  <p>Client already paid? Click below to record an offline payment</p>
                  <Button text="Record Payment" onClick={() => setIsRecordPayment(true)} />
                </div>
              )}
            </Card>
            <div className={styles.preview}>
              <Button text="Preview as Client" onClick={() => null} />
            </div>
          </div>
        </div>
        <Modal
          className={styles.FrameDetailsModal}
          isVisible={isSendToClient || isRecordPayment}
          handleClose={handleClose}
          width="md"
        >
          {isSendToClient && (
            <div className={styles.send_to_client_form}>
              <h2> Send Invoice</h2>
              <div className={styles.input_group}>
                <Input
                  labelName={
                    <p className={styles.label_name}>
                      Email Address <span>*</span>
                    </p>
                  }
                  type="email"
                  defaultValue={selectedInvoice.client.email}
                  name="email"
                />
              </div>
              <div className={styles.send_btn}>
                <Button text="Send Invoice" onClick={onHandleSendToClient} />
              </div>
            </div>
          )}
          {isRecordPayment && (
            <div className={styles.record_payment}>
              <h2>Record Payment</h2>
              <div className={styles.input_group}>
                <form ref={reportFormRef}>
                  <Input
                    labelName={
                      <p className={styles.label_name}>
                        PAYMENT DATE <span>*</span>
                      </p>
                    }
                    setError={setError}
                    error={error}
                    type="date"
                    name="payment_date"
                    icon={<CalendarCheck2 width={20} />}
                  />
                  <div className={styles.select}>
                    <Select
                      options={options}
                      setError={setError}
                      error={error}
                      name="mode"
                      label={
                        <p className={styles.label_name}>
                          MODE OF PAYMENT <span>*</span>
                        </p>
                      }
                      styles={customStyles}
                    />
                  </div>
                  <Input
                    labelName={
                      <p className={styles.label_name}>
                        AMOUNT PAID <span>*</span>
                      </p>
                    }
                    setError={setError}
                    error={error}
                    icon={selectedInvoice.currency}
                    type="number"
                    max={selectedInvoice.amount}
                    defaultValue={selectedInvoice.amount}
                    name="amount"
                    customValidation={(value) =>
                      Number(value) > selectedInvoice.amount
                        ? "Value can't be higher than amount to be paid"
                        : null
                    }
                  />
                </form>
              </div>
              <div className={styles.send_btn}>
                <Button
                  text="Record Payment"
                  onClick={onHandleReportPayment}
                  disabled={!!Object.keys(error).length || !isFormValid(reportFormRef)}
                  loading={transLoading}
                />
              </div>
              {!!isFormValid(reportFormRef) && 'True'}
              <div className="error-message">{errorMessage}</div>
            </div>
          )}
        </Modal>
      </div>
    </SideBarLayout>
  )
}
