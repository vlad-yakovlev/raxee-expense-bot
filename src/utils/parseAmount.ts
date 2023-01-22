import { AMOUNT_MULTIPLIER } from '../constants'

export const parseAmount = (amount: string | undefined) => {
  return Math.round(Number(amount) * AMOUNT_MULTIPLIER)
}
