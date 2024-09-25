import moment from 'moment'
import { useEffect, useState } from 'react'

import { getFirstTwoLetters, generateColor } from '_Home/common/utils'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { dateRenderer } from '_Home/components/renderers/renderers'

import { getTransactions } from './redux/actions'
import { genericChartData } from './constants'

export const dateFormat = 'YYYY-MM-DD'

export const useMoneyDash = () => {
  const dispatch = useAppDispatch()
  const {
    transaction: { transactions, loading },
    category: { categories, loading: catLoading },
    errorMessage,
  } = useAppSelector((state) => state.moneyTrack)
  const [selectedMonth, setSelectedMonth] = useState(moment())
  const dispatchedGetTransaction = (date: string) => dispatch(getTransactions(date))

  const stringifyMonth = (value: moment.Moment) => {
    return value.format(dateFormat)
  }
  const updateMonth = (value: Date | string) => {
    if (typeof value === 'string') {
      setSelectedMonth(moment(`${moment().year()}-${value}`))
    } else {
      setSelectedMonth(moment(value))
    }
  }

  const currentDate = new Date(stringifyMonth(selectedMonth))

  useEffect(() => {
    const date = stringifyMonth(selectedMonth)
    dispatchedGetTransaction(date)
  }, [selectedMonth])

  const chartData = transactions?.length
    ? transactions.map((trans) => ({
        name: dateRenderer(trans.createdAt),
        amount: trans.amount,
      }))
    : genericChartData

  const categoryList = transactions?.reduce((acc, curr) => {
    const category_name = curr.category ? curr.category.name : 'Unspecified' // Enforce categories on all transactions
    acc[category_name] = (acc[category_name] || 0) + curr.amount
    return acc
  }, {} as Record<string, number>)

  const transactionList = transactions?.length ? (
    transactions?.map((tran) => (
      <div className="transactions-list" key={tran.uuid}>
        <div>
          <div className="moneybag" style={{ background: generateColor('c8') }}>
            {getFirstTwoLetters(tran.description)}
          </div>
          <div className="description">
            <div>{tran.description}</div>
            <div>{dateRenderer(tran.createdAt)}</div>
          </div>
        </div>
        <div className={tran.source}>₦{tran.amount}</div>
      </div>
    ))
  ) : (
    <div className="error-message"> No transaction data </div>
  )

  return {
    transactions,
    transactionList,
    categoryList,
    chartData,
    updateMonth,
    selectedMonth,
    currentDate,
    loading,
    errorMessage,
  }
}
