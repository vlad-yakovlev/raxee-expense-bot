import { AMOUNT_MULTIPLIER } from '../constants'

export const formatAmount = (amount: number, currency: string) => {
  return `${(amount / AMOUNT_MULTIPLIER).toFixed(2)}${currency}`
}
