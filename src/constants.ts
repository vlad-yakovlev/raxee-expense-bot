import { Category, Operation, Wallet } from './classes/ExpenseState'

export const MESSAGES = {
  addWallet: {
    start: 'Выйти из добавления кошелька можно при помощи /cancel',
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    balance: 'Введите начальный баланс кошелька:',
    done: (wallet: Wallet, balance: number) =>
      `Кошелек '${wallet.name}' с балансом '${balance} ${wallet.currency}' успешно добавлен`,
  },

  addOperation: {
    start: 'Выйти из добавления операции можно при помощи /cancel',
    wallet: 'Выберите кошелек:',
    category: 'Введите название категории:',
    type: 'Выберите тип операции:',
    name: 'Введите название операции:',
    amount: 'Введите сумму операции:',
    done: (operation: Operation, wallet: Wallet, category: Category) =>
      `Операция '${operation.name}' (${category.name}) на сумму '${operation.amount} ${wallet.currency}' успешно добавлена`,
  },
}
