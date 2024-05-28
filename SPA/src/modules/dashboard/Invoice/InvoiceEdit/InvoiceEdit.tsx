import ClassNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import Wheel from '@uiw/react-color-wheel'
import { useMemo, useRef, useState } from 'react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'
import { Button, Card, Input, Modal, Select } from '_Home/components'
import { StatusCode } from '_Home/common/utils'

import { FrameDetails } from '../common/FrameDetails'
import { getContext, a } from '../constants'
import { useEffect } from 'react'
import { saveInvoice, setSelectedClient, setSelectedInvoice, updateInvoice } from '../redux/actions'
import styles from '../Invoice.module.styl'

const options = [
  { value: 'BT', label: 'Bank Transfer' },
  { value: 'CS', label: 'Cash' },
  { value: 'OT', label: 'Others' },
]

export const InvoiceEdit = () => {
  const {
    invoice: { invoices, selectedInvoice },
    client: { clients },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const invoiceID = useParams().invoiceId
  const [currentInvoiceItem, setCurrentInvoiceItem] = useState<number>(0)
  const templateSettings = selectedInvoice?.template?.settings
  const dispatch = useAppDispatch()
  const dispatchedUpdateInvoice = (data: Record<string, string | number>) =>
    dispatch(updateInvoice(data))
  const invoiceItems = selectedInvoice?.invoiceItems
  // handle invoice state locally before saving to redux

  useEffect(() => {
    dispatch(setSelectedInvoice(invoiceID))
  }, [invoices])

  const onHandleAdd = () => {
    setCurrentInvoiceItem(invoiceItems?.length)
    dispatchedUpdateInvoice({ section: 'add' })
  }

  const onHandleClientChange = (e) => {
    dispatch(setSelectedClient(e))
  }

  const onHandleColorChange = (color: string, name: string, section: string) => {
    dispatchedUpdateInvoice({
      color,
      name,
      section,
    })
  }
  const onHandleInputChange = (e, ind) => {
    const { value, name } = e.target
    const data = { value, name, ind, section: 'invoiceItems' }
    dispatchedUpdateInvoice(data)
  }
  const onHandleSave = () => {
    dispatch(saveInvoice(selectedInvoice.uuid))
  }

  const onDeleteItem = () => {
    const data = { id: currentInvoiceItem, section: 'delete' }
    dispatchedUpdateInvoice(data)
    setCurrentInvoiceItem(0)
  }

  const context = useMemo(() => getContext(selectedInvoice, user), [selectedInvoice])
  const handleClose = () => {}

  return (
    <SideBarLayout selectedKey={ROUTES.authenticatedRoutes.INVOICE.key} disableHide>
      <div className={styles.InvoiceEdit}>
        <div className={styles.header}>
          <h2>Edit Invoice {selectedInvoice?.name}</h2>
          <div className={styles.edit_actions}></div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <FrameDetails template={a || ''} context={context} />
          </div>
          <div className={styles.form}>
            <Card className={styles.form_card} childrenClassName={styles.form_card_children}>
              <Plus onClick={onHandleAdd} />
              <Button onClick={onHandleSave} text="Save" />
              <div className="input_group">
                <Wheel
                  color={templateSettings?.theme?.footerBg}
                  onChange={(color) => onHandleColorChange(color.hex, 'footerBg', 'theme')}
                />
                <Input
                  type="text"
                  name="footerBg"
                  labelName="Footer Color"
                  value={selectedInvoice?.template.settings.theme.footerBg}
                  onChange={(e) => onHandleColorChange(e.target.value, 'footerBg', 'theme')}
                />
                <Input
                  type="text"
                  name="header"
                  labelName="Header Color"
                  value={selectedInvoice?.template.settings.theme.header}
                  onChange={(e) => onHandleColorChange(e.target.value, 'header', 'theme')}
                />
                <Input
                  type="text"
                  name="accent"
                  labelName="Accent Color"
                  value={selectedInvoice?.template.settings.theme.accent}
                  onChange={(e) => onHandleColorChange(e.target.value, 'accent', 'theme')}
                />
              </div>
              <div className={styles.edit_input_group}>
                <Select
                  label="Client"
                  defaultValue={{
                    label: selectedInvoice?.client.name,
                    value: selectedInvoice?.client.id,
                  }}
                  options={clients.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onChange={onHandleClientChange}
                />
                <div className={styles.invoice_items}>
                  <h3 className="invoice_items_edit_header">Invoice Items</h3>
                  <div className={styles.dots_container}>
                    <div className={styles.dots} style={{ width: (invoiceItems?.length + 2) * 6 }}>
                      {invoiceItems?.map((_, ind) => (
                        <div
                          className={ClassNames(styles.dot, {
                            [styles.dot_active]: ind === currentInvoiceItem,
                          })}
                          onClick={() => setCurrentInvoiceItem(ind)}
                        ></div>
                      ))}
                    </div>
                    <Trash2 onClick={onDeleteItem} />
                  </div>
                  {invoiceItems?.map((item, ind) => (
                    <div
                      className={ClassNames(styles.input_group, {
                        [styles.active_it]: ind === currentInvoiceItem,
                      })}
                    >
                      <Input
                        type="text"
                        name="description"
                        labelName="Description"
                        defaultValue={item.description}
                        onChange={(e) => onHandleInputChange(e, ind)}
                      />

                      <div className={styles.halves}>
                        <Input
                          type="number"
                          min={0}
                          name="quantity"
                          labelName="Quantity"
                          defaultValue={item.quantity}
                          onChange={(e) => onHandleInputChange(e, ind)}
                        />
                        <Input
                          type="number"
                          min={0}
                          name="unitPrice"
                          labelName="Rate"
                          defaultValue={item.unitPrice}
                          onChange={(e) => onHandleInputChange(e, ind)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <Modal
            className={styles.FrameDetailsModal}
            isVisible={false}
            handleClose={handleClose}
            width="md"
          >
            s
          </Modal>
        </div>
      </div>
    </SideBarLayout>
  )
}
