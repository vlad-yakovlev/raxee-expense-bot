import { Operation, Wallet } from '@prisma/client'
import { md } from 'telegram-md'
import { formatAmount } from './utils/formatAmount'
import { formatDate } from './utils/formatDate'
import { formatOperation } from './utils/formatOperation'

export const AMOUNT_MULTIPLIER = 1e4
export const LAST_OPERATIONS_COUNT = 50

export const INITIAL_BALANCE = 'Начальный баланс'
export const EXCHANGE = 'Обмен 💱'
export const DO_NOT_CHANGE = '[Не менять]'

export const MESSAGES = {
  createWallet: {
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    balance: 'Введите начальный баланс кошелька:',
    done: (wallet: Wallet, balance: number) =>
      md`Кошелек ${md.bold(wallet.name)} с балансом ${md.bold(
        `${formatAmount(balance, wallet.currency)}`
      )} успешно добавлен`,
  },

  updateWallet: {
    wallet: 'Выберите кошелек:',
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    done: (wallet: Wallet) =>
      md`Кошелек ${md.bold(wallet.name)} успешно обновлен`,
  },

  createOperation: {
    wallet: 'Выберите кошелек:',
    category: 'Выберите или введите название категории:',
    description: 'Введите описание операции:',
    type: 'Выберите тип операции:',
    amount: 'Введите сумму операции:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${formatOperation(wallet, operation)} успешно добавлена`,
  },

  updateOperation: {
    operation: 'Выберите операцию:',
    wallet: 'Выберите кошелек:',
    category: 'Выберите или введите название категории:',
    description: 'Введите описание операции:',
    type: 'Выберите тип операции:',
    amount: 'Введите сумму операции:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${formatOperation(wallet, operation)} успешно обновлена`,
  },

  deleteOperation: {
    operation: 'Выберите операцию:',
    done: (wallet: Wallet, operation: Operation) =>
      md`Операция ${formatOperation(wallet, operation)} успешно удалена`,
  },

  createExchangeOperation: {
    walletFrom: 'Выберите кошелек списания:',
    walletTo: 'Выберите кошелек пополнения:',
    amountFrom: 'Введите сумму списания:',
    amountTo: 'Введите сумму пополнения:',
    done: (
      walletFrom: Wallet,
      walletTo: Wallet,
      amountFrom: number,
      amountTo: number
    ) => {
      const from = formatAmount(amountFrom, walletFrom.currency)
      const to = formatAmount(amountTo, walletTo.currency)
      return md`Операция обмена ${md.bold(`${from} → ${to}`)} успешно добавлена`
    },
  },

  renameCategory: {
    from: 'Выберите категорию:',
    to: 'Введите новое название категории:',
    done: (from: string, to: string) =>
      md`Категория ${md.bold(from)} успешно переименована в ${md.bold(to)}`,
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
            (operation) => md`${formatOperation(wallet, operation)}`
          ),
        ],
        '\n\n'
      ),
  },
}
