import { v4 as uuid } from 'uuid'

export interface Category {
  id: string
  name: string
}

export interface Expense {
  id: string
  name: string
  amount: number
  categoryId: string
  walletId: string
}

export interface Wallet {
  id: string
  name: string
  currency: string
}

export interface ExpenseStateRaw {
  categories: Category[]
  expenses: Expense[]
  wallets: Wallet[]
}

export class ExpenseState {
  private categories: Category[] = []
  private expenses: Expense[] = []
  private wallets: Wallet[] = []

  static fromRaw(expenseStateRaw: ExpenseStateRaw): ExpenseState {
    const expenseState = new ExpenseState()
    expenseState.categories = expenseStateRaw.categories
    expenseState.expenses = expenseStateRaw.expenses
    expenseState.wallets = expenseStateRaw.wallets
    return expenseState
  }

  toRaw(): ExpenseStateRaw {
    return {
      categories: this.categories,
      expenses: this.expenses,
      wallets: this.wallets,
    }
  }

  createCategory(name: string) {
    const category = {
      id: uuid(),
      name,
    }

    this.categories.push(category)
    return category
  }

  findCategoryByName(name: string) {
    return this.categories.find((category) => category.name === name)
  }

  createExpense(
    name: string,
    amount: number,
    categoryId: string,
    walletId: string
  ) {
    const expense = {
      id: uuid(),
      name,
      amount,
      categoryId,
      walletId,
    }

    this.expenses.push(expense)
    return expense
  }

  createWallet(name: string, currency: string, balance: number) {
    const wallet = {
      id: uuid(),
      name,
      currency,
    }

    this.createExpense(
      'INIT',
      balance,
      (this.findCategoryByName('INIT') || this.createCategory('INIT')).id,
      wallet.id
    )

    this.wallets.push(wallet)
    return wallet
  }
}
