import * as fns from 'date-fns'

export const formatDate = (date: Date | number) => {
  return fns.format(date, 'dd.MM HH:mm')
}
