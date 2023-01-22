import { Operation, Wallet } from '@prisma/client'
import * as fns from 'date-fns'
import { md } from 'telegram-md'
import { formatAmount } from './utils/formatAmount'

export const AMOUNT_MULTIPLIER = 1e4
export const LAST_OPERATIONS_COUNT = 10

export const INITIAL_BALANCE = 'Начальный баланс'

export const MESSAGES = {
  addWallet: {
    start: 'Выйти из добавления кошелька можно при помощи /cancel',
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    balance: 'Введите начальный баланс кошелька:',
    done: (wallet: Wallet, balance: number) =>
      md`Кошелек ${md.bold(wallet.name)} с балансом ${md.bold(
        `${formatAmount(balance, wallet.currency)}`
      )} успешно добавлен`,
  },

  addOperation: {
    start: 'Выйти из добавления операции можно при помощи /cancel',
    wallet: 'Выберите кошелек:',
    category: 'Введите название категории:',
    type: 'Выберите тип операции:',
    description: 'Введите описание операции:',
    amount: 'Введите сумму операции:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${md.bold(
        `${operation.description} (${operation.category})`
      )} на сумму ${md.bold(
        `${formatAmount(operation.amount, wallet.currency)}`
      )} успешно добавлена`,
  },

  showBalances: {
    done: (balances: { wallet: Wallet; balance: number }[]) =>
      md.join(
        balances.map(
          ({ wallet, balance }) =>
            md`${md.bold(wallet.name)}: ${formatAmount(
              balance,
              wallet.currency
            )}`
        ),
        '\n'
      ),
  },

  showLastOperations: {
    wallet: 'Выберите кошелек:',
    done: (wallet: Wallet, operations: Operation[], count: number) =>
      md.join(
        [
          md`Последние ${count} операций по кошельку ${md.bold(wallet.name)}:`,
          ...operations.map(
            (operation) =>
              md`${md.bold(operation.description)} [${fns.format(
                new Date(operation.date),
                'dd.MM HH:mm'
              )}]: ${formatAmount(operation.amount, wallet.currency)}`
          ),
        ],
        '\n'
      ),
  },
}
