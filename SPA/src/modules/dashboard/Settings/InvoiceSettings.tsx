import { useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Input, Button } from '_Home/components'

import { getInvoiceSettings, updateInvoiceSettings } from '../Invoice/redux/actions'

import styles from './Settings.module.styl'

const InvoiceSettings = () => {
  const ref = useRef()
  const {
    invoiceSettings: { settings, loading, statusCode },
  } = useAppSelector((state) => state.invoices)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!settings) {
      dispatch(getInvoiceSettings())
    }
  }, [])

  const handleClick = () => {
    const formData = new FormData(ref.current)
    dispatch(updateInvoiceSettings(settings.id, formData))
  }

  return (
    <div className={styles.InvoiceSettings}>
      <div className={styles.flexed}>
        <div>Invoice Settings</div>
        <form ref={ref} onSubmit={(e) => e.preventDefault()}>
          <div>
            <Input
              type="text"
              name="default_bank"
              defaultValue={settings?.defaultBank}
              labelName="Default Bank"
            />
            <Input
              type="text"
              name="default_currency"
              defaultValue={settings?.defaultCurrency}
              labelName="Default Currency"
            />
          </div>
          <div>
            <Input
              type="text"
              name="account_name"
              defaultValue={settings?.accountName}
              labelName="Account Name"
            />
            <Input
              type="text"
              name="account_number"
              defaultValue={settings?.accountNumber}
              labelName="Account Number"
            />
          </div>
          <div>
            <Input
              type="text"
              name="prefix"
              defaultValue={settings?.prefix}
              labelName="Invoice Prefix"
            />
            <Input type="text" name="dueAfter" defaultValue={settings?.dueAfter} labelName="Due After" />
          </div>
          <Button onClick={handleClick} text="Save" />
        </form>
      </div>
    </div>
  )
}
export default InvoiceSettings
