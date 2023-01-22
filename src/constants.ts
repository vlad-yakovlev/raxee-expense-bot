import { Operation, Wallet } from '@prisma/client'
import { md } from 'telegram-md'
import { formatAmount } from './utils/formatAmount'
import { formatDate } from './utils/formatDate'
import { formatOperation } from './utils/formatOperation'

export const AMOUNT_MULTIPLIER = 1e4
export const LAST_OPERATIONS_COUNT = 10

export const INITIAL_BALANCE = 'Начальный баланс'

export const MESSAGES = {
  addWallet: {
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    balance: 'Введите начальный баланс кошелька:',
    done: (wallet: Wallet, balance: number) =>
      md`Кошелек ${md.bold(wallet.name)} с балансом ${md.bold(
        `${formatAmount(balance, wallet.currency)}`
      )} успешно добавлен`,
  },

  editWallet: {
    wallet: 'Выберите кошелек:',
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    done: (wallet: Wallet) =>
      md`Кошелек ${md.bold(wallet.name)} успешно обновлен`,
  },

  addOperation: {
    wallet: 'Выберите кошелек:',
    category: 'Введите название категории:',
    description: 'Введите описание операции:',
    amount: 'Введите сумму операции:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${formatOperation(wallet, operation)} успешно добавлена`,
  },

  editOperation: {
    operation: 'Выберите операцию:',
    wallet: 'Выберите кошелек:',
    category: 'Введите название категории:',
    description: 'Введите описание операции:',
    amount: 'Введите сумму операции:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${formatOperation(wallet, operation)} успешно обновлена`,
  },

  showBalances: {
    done: (balances: { wallet: Wallet; balance: number }[]) =>
      md.join(
        [
          `Балансы кошельков на ${formatDate(Date.now())}:`,
          ...balances.map(
            ({ wallet, balance }) =>
              md`${md.bold(wallet.name)}: ${formatAmount(
                balance,
                wallet.currency
              )}`
          ),
        ],
        '\n\n'
      ),
  },

  showLastOperations: {
    wallet: 'Выберите кошелек:',
    done: (wallet: Wallet, operations: Operation[], count: number) =>
      md.join(
        [
          md`Последние ${count} операций по кошельку ${md.bold(wallet.name)}:`,
          ...operations.map(
            (operation) => md`${formatOperation(wallet, operation)}`
          ),
        ],
        '\n\n'
      ),
  },
}
