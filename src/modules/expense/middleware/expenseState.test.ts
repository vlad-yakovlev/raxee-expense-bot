import { expenseStateMiddleware } from './expenseState'

jest.mock('@grammyjs/storage-file')

const { FileAdapter } = jest.requireMock('@grammyjs/storage-file')

beforeEach(() => {
  FileAdapter.mockClear()
})

it('expenseState', async () => {
  const ctx = { chat: { id: 12345 } } as any
  const next = jest.fn().mockImplementation(async () => {
    expect(ctx.expenseState).toStrictEqual({
      expenses: [],
      wallets: {},
    })
  })

  await expenseStateMiddleware('some-path')(ctx, next)

  expect(FileAdapter).toBeCalledWith({ dirName: 'some-path' })
  expect(FileAdapter.prototype.read).toBeCalledWith('expense_12345')
  expect(FileAdapter.prototype.write).toBeCalledWith(
    'expense_12345',
    ctx.expenseState
  )
  expect(next).toBeCalledWith()
})

it('expenseState without chatId', async () => {
  const ctx = {} as any
  const next = jest.fn().mockImplementation(async () => {
    expect(() => ctx.expenseState).toThrow(
      new Error(
        'Cannot access session data because the `getSessionKey` returned undefined'
      )
    )
  })

  await expenseStateMiddleware('some-path')(ctx, next)

  expect(FileAdapter).not.toBeCalled()
  expect(next).toBeCalledWith()
})
