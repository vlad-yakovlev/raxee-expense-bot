import { formatOperation } from './formatOperation'

it('should return formatted operation in md', () => {
  expect(
    String(
      formatOperation(
        {
          id: 'wallet-id',
          chatId: 'chat-id',
          name: 'WalletName',
          currency: '$',
        },
        {
          id: 'operation-id',
          description: 'OperationDescription',
          date: new Date(2023, 0, 15, 12, 35, 47),
          amount: 12345678,
          category: 'OperationCategory',
          walletId: 'wallet-id',
        }
      )
    )
  ).toBe(
    '\\[15\\.01 12:35\\] *OperationDescription \\(OperationCategory\\)* на сумму *1234\\.57$*'
  )
})

it('should return formatted operation in md without category for initial balance', () => {
  expect(
    String(
      formatOperation(
        {
          id: 'wallet-id',
          chatId: 'chat-id',
          name: 'WalletName',
          currency: '$',
        },
        {
          id: 'operation-id',
          description: 'Начальный баланс',
          date: new Date(2023, 0, 15, 12, 35, 47),
          amount: 12345678,
          category: 'Начальный баланс',
          walletId: 'wallet-id',
        }
      )
    )
  ).toBe('\\[15\\.01 12:35\\] *Начальный баланс* на сумму *1234\\.57$*')
})
