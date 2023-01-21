import { v4 as uuid } from 'uuid'
import { INITIAL_BALANCE } from '../constants'

export interface Wallet {
  id: string
  name: string
  currency: string
}

export interface Category {
  id: string
  name: string
}

export interface Operation {
  id: string
  name: string
  date: string
  amount: number
  categoryId: string
  walletId: string
}

export interface ExpenseStateRaw {
  wallets: Wallet[]
  categories: Category[]
  operations: Operation[]
}

export class ExpenseState {
  wallets: Wallet[] = []
  categories: Category[] = []
  operations: Operation[] = []

  static fromRaw(expenseStateRaw: ExpenseStateRaw): ExpenseState {
    const expenseState = new ExpenseState()
    expenseState.categories = expenseStateRaw.categories
    expenseState.operations = expenseStateRaw.operations
    expenseState.wallets = expenseStateRaw.wallets
    return expenseState
  }

  toRaw(): ExpenseStateRaw {
    return {
      wallets: this.wallets,
      categories: this.categories,
      operations: this.operations,
    }
  }

  createWallet(name: string, currency: string, balance: number): Wallet {
    const wallet: Wallet = {
      id: uuid(),
      name,
      currency,
    }

    this.createOperation(
      INITIAL_BALANCE,
      balance,
      this.getOrCreateCategory(INITIAL_BALANCE),
      wallet
    )

    this.wallets.push(wallet)
    return wallet
  }

  getWallet(name: string): Wallet | undefined {
    return this.wallets.find((wallet) => wallet.name === name)
  }

  createCategory(name: string): Category {
    const category: Category = {
      id: uuid(),
      name,
    }

    this.categories.push(category)
    return category
  }

  getCategory(name: string): Category | undefined {
    return this.categories.find((category) => category.name === name)
  }

  getOrCreateCategory(name: string): Category {
    return this.getCategory(name) || this.createCategory(name)
  }

  createOperation(
    name: string,
    amount: number,
    category: Category,
    wallet: Wallet
  ): Operation {
    const operation: Operation = {
      id: uuid(),
      name,
      date: new Date().toISOString(),
      amount,
      categoryId: category.id,
      walletId: wallet.id,
    }

    this.operations.push(operation)
    return operation
  }

  getBalances() {
    return this.wallets.map((wallet) => {
      const balance = this.operations.reduce<number>(
        (sum, operation) =>
          operation.walletId === wallet.id ? sum + operation.amount : sum,
        0
      )

      return { wallet, balance }
    })
  }

  getLastOperations(wallet: Wallet, count: number) {
    return this.operations
      .filter((operation) => operation.walletId === wallet.id)
      .slice(-count)
  }
}
