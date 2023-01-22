import { Operation, Wallet } from '@prisma/client'
import { md } from 'telegram-md'
import { INITIAL_BALANCE } from '../constants'
import { formatAmount } from './formatAmount'
import { formatDate } from './formatDate'

export const formatOperation = (wallet: Wallet, operation: Operation) => {
  const name =
    operation.description === INITIAL_BALANCE
      ? operation.description
      : `${operation.description} (${operation.category})`
  const date = formatDate(operation.date)
  const amount = `${formatAmount(operation.amount, wallet.currency)}`
  return md`[${date}] ${md.bold(name)} на сумму ${md.bold(amount)}`
}
