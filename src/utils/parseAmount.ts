import { AMOUNT_MULTIPLIER } from '../constants'

export const parseAmount = (amount: string | undefined) => {
  return Number(amount) * AMOUNT_MULTIPLIER
}
