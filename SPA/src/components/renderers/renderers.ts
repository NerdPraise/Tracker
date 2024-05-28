import moment from 'moment'

export const dateRenderer = (value: string, format = null) => {
  const date = moment(value)
  const currentDate = moment()
  // Use isSame
  // const isCurrentMonth = date.month === currentDate.month
  // const isCurrentYear = date.year === currentDate.year
  // if (isCurrentMonth && isCurrentYear) {
  //   return date.fromNow().
  // }

  return date.format(format || 'LLL')
}
