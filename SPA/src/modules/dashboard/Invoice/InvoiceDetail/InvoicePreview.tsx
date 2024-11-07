import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

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
  const { user } = useAppSelector((state) => state.user)
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

  const templateSettings = preview?.template?.settings
  const context = useMemo(() => getContext(preview, user, settings), [preview, settings])
  console.log(user)
  if (loading) {
    return 'Loading.......'
  }
  return (
    <div className={styles.InvoicePreview}>
      <div className="header"></div>
      <Frame template={templateSettings?.html || ''} context={context} />
      <div className={styles.banner}>
        <Button onClick={null} text="Create your Invoice" />
        <Button onClick={handleDownloadInvoice} text="Download PDF" />
        <Button onClick={null} text="Print Now" />
      </div>
    </div>
  )
}
