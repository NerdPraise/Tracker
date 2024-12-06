import { forwardRef, MutableRefObject, useEffect, useRef, useState } from 'react'
import ClassNames from 'classnames'
import { Camera, Plus, Trash2 } from 'lucide-react'
import Wheel from '@uiw/react-color-wheel'
import LoadingBar from 'react-top-loading-bar'
import { color as colorFunc, hexToHsva } from '@uiw/color-convert'
import { formatDate } from 'date-fns'
import { motion } from 'framer-motion'
import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'
import { ColorResult } from '@uiw/color-convert'

import {
  Button,
  Card,
  Input,
  Select,
  TextArea,
  Dropdown,
  DatePicker,
  Modal,
  HelpToolTip,
} from '_Home/components'
import { capitalise, convertStringToColor, screenshotElement, StatusCode } from '_Home/common/utils'
import { currencyOptions } from '_Home/constants'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { saveInvoice, updateInvoice, saveTemplate, createUserClient } from '../redux/actions'

import styles from '../Invoice.module.styl'

const validateFields = {
  client: 'Specify a client',
}

export const EditForm = forwardRef(function EditForm(
  {
    invoiceItems,
    currentInvoiceItem,
    setCurrentInvoiceItem,
    onHandleAdd,
    selectedInvoice,
    defaultCurrencyOption,
    displayColor,
    onClickInputColor,
    templateSettings,
    defaultOption,
    options,
    hasTemplateChanged,
    frameRef,
  }: {
    frameRef?: MutableRefObject<HTMLDivElement>
    invoiceItems: IInvoiceItems[]
    currentInvoiceItem: number
    setCurrentInvoiceItem: React.Dispatch<React.SetStateAction<number>>
    onHandleAdd: VoidFunction
    selectedInvoice: IInvoice
    defaultCurrencyOption: Record<'label' | 'value', string>
    displayColor: string
    onClickInputColor: (value: string) => void
    templateSettings: {
      html: string
      theme: ITheme
    }
    defaultOption: Record<'label' | 'value', string | number>
    options: Record<'label' | 'value', string | number>[]
    hasTemplateChanged: boolean
  },
  ref: any,
) {
  const { loading, statusCode, errorMessage } = useAppSelector((state) => state.invoices.client)
  const dispatch = useAppDispatch()
  const [error, setError] = useState({})
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const onHandleSaveTemplate = () => {
    ref.current?.continuousStart()
    screenshotElement(frameRef, (e: string) => dispatch(saveTemplate(e)))
  }
  const dispatchedUpdateInvoice = (data: Record<string, string | number | ColorResult>) =>
    dispatch(updateInvoice(data))

  const handleCreateContact = () => {
    const formData = new FormData(formRef.current)
    dispatch(createUserClient(formData))
  }

  const onHandleColorChange = (color: ColorResult, name: string, section: string) => {
    dispatchedUpdateInvoice({
      color,
      name,
      section,
    })
  }
  const onHandleGenericChange = (e) => {
    dispatchedUpdateInvoice(e)
  }
  const onHandleLogoChange = (e) => {
    const file = e.target.files[0]

    // Encode the file using the FileReader API
    const reader = new FileReader()
    reader.onloadend = () => {
      onHandleGenericChange({
        logo: reader.result,
        section: 'logo',
      })
      console.log(reader.result)
    }
    reader.readAsDataURL(file)
  }
  const onHandleInputChange = (e, ind) => {
    const { value, name } = e.target
    const data = { value, name, ind, section: 'invoiceItems' }
    dispatchedUpdateInvoice(data)
  }
  const onHandleSave = () => {
    ref.current?.continuousStart()
    dispatch(saveInvoice(selectedInvoice.uuid))
  }

  const onDeleteItem = () => {
    const data = { id: currentInvoiceItem, section: 'delete' }
    dispatchedUpdateInvoice(data)
    setCurrentInvoiceItem(0)
  }

  useEffect(() => {
    if (!loading && statusCode === StatusCode.CREATED) {
      setOpen(false)
    }
  }, [statusCode, loading])
  // console.log(templateSettings?.html)

  return (
    <div className={styles.form}>
      <Card className={styles.form_card} childrenClassName={styles.form_card_children}>
        <LoadingBar ref={ref} color="#c770fe" />
        <div className={styles.toolbar_head}>
          <h3>Your Invoice Toolbar</h3>
          <p>Update your invoice as needed</p>
        </div>
        <Root defaultValue="invoice" orientation="vertical" className={styles.form_root}>
          <List className={styles.tab_list}>
            <Trigger className={styles.trigger} value="invoice" asChild>
              <motion.div>Invoice</motion.div>
            </Trigger>
            <Trigger className={styles.trigger} value="templates" asChild>
              <motion.div>Template</motion.div>
            </Trigger>
            <Trigger className={styles.trigger} value="client" asChild>
              <motion.div>Client</motion.div>
            </Trigger>
          </List>
          <div className={styles.tab_content_cont}>
            <Content value="invoice" className={styles.tab_content}>
              <div className={styles.invoice_items}>
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
                    key={ind}
                  >
                    <Input
                      type="text"
                      name="description"
                      errorName={`description${ind}`}
                      labelName="Description"
                      defaultValue={item.description}
                      onChange={(e) => onHandleInputChange(e, ind)}
                      error={error}
                      setError={setError}
                    />

                    <div className={styles.halves}>
                      <Input
                        type="number"
                        min={0}
                        errorName={`quantity` + ind}
                        name="quantity"
                        labelName="Quantity"
                        defaultValue={item.quantity}
                        onChange={(e) => onHandleInputChange(e, ind)}
                        error={error}
                        setError={setError}
                      />
                      <Input
                        type="number"
                        min={0}
                        name="unitPrice"
                        errorName={`unitPrice` + ind}
                        labelName="Rate"
                        defaultValue={item.unitPrice}
                        onChange={(e) => onHandleInputChange(e, ind)}
                        error={error}
                        setError={setError}
                      />
                    </div>
                  </div>
                ))}
                <p onClick={onHandleAdd} className={styles.add_item}>
                  <Plus width={16} /> Add new invoice item
                </p>
                <div className={styles.edit_input_group}>
                  <div className={styles.halves}>
                    <div>
                      <DatePicker
                        className={styles.datepicker}
                        label="Due By"
                        selected={selectedInvoice?.dueDate}
                        dateFormat="yyyy-MM-dd"
                        onSelect={(date) =>
                          onHandleGenericChange({
                            field: 'dueDate',
                            resVal: formatDate(date, 'yyyy-MM-dd'),
                            section: 'others',
                          })
                        }
                      />
                    </div>

                    <Select
                      className={styles.select}
                      label="Currency"
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
                </div>
              </div>
              <TextArea
                className={styles.textarea}
                placeholder="Specify extra information e.g. NUBAN e.t.c."
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
            </Content>
            <Content value="templates" className={styles.tab_content}>
              <div className="input_group">
                <div className={styles.halves}>
                  {Object.entries(templateSettings?.theme || {})
                    .filter(([k, v]) => !k.includes('__hsva'))
                    .filter(([k, v]) => k !== 'logo')
                    .map(([k, v], index) => (
                      <Input
                        key={index}
                        className={styles.color_input}
                        icon={
                          <Dropdown
                            className={styles.formDropdown}
                            open={displayColor === k}
                            modal={false}
                            trigger={
                              <div
                                style={{ width: '100%', height: '100%' }}
                                onClick={() => onClickInputColor(k)}
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
                                    onChange={(color) =>
                                      onHandleColorChange(color, displayColor, 'theme')
                                    }
                                  />
                                ),
                              },
                            ]}
                          />
                        }
                        iconStyle={{
                          backgroundColor: v as string,
                          cursor: 'pointer',
                        }}
                        type="text"
                        name={k}
                        labelName={`${capitalise(k)} Color`}
                        value={v}
                        onChange={(e) =>
                          onHandleColorChange(
                            colorFunc(convertStringToColor(e.target.value)),
                            k,
                            'theme',
                          )
                        }
                      />
                    ))}
                </div>
              </div>
              <div className="input_group">
                <div className={styles.halves}>
                  {Object.entries(templateSettings?.theme || {})
                    .filter(([k, v]) => k === 'logo')
                    .map((i) => (
                      <label
                        htmlFor="logo"
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={onHandleLogoChange}
                          className={styles.file_upload}
                          style={{ display: 'none', visibility: 'hidden' }}
                        />
                        <Camera />
                        <span style={{ marginLeft: '10px' }}>Upload logo</span>
                      </label>
                    ))}
                </div>
              </div>
            </Content>
            <Content value="client" className={styles.tab_content}>
              <Select
                label="Client"
                defaultValue={defaultOption}
                options={options}
                onChange={(e) => onHandleGenericChange({ id: e, section: 'client' })}
              />
              <p onClick={() => setOpen(true)} className={styles.add_item}>
                <Plus width={16} /> Add client
              </p>
            </Content>
          </div>
        </Root>

        <div className={styles.btn_area}>
          <Button onClick={onHandleSave} text="Save" />
          <Button
            onClick={onHandleSaveTemplate}
            text="Save Template"
            disabled={!hasTemplateChanged || !selectedInvoice.uuid}
          />
          <HelpToolTip delay={0} helpMessage="Save an invoice to allow template changes" />
        </div>
      </Card>
      <Modal
        isVisible={open}
        width="md"
        className={styles.ContactModal}
        handleClose={() => setOpen(false)}
      >
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.input_group}>
            <Input
              labelName={
                <p className={styles.label_name}>
                  Email Address <span>*</span>
                </p>
              }
              type="email"
              name="email"
            />
            <Input
              labelName={
                <p className={styles.label_name}>
                  Name <span>*</span>
                </p>
              }
              type="text"
              name="name"
            />
          </div>
          <div className={styles.send_btn}>
            <Button text="Add contact" onClick={handleCreateContact} />
          </div>
          <p className="error small" dangerouslySetInnerHTML={{ __html: errorMessage }} />
        </form>
      </Modal>
    </div>
  )
})
