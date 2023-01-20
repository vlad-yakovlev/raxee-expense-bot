import { Context } from 'grammy'
import { ReplyWithMarkdownFlavour } from 'grammy-reply-with-markdown'

export interface Expense {
  id: string
  name: string
  currency: string
  walletId: string
}

export interface Wallet {
  id: string
  name: string
  amount: number
  balance: number
}

export interface ExpenseState {
  expenses: Expense[]
  wallets: Record<string, Wallet>
}

export interface ExpenseContext extends Context, ReplyWithMarkdownFlavour {
  expenseState: ExpenseState
}
