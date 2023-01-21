import * as fns from 'date-fns'
import { md } from 'telegram-md'
import { Category, Operation, Wallet } from './classes/ExpenseState'
import { formatAmount } from './utils/formatAmount'

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
    name: 'Введите название операции:',
    amount: 'Введите сумму операции:',
    done: (operation: Operation, wallet: Wallet, category: Category) =>
      md`Операция ${md.bold(
        `${operation.name} (${category.name})`
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
              md`${md.bold(operation.name)} [${fns.format(
                new Date(operation.date),
                'dd.MM HH:mm'
              )}]: ${formatAmount(operation.amount, wallet.currency)}`
          ),
        ],
        '\n'
      ),
  },
}
