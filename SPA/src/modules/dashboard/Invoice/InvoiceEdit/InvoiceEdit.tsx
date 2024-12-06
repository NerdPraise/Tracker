import { useMemo, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Frame, Spacer } from '_Home/components'
import { StatusCode } from '_Home/common/utils'

import { getContext, a, b } from '../constants'
import { setSelectedInvoice } from '../redux/actions'
import { EditForm } from './EditForm'
import { useEdit } from './useEdit'

import styles from '../Invoice.module.styl'

export const InvoiceEdit = () => {
  const {
    invoice: { invoices, selectedInvoice, statusCode, loading, hasTemplateChanged },
    invoiceSettings: { settings },
    template: { selectedTemplate },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const invoiceID = useParams().invoiceId
  const navigate = useNavigate()
  const frameRef = useRef<HTMLDivElement>(null)

  const {
    invoiceItems,
    currentInvoiceItem,
    setCurrentInvoiceItem,
    onHandleAdd,
    defaultCurrencyOption,
    displayColor,
    onClickInputColor,
    defaultOption,
    options,
    templateSettings,
    loadingRef,
  } = useEdit()

  useEffect(() => {
    if (invoiceID === 'temp' && !Object.keys(selectedTemplate).length) {
      navigate('../add')
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      if (statusCode === StatusCode.CREATED) {
        console.log('NAH THIS RUNS')
        navigate(`../../invoice/${selectedInvoice?.uuid}`)
      } else if (statusCode === StatusCode.SUCCESS) {
        // For templates
        loadingRef.current?.complete()
      }
    }
  }, [selectedInvoice, statusCode])

  useEffect(() => {
    if (invoiceID === 'temp' && selectedInvoice?.uuid) {
      console.log('THIS RUNS')
      navigate(`../${selectedInvoice.uuid}`)
    }
  }, [selectedInvoice])

  useEffect(() => {
    dispatch(setSelectedInvoice({ invoiceID }))
  }, [invoices])

  const context = useMemo(() => getContext(selectedInvoice, user, settings), [selectedInvoice, settings])

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceEdit}>
        <div className={styles.header}>
          <h2>
            <Link to={invoiceID !== 'temp' ? `../${invoiceID}` : '../add'}>
              <ArrowLeft />
            </Link>
            Edit Invoice {selectedInvoice?.name}
          </h2>
          <div className={styles.edit_actions}></div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <Frame frameRef={frameRef} template={templateSettings?.html || ''} context={context} />
            <Spacer />
          </div>

          <EditForm
            ref={loadingRef}
            frameRef={frameRef}
            invoiceItems={invoiceItems}
            currentInvoiceItem={currentInvoiceItem}
            setCurrentInvoiceItem={setCurrentInvoiceItem}
            onHandleAdd={onHandleAdd}
            defaultCurrencyOption={defaultCurrencyOption}
            displayColor={displayColor}
            onClickInputColor={onClickInputColor}
            defaultOption={defaultOption}
            options={options}
            templateSettings={templateSettings}
            selectedInvoice={selectedInvoice}
            hasTemplateChanged={hasTemplateChanged}
          />
        </div>
      </div>
    </SideBarLayout>
  )
}
