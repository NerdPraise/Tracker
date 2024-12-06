import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector, useUser } from '_Home/common/hooks'

import { Button, Frame } from '_Home/components'
import { htmlToPdf } from '_Home/common/utils'

import { useEffect, useMemo } from 'react'
import { getInvoiceSettings, getSingleInvoice, getAllDataForInvoiceView } from '../redux/actions'
import { getContext } from '../constants'

import styles from '../Invoice.module.styl'

export const InvoicePreview = () => {
  const { invoiceId, invoiceCode } = useParams()
  const {
    invoice: { preview, loading },
    invoiceSettings: { settings },
  } = useAppSelector((state) => state.invoices)
  const { user } = useUser()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (invoiceId) {
      dispatch(getSingleInvoice(invoiceId))
      dispatch(getInvoiceSettings())
    }
    if (invoiceCode) {
      dispatch(getAllDataForInvoiceView(invoiceCode))
    }
  }, [])

  const handleDownloadInvoice = () => {
    const invoiceToBeDownloaded = document.getElementById('frame')
    htmlToPdf(invoiceToBeDownloaded)
  }

  const templateSettings = preview?.template?.settings as SimpleSettings
  const context = useMemo(() => getContext(preview, user, settings), [preview, settings])

  if (loading) {
    return 'Loading.......'
  }
  return (
    <div className={styles.InvoicePreview}>
      <div className={styles.frame_body}>
        <Frame template={templateSettings?.html || ''} className={styles.frame} context={context} />
      </div>
      <div className={styles.banner}>
        <Button onClick={null} text="Create your Invoice" />
        <Button onClick={handleDownloadInvoice} text="Download PDF" />
        <Button onClick={null} text="Print Now" />
      </div>
    </div>
  )
}
