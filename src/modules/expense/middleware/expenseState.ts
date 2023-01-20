import { FileAdapter } from '@grammyjs/storage-file'
import { namedSession } from 'grammy-named-session'
import { ExpenseContext } from '../types'

export const expenseStateMiddleware = (dirName: string) => {
  return namedSession<ExpenseContext, 'expenseState'>({
    getInitial: () => ({
      expenses: [],
      wallets: {},
    }),

    getSessionKey: (ctx) =>
      ctx.chat?.id === undefined ? undefined : `expense_${ctx.chat.id}`,
    getStorage: () => new FileAdapter({ dirName }),
    name: 'expenseState',
  })
}
