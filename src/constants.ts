export const MESSAGES = {
  addWallet: {
    start: 'Выйти из добавления кошелька можно при помощи /cancel',
    name: 'Введите название кошелька:',
    currency: 'Введите валюту кошелька:',
    balance: 'Введите начальный баланс кошелька:',
    done: (name: string, currency: string, balance: number) =>
      `Кошелек '${name}' с балансом '${balance} ${currency}' успешно добавлен`,
  },
}
