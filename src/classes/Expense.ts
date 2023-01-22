import { PrismaClient } from '@prisma/client'
import { INITIAL_BALANCE } from '../constants'

export class Expense {
  constructor(private prisma: PrismaClient) {}

  async createWallet(
    chatId: string,
    name: string,
    currency: string,
    balance: number
  ) {
    return await this.prisma.wallet.create({
      data: {
        chatId,
        name,
        currency,
        operations: {
          create: [
            {
              description: INITIAL_BALANCE,
              amount: balance,
              category: INITIAL_BALANCE,
            },
          ],
        },
      },
    })
  }

  async getWallet(chatId: string, name: string) {
    return await this.prisma.wallet.findFirst({ where: { chatId, name } })
  }

  async getWallets(chatId: string) {
    return await this.prisma.wallet.findMany({ where: { chatId } })
  }

  async createOperation(
    description: string,
    amount: number,
    category: string,
    walletId: string
  ) {
    return await this.prisma.operation.create({
      data: {
        description,
        amount,
        category,
        walletId,
      },
    })
  }

  async getBalances(chatId: string) {
    const wallets = await this.getWallets(chatId)

    return Promise.all(
      wallets.map(async (wallet) => {
        const aggregations = await this.prisma.operation.aggregate({
          where: { wallet },
          _sum: { amount: true },
        })

        return {
          wallet,
          balance: aggregations._sum.amount || 0,
        }
      })
    )
  }

  async getLastOperations(walletId: string, count: number) {
    const operations = await this.prisma.operation.findMany({
      where: { walletId },
      orderBy: { date: 'desc' },
      take: count,
    })
    return operations.reverse()
  }
}
