export const formatAmount = (amount: number, currency: string) => {
  return `${amount.toFixed(2)}${currency}`
}
