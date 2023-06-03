import moment from 'moment'

export const dateRenderer = (value) => {
  const date = moment(value)
  const currentDate = moment()
  const isCurrentMonth = date.month === currentDate.month
  const isCurrentYear = date.year === currentDate.year
  if (isCurrentMonth && isCurrentYear) {
    return date.fromNow()
  }

  return date.format('LLL')
}
