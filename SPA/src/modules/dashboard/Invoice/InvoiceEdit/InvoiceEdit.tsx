import { useMemo, useEffect } from 'react'
import { useMatch, useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Frame, Spacer } from '_Home/components'
import { StatusCode } from '_Home/common/utils'

import { getContext, a, b } from '../constants'
import { setSelectedInvoice, setSelectedTemplate } from '../redux/actions'
import { EditForm } from './EditForm'
import { useEdit } from './useEdit'

import styles from '../Invoice.module.styl'

export const InvoiceEdit = () => {
  const {
    invoice: { invoices, selectedInvoice, statusCode, loading, hasTemplateChanged },
    invoiceSettings: { settings },
    client: { clients },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const isAddRoute = useMatch('invoice/add/:id')
  const invoiceID = useParams().invoiceId
  const navigate = useNavigate()

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
    if (!loading) {
      if (statusCode === StatusCode.CREATED) {
        navigate(`../../invoice/${selectedInvoice?.uuid}`)
      } else if (statusCode === StatusCode.SUCCESS) {
        // For templates
        loadingRef.current?.complete()
      }
    }
  }, [selectedInvoice, statusCode])

  useEffect(() => {
    if (isAddRoute) {
      dispatch(setSelectedTemplate(isAddRoute.params.id))
      dispatch(setSelectedInvoice({ invoiceID, type: 'new' }))
    } else {
      dispatch(setSelectedInvoice({ invoiceID, type: 'exist' }))
    }
  }, [invoices])

  const context = useMemo(() => getContext(selectedInvoice, user, settings), [selectedInvoice, settings])

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceEdit}>
        <div className={styles.header}>
          <h2>
            <Link to={invoiceID ? `../${invoiceID}` : '../add'}>
              <ArrowLeft />
            </Link>
            Edit Invoice {selectedInvoice?.name}
          </h2>
          <div className={styles.edit_actions}></div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <Frame template={templateSettings?.html || ''} context={context} />
            <Spacer />
          </div>

          <EditForm
            ref={loadingRef}
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
