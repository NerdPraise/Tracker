import { useState, useRef, useMemo } from 'react'
import { ColorResult } from '@uiw/color-convert'

import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { currencyOptions } from '_Home/constants'

import { updateInvoice } from '../redux/actions'

export const useEdit = () => {
  const {
    invoice: { selectedInvoice },
    client: { clients },
    invoiceSettings: {
      settings: { defaultCurrency },
    },
  } = useAppSelector((state) => state.invoices)
  const dispatch = useAppDispatch()
  const [displayColor, setDisplayColor] = useState<string>('')
  const [currentInvoiceItem, setCurrentInvoiceItem] = useState<number>(0)
  const dispatchedUpdateInvoice = (data: Record<string, string | number | ColorResult>) =>
    dispatch(updateInvoice(data))
  const loadingRef = useRef(null)

  const invoiceItems = selectedInvoice?.invoiceItems
  const templateSettings = selectedInvoice?.template?.settings

  const onHandleAdd = () => {
    setCurrentInvoiceItem(invoiceItems?.length)
    dispatchedUpdateInvoice({ section: 'add' })
  }

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
  const defaultCurrencyOption = useMemo(
    () => currencyOptions.find((item) => item.label === (selectedInvoice?.currency || defaultCurrency)),
    [selectedInvoice, defaultCurrency],
  )
  console.log(defaultCurrencyOption, selectedInvoice?.currency)

  return {
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
    loadingRef,
  }
}
