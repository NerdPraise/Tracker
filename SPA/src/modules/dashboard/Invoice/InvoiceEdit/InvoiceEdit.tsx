import { useMemo, useState, useEffect, useRef } from 'react'
import { useMatch, useNavigate, useParams, Link } from 'react-router-dom'
import ClassNames from 'classnames'
import { Plus, Trash2, MoveLeft } from 'lucide-react'
import Wheel from '@uiw/react-color-wheel'
import LoadingBar from 'react-top-loading-bar'
import { color as colorFunc, hexToHsva, ColorResult } from '@uiw/color-convert'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Button, Card, Input, Select, TextArea, Dropdown } from '_Home/components'
import { convertStringToColor, StatusCode } from '_Home/common/utils'

import { FrameDetails } from '../common/FrameDetails'
import { getContext, a } from '../constants'
import {
  saveInvoice,
  setSelectedInvoice,
  updateInvoice,
  saveTemplate,
  setSelectedTemplate,
} from '../redux/actions'
import styles from '../Invoice.module.styl'

const defaultColorSection = {
  'Footer Bg': 'footerBg',
  Header: 'header',
  Accent: 'accent',
  Body: 'body',
}

const currencyOptions = [{ label: 'USD', value: 'USD' }]

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
  const [displayColor, setDisplayColor] = useState<string>('')
  const [currentInvoiceItem, setCurrentInvoiceItem] = useState<number>(0)
  const navigate = useNavigate()
  const dispatchedUpdateInvoice = (data: Record<string, string | number | ColorResult>) =>
    dispatch(updateInvoice(data))
  const loadingRef = useRef(null)

  const invoiceItems = selectedInvoice?.invoiceItems
  const templateSettings = selectedInvoice?.template?.settings

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

  const onHandleAdd = () => {
    setCurrentInvoiceItem(invoiceItems?.length)
    dispatchedUpdateInvoice({ section: 'add' })
  }

  const onHandleSaveTemplate = () => {
    loadingRef.current?.continuousStart()
    dispatch(saveTemplate())
  }

  const onHandleGenericChange = (e) => {
    dispatchedUpdateInvoice(e)
  }

  const onHandleColorChange = (color: ColorResult, name: string, section: string) => {
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
    loadingRef.current?.continuousStart()
    dispatch(saveInvoice(selectedInvoice.uuid))
  }

  const onDeleteItem = () => {
    const data = { id: currentInvoiceItem, section: 'delete' }
    dispatchedUpdateInvoice(data)
    setCurrentInvoiceItem(0)
  }

  const context = useMemo(() => getContext(selectedInvoice, user, settings), [selectedInvoice, settings])
  const handleClose = () => {}

  const onClickInputColor = (value: string) => {
    if (displayColor === value) {
      setDisplayColor('')
    } else {
      setDisplayColor(value)
    }
  }
  const options = clients.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const defaultOption = options.find(
    (item) => item.label === selectedInvoice?.client?.name && item.value === selectedInvoice?.client?.id,
  )
  const defaultCurrencyOption = currencyOptions.find((item) => item.label === selectedInvoice?.currency)
  console.log(defaultCurrencyOption)

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceEdit}>
        <div className={styles.header}>
          <h2>
            <Link to={invoiceID ? `../${invoiceID}` : '../add'}>
              <MoveLeft />
            </Link>
            Edit Invoice {selectedInvoice?.name}
          </h2>
          <div className={styles.edit_actions}></div>
        </div>
        <div className={styles.details}>
          <div className={styles.frame}>
            <FrameDetails template={templateSettings?.html || ''} context={context} />
          </div>

          <div className={styles.form}>
            <Card className={styles.form_card} childrenClassName={styles.form_card_children}>
              <LoadingBar ref={loadingRef} color="#c770fe" />
              <div className={styles.btn_area}>
                <Button onClick={onHandleSave} text="Save" />
                <Button
                  onClick={onHandleSaveTemplate}
                  text="Save Template"
                  disabled={!hasTemplateChanged || !selectedInvoice?.uuid.length}
                />
              </div>
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
                      resVal: e.target.value,
                      section: 'others',
                    })
                  }
                />
                <div className={styles.halves}>
                  {Object.entries(defaultColorSection).map(([k, v], index) => (
                    <Input
                      key={index}
                      icon={
                        <Dropdown
                          className={styles.formDropdown}
                          open={displayColor === v}
                          modal={false}
                          trigger={
                            <div
                              style={{ width: '100%', height: '100%' }}
                              onClick={() => onClickInputColor(v)}
                            />
                          }
                          items={[
                            {
                              child: (
                                <Wheel
                                  color={
                                    templateSettings?.theme?.[`${displayColor}__hsva`] ||
                                    hexToHsva(templateSettings?.theme?.[displayColor] || '#fff')
                                  }
                                  onChange={(color) => onHandleColorChange(color, displayColor, 'theme')}
                                />
                              ),
                            },
                          ]}
                        />
                      }
                      iconStyle={{
                        backgroundColor: templateSettings?.theme[v],
                        cursor: 'pointer',
                      }}
                      type="text"
                      name={v}
                      labelName={`${k} Color`}
                      value={templateSettings?.theme[v]}
                      onChange={(e) =>
                        onHandleColorChange(colorFunc(convertStringToColor(e.target.value)), v, 'theme')
                      }
                    />
                  ))}
                </div>
                <div className={styles.halves}></div>
              </div>
              <div className={styles.edit_input_group}>
                <Select
                  label="Client"
                  defaultValue={defaultOption}
                  options={options}
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
                        resVal: e.target.value,
                        section: 'others',
                      })
                    }
                  />
                  <Select
                    className={styles.select}
                    label="Currency"
                    defaultValue={defaultCurrencyOption}
                    options={currencyOptions}
                    onChange={(e) =>
                      onHandleGenericChange({
                        field: 'currency',
                        resVal: e,
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
        </div>
      </div>
    </SideBarLayout>
  )
}
