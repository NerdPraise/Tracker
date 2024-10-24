import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { Button } from '_Home/components'
import { FrameDetails } from '../common/FrameDetails'
import { useEffect, useMemo } from 'react'
import { getInvoiceSettings, getSingleInvoice, getAllDataForInvoiceView } from '../redux/actions'
import { getContext } from '../constants'

import styles from '../Invoice.module.styl'

export const InvoicePreview = () => {
  const { invoiceId, invoiceCode } = useParams()
  const {
    invoice: { preview },
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
    console.log(invoiceId, invoiceCode)
  }, [])

  const templateSettings = preview?.template?.settings
  const context = useMemo(() => getContext(preview, user, settings), [preview, settings])

  return (
    <div className={styles.InvoicePreview}>
      <div className="header"></div>
      <FrameDetails template={templateSettings?.html || ''} context={context} />
      <div className={styles.banner}>
        <Button onClick={null} text="Create your Invoice" />
        <Button onClick={null} text="Download PDF" />
        <Button onClick={null} text="Print Now" />
      </div>
    </div>
  )
}
