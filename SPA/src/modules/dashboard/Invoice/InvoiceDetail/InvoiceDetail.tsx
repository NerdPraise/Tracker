import { useNavigate, useParams } from 'react-router-dom'
import { debounce } from 'lodash'
import { ChevronDown, CalendarCheck2, ArrowLeft } from 'lucide-react'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'date-fns'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Button, Card, DatePicker, Frame, Grid, Input, Modal, Select } from '_Home/components'
import { StatusCode, htmlToPdf, isFormValid } from '_Home/common/utils'

import {
  createInvoiceTransaction,
  deleteTransactions,
  sendInvoiceToClient,
  setSelectedInvoice,
} from '../redux/actions'
import { paymentColumnDefs, a, getContext } from '../constants'
import { getInvoiceTransactions } from '../redux/actions'
import styles from '../Invoice.module.styl'

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
    invoice: { invoices, selectedInvoice, statusCode: invoiceStatus },
    errorMessage,
    invoiceSettings: { settings },
    transaction: { loading: transLoading, transactions, statusCode },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const reportFormRef = useRef<HTMLFormElement>(null)
  const [isSendToClient, setIsSendToClient] = useState<boolean>(false)
  const [isRecordPayment, setIsRecordPayment] = useState<boolean>(false)
  const [error, setError] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const invoiceID = useParams().invoiceId
  const templateSettings = selectedInvoice?.template?.settings
  const debouncedSendToClient = debounce(() => dispatch(sendInvoiceToClient(selectedInvoice.uuid)), 2000)
  const debouncedRecordPayment = debounce(
    (formData: FormData) => dispatch(createInvoiceTransaction(formData)),
    2000,
  )
  useEffect(() => {
    if (!transLoading && statusCode === StatusCode.CREATED) {
      setIsRecordPayment(false)
    }
    if (invoiceStatus === StatusCode.SUCCESS) {
      setIsSendToClient(false)
    }
    setLoading(false)
  }, [statusCode, invoiceStatus])

  useEffect(() => {
    dispatch(getInvoiceTransactions(invoiceID))
  }, [])

  useEffect(() => {
    if (!(selectedInvoice && selectedInvoice.uuid === invoiceID)) {
      dispatch(setSelectedInvoice({ invoiceID, type: 'exist' }))
    }
  }, [invoices])

  const context = useMemo(() => getContext(selectedInvoice, user, settings), [selectedInvoice, settings])

  const onHandleRecordtPayment = () => {
    setLoading(true)
    const formData = new FormData(reportFormRef.current)
    formData.append('invoice', selectedInvoice.uuid)
    formData.append('payment_date', formatDate(selectedDate, 'yyyy-MM-dd'))
    debouncedRecordPayment(formData)
  }

  const onHandleMarkUpaid = () => {
    dispatch(deleteTransactions(selectedInvoice.uuid))
  }

  const handleClose = () => {
    setIsRecordPayment(false)
    setIsSendToClient(false)
  }

  const handleSendToClient = () => {
    setLoading(true)
    debouncedSendToClient()
  }

  const handleDownloadInvoice = () => {
    const invoiceToBeDownloaded = document.getElementById('frame')
    htmlToPdf(invoiceToBeDownloaded)
  }

  const gridData = transactions?.map((item) => ({ ...item, client: selectedInvoice?.client }))
  const clientHasPaidAll = !Number(selectedInvoice?.payment.totalDue)
  console.log(templateSettings?.html)

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceDetail}>
        <div className={styles.header}>
          <h2>
            <Link to="..">
              <ArrowLeft />
            </Link>
            Invoice {selectedInvoice?.name}
          </h2>
          <div className={styles.edit_actions}>
            <Button text="Edit Invoice" onClick={() => navigate(`../edit/${invoiceID}`)} />
            <Button
              text={
                <>
                  More
                  <ChevronDown width="13" height="10" />
                </>
              }
              onClick={() => null}
            />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <Frame template={a || templateSettings?.html || ''} context={context} />
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
            <div>
              <Card className={styles.card}>
                <div className={styles.card_paid}>
                  {!clientHasPaidAll ? (
                    !selectedInvoice?.dateSent ? (
                      <>
                        <p className={styles.card_paid_text}>
                          Send invoice to client via email to get paid faster
                        </p>
                        <Button text="Send to Client" onClick={() => setIsSendToClient(true)} />
                      </>
                    ) : (
                      <>
                        <p className={styles.card_paid_text}>
                          Congrats!!🎉 Your invoice is in the hands of your client
                        </p>
                        <Button text="Send Reminder" onClick={() => setIsSendToClient(true)} />
                      </>
                    )
                  ) : selectedInvoice?.dateSent ? (
                    <>
                      <p className={styles.card_paid_text}>Congrats!!🎉 Your invoice is all paid for</p>
                      <Button text="Send Receipt" onClick={() => setIsSendToClient(true)} />
                    </>
                  ) : (
                    <p className={styles.card_paid_text}>
                      Invoice is paid for, but you haven't sent the invoice
                    </p>
                  )}
                </div>
              </Card>
              <Card className={styles.card}>
                <div className={styles.card_paid}>
                  {clientHasPaidAll ? (
                    <>
                      <p className={styles.card_paid_text}>
                        Wish to reverse invoice payment? Click below button.
                      </p>
                      <Button text="Mark Unpaid" onClick={onHandleMarkUpaid} />
                    </>
                  ) : (
                    <>
                      <p className={styles.card_paid_text}>
                        Client already paid? Click below to record an offline payment
                      </p>
                      <Button text="Record Payment" onClick={() => setIsRecordPayment(true)} />
                    </>
                  )}
                </div>
              </Card>
              <div className={styles.extra_btn}>
                <a href={`/preview/${selectedInvoice?.uuid}`} target="_blank">
                  <Button text="Preview as Client" onClick={null} />
                </a>
                <Button text="Download Invoice" onClick={handleDownloadInvoice} />
              </div>
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
                <Button text="Send Invoice" onClick={handleSendToClient} loading={loading} />
              </div>
            </div>
          )}
          {isRecordPayment && (
            <div className={styles.record_payment}>
              <h2>Record Payment</h2>
              <div className={styles.input_group}>
                <form ref={reportFormRef}>
                  <div>
                    <p className={styles.label_name}>
                      PAYMENT DATE <span>*</span>
                    </p>
                    <DatePicker
                      icon={<CalendarCheck2 width={20} />}
                      selected={selectedDate}
                      dateFormat="yyyy-MM-dd"
                      onSelect={(date) => setSelectedDate(date)}
                    />
                  </div>

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
                    defaultValue={selectedInvoice?.payment.totalDue}
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
                  onClick={onHandleRecordtPayment}
                  disabled={!!Object.keys(error).length || !isFormValid(reportFormRef)}
                  loading={loading}
                />
              </div>
              <div className="error-message">{errorMessage}</div>
            </div>
          )}
        </Modal>
      </div>
    </SideBarLayout>
  )
}
