import ClassNames from 'classnames'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import Wheel from '@uiw/react-color-wheel'
import { useMemo, useState } from 'react'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'
import { Button, Card, Input, Modal, Select, TextArea } from '_Home/components'
import { StatusCode } from '_Home/common/utils'

import { FrameDetails } from '../common/FrameDetails'
import { getContext, a } from '../constants'
import { useEffect } from 'react'
import { saveInvoice, setSelectedInvoice, updateInvoice } from '../redux/actions'
import styles from '../Invoice.module.styl'

const options = [
  { value: 'BT', label: 'Bank Transfer' },
  { value: 'CS', label: 'Cash' },
  { value: 'OT', label: 'Others' },
]
const defaultColorSection = {
  'Footer Bg': 'footerBg',
  Header: 'header',
  Accent: 'accent',
  Body: 'body',
}
export const InvoiceEdit = () => {
  const {
    invoice: { invoices, selectedInvoice, statusCode, loading },
    client: { clients },
  } = useAppSelector((state) => state.invoices)
  const { user } = useAppSelector((state) => state.user)
  const isAddRoute = useMatch('invoice/add/:id')
  const invoiceID = useParams().invoiceId
  const [displayColor, setDisplayColor] = useState<string>('')
  const [currentInvoiceItem, setCurrentInvoiceItem] = useState<number>(0)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const dispatchedUpdateInvoice = (data: Record<string, string | number>) =>
    dispatch(updateInvoice(data))

  const invoiceItems = selectedInvoice?.invoiceItems
  const templateSettings = selectedInvoice?.template?.settings

  useEffect(() => {
    if (!loading) {
      if (statusCode === StatusCode.CREATED) {
        navigate(`../../invoice/${selectedInvoice?.uuid}`)
      } else if (statusCode === StatusCode.SUCCESS) {
      }
    }
  }, [selectedInvoice, statusCode])

  useEffect(() => {
    if (isAddRoute) {
      dispatch(setSelectedInvoice({ invoiceID, type: 'new' }))
    } else {
      dispatch(setSelectedInvoice({ invoiceID, type: 'exist' }))
    }
  }, [invoices])

  const onHandleAdd = () => {
    setCurrentInvoiceItem(invoiceItems?.length)
    dispatchedUpdateInvoice({ section: 'add' })
  }

  const onHandleGenericChange = (e) => {
    dispatchedUpdateInvoice(e)
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

  const onClickInputColor = (value: string) => {
    setDisplayColor(value)
  }

  return (
    <SideBarLayout selectedKey={ROUTES.authenticatedRoutes.INVOICE.key} disableHide>
      <div className={styles.InvoiceEdit}>
        <div className={styles.header}>
          <h2>Edit Invoice {selectedInvoice?.name}</h2>
          <div className={styles.edit_actions}></div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <FrameDetails template={templateSettings?.html || ''} context={context} />
          </div>
          <div className={styles.form}>
            <Card className={styles.form_card} childrenClassName={styles.form_card_children}>
              <Button onClick={onHandleSave} text="Save" />
              <div className="input_group">
                <TextArea
                  placeholder="Write short description for invoice"
                  name="description"
                  rows={4}
                  cols={40}
                  labelName="Description"
                  defaultValue={selectedInvoice?.description}
                  onChange={(e) =>
                    onHandleGenericChange({
                      field: e.target.name,
                      res: e.target.value,
                      section: 'others',
                    })
                  }
                />
                {displayColor && (
                  <Wheel
                    color={templateSettings?.theme?.[displayColor || '#fff']}
                    onChange={(color) => onHandleColorChange(color.hex, displayColor, 'theme')}
                  />
                )}

                <div className={styles.halves}>
                  {Object.entries(defaultColorSection).map(([k, v]) => (
                    <Input
                      icon={
                        <div
                          style={{ width: '100%', height: '100%' }}
                          onClick={() => onClickInputColor(v)}
                        ></div>
                      }
                      iconStyle={{
                        backgroundColor: templateSettings?.theme[v],
                        cursor: 'pointer',
                      }}
                      type="text"
                      name={v}
                      labelName={`${k} Color`}
                      value={templateSettings?.theme[v]}
                      onChange={(e) => onHandleColorChange(e.target.value, v, 'theme')}
                    />
                  ))}
                </div>
                <div className={styles.halves}></div>
              </div>
              <div className={styles.edit_input_group}>
                <Select
                  label="Client"
                  defaultValue={{
                    label: selectedInvoice?.client?.name,
                    value: selectedInvoice?.client?.id,
                  }}
                  options={clients.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onChange={(e) => onHandleGenericChange({ id: e, section: 'client' })}
                />
                <div className={styles.halves}>
                  <Input
                    type="date"
                    name="dueDate"
                    labelName="DUE BY"
                    defaultValue={selectedInvoice?.dueDate}
                    onChange={(e) =>
                      onHandleGenericChange({
                        field: e.target.name,
                        res: e.target.value,
                        section: 'others',
                      })
                    }
                  />
                  <Input
                    type="text"
                    name="currency"
                    labelName="Currency"
                    defaultValue={selectedInvoice?.currency}
                    onChange={(e) =>
                      onHandleGenericChange({
                        field: e.target.name,
                        res: e.target.value,
                        section: 'others',
                      })
                    }
                  />
                </div>
                <div className={styles.invoice_items}>
                  <div className={styles.invoice_items_header}>
                    <h3 className="invoice_items_edit_header">Invoice Items</h3>
                    <Plus onClick={onHandleAdd} width={20} />
                  </div>
                  {!!invoiceItems?.length && (
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
                      <Trash2 onClick={onDeleteItem} width={16} />
                    </div>
                  )}
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
