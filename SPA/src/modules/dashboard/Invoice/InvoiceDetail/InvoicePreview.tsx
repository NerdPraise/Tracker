import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { Button } from '_Home/components'
import { FrameDetails } from '../common/FrameDetails'
import { useEffect, useMemo } from 'react'
import { getInvoiceSettings, getSingleInvoice } from '../redux/actions'
import { getContext } from '../constants'

import styles from '../Invoice.module.styl'

export const InvoicePreview = () => {
  const invoiceID = useParams().invoiceId
  const {
    invoice: { preview },
    invoiceSettings: { settings },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSingleInvoice(invoiceID))
    dispatch(getInvoiceSettings())
  }, [invoiceID])

  console.log(settings)

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
