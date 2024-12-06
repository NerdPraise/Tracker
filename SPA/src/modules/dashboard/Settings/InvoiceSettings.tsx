import { SelectInstance } from 'react-select'
import { useEffect, useMemo, useRef, useState } from 'react'
import LoadingBar from 'react-top-loading-bar'

import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Input, Button, HelpToolTip, Select } from '_Home/components'
import { currencyOptions } from '_Home/constants'
import { useTourContext } from '_Home/routing/context'

import { getInvoiceSettings, updateInvoiceSettings } from '../Invoice/redux/actions'

import styles from './Settings.module.styl'
import { isFormValid, StatusCode } from '_Home/common/utils'
import { Toast } from '_Home/components/Toast'

const InvoiceSettings = () => {
  const [error, setError] = useState({})
  const ref = useRef()
  const {
    setState,
    state: { tourActive },
  } = useTourContext()
  const selectRef = useRef()
  const [disableCardDeets, setDisableCardDeets] = useState<boolean>(true)
  const {
    invoiceSettings: { settings, loading, statusCode, toast },
  } = useAppSelector((state) => state.invoices)
  const dispatch = useAppDispatch()
  const loadingRef = useRef(null)

  useEffect(() => {
    if (!loading && statusCode === StatusCode.SUCCESS && Object.keys(toast).length) {
      loadingRef.current?.complete()
    }
  }, [statusCode, loading])

  useEffect(() => {
    if (!settings) {
      dispatch(getInvoiceSettings())
    }
    if (tourActive) {
      setTimeout(() => {
        setState((prev) => ({ ...prev, run: true, stepIndex: 6 }))
      }, 600)
    }
  }, [])

  const handleSave = () => {
    loadingRef.current?.continuousStart()
    if (selectRef?.current) {
      const select = selectRef?.current as SelectInstance
      const formData = new FormData(ref.current)
      formData.append('default_currency', (select.getValue()[0] as { value: string }).value)
      dispatch(updateInvoiceSettings(settings.id, formData))
      setDisableCardDeets(true)
    }
  }
  const defaultCurrencyOption = useMemo(() => {
    currencyOptions.find((item) => item.value === settings?.defaultCurrency) || currencyOptions[0]
  }, [settings?.defaultCurrency])

  return (
    <div className={styles.InvoiceSettings}>
      <Toast {...toast} />
      <LoadingBar ref={loadingRef} color="#c770fe" />
      <div className={styles.flexed}>
        <div>Invoice Settings</div>
        <form id="form" ref={ref} onSubmit={(e) => e.preventDefault()}>
          <div>
            <Input
              type="text"
              disabled={disableCardDeets}
              name="default_bank"
              defaultValue={settings?.defaultBank}
              labelName="Default Bank"
              error={error}
              setError={setError}
            />
            <Select
              ref={selectRef}
              className={styles.select}
              disabled={disableCardDeets}
              label="Default Currency"
              defaultValue={defaultCurrencyOption}
              options={currencyOptions}
              error={error}
              setError={setError}
            />
          </div>
          <div>
            <Input
              disabled={disableCardDeets}
              type="text"
              name="account_name"
              defaultValue={settings?.accountName}
              labelName="Account Name"
              error={error}
              setError={setError}
            />
            <Input
              disabled={disableCardDeets}
              type="text"
              name="account_number"
              defaultValue={settings?.accountNumber}
              labelName="Account Number"
              error={error}
              setError={setError}
            />
          </div>
          <div>
            <Input
              disabled={disableCardDeets}
              type="text"
              name="prefix"
              defaultValue={settings?.prefix}
              labelName="Invoice Prefix"
            />
            <Input
              type="text"
              disabled={disableCardDeets}
              name="dueAfter"
              defaultValue={settings?.dueAfter}
              labelName={
                <p className={styles.help}>
                  Due After
                  <HelpToolTip delay={0} helpMessage="Number of days after which sent invoice is due" />
                </p>
              }
              error={error}
              setError={setError}
            />
          </div>
          <div className={styles.btn}>
            <Button
              onClick={handleSave}
              disabled={disableCardDeets || !!Object.keys(error).length || !isFormValid(ref)}
              text="Save"
            />
            <Button
              onClick={() => setDisableCardDeets(false)}
              disabled={!disableCardDeets}
              text="Edit"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
export default InvoiceSettings
