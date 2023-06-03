import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import MoneyBagIcon from '_Images/moneybag.svg'
import { getFirstTwoLetters, generateColor } from '_Home/utils'
import { dateRenderer } from '_Home/components/renderers/renderers'

import { getTransactions } from './redux/actions'
import { genericChartData } from './MoneyDash.constants'
import { dateFormat } from './constants'

window.moment = moment
export const useMoneyDash = () => {
  const dispatch = useDispatch()
  const { track, loading, errorMessage } = useSelector((state) => state.moneyTrack)
  const [selectedMonth, setSelectedMonth] = useState(moment())

  const getMonth = (value) => {
    const date = value || moment()
    return date.format(dateFormat)
  }
  const setMonth = (value) => {
    if (typeof value === 'string') {
      setSelectedMonth(moment(`${moment().year()}-${value}`))
    } else {
      setSelectedMonth(moment(value))
    }
  }

  const calendarDate = new Date(getMonth(selectedMonth))

  const { transactions, category } = track
  const filteredCategory = category ? [...category] : []

  useEffect(() => {
    const date = getMonth(selectedMonth)
    dispatch(getTransactions(date))
  }, [selectedMonth])

  const rowData = transactions || []

  const chartData = transactions?.length
    ? transactions.map((trans) => ({
        name: dateRenderer(trans.createdAt),
        amount: trans.amount,
      }))
    : genericChartData

  const categoryList = filteredCategory?.splice(1, 3)?.map((cate) => {
    return (
      <div key={cate[0]} className="category-item">
        <div className="logo" style={{ background: generateColor('c8') }}>
          <img src={MoneyBagIcon} alt="" />
        </div>
        <div className="category-description">
          <div className="category-money">
            <span>₦</span>
            <span>{cate[1].toLocaleString()}</span>
          </div>
          <small>{cate[0]}</small>
        </div>
      </div>
    )
  })

  const transactionList = track?.transactions?.length ? (
    track?.transactions?.map((tran) => (
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
    transactionList,
    categoryList,
    chartData,
    rowData,
    setMonth,
    selectedMonth,
    calendarDate,
    loading,
    errorMessage,
  }
}
