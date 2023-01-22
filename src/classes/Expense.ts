import { PrismaClient } from '@prisma/client'
import { INITIAL_BALANCE } from '../constants'
import { CustomContext } from '../types'

export class Expense {
  constructor(private ctx: CustomContext, private prisma: PrismaClient) {}

  private get chatId() {
    return String(this.ctx.chat?.id)
  }

  async createWallet(name: string, currency: string, balance: number) {
    return await this.prisma.wallet.create({
      data: {
        chatId: this.chatId,
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

  async updateWallet(id: string, name: string, currency: string) {
    return await this.prisma.wallet.update({
      where: {
        chatId: this.chatId,
        id,
      },
      data: {
        name,
        currency,
      },
    })
  }

  async getWallet(id: string) {
    return await this.prisma.wallet.findFirst({
      where: {
        chatId: this.chatId,
        id,
      },
    })
  }

  async getWallets() {
    return await this.prisma.wallet.findMany({
      where: {
        chatId: this.chatId,
      },
    })
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

  async updateOperation(
    id: string,
    description: string,
    amount: number,
    category: string
  ) {
    return await this.prisma.operation.update({
      where: {
        wallet: {
          chatId: this.chatId,
        },
        id,
      },
      data: {
        description,
        amount,
        category,
      },
    })
  }

  async getOperation(id: string) {
    return await this.prisma.operation.findFirst({
      where: {
        wallet: {
          chatId: this.chatId,
        },
        id,
      },
    })
  }

  async getLastOperations(walletId: string, count: number) {
    const operations = await this.prisma.operation.findMany({
      where: {
        wallet: {
          chatId: this.chatId,
          id: walletId,
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: count,
    })
    return operations.reverse()
  }

  async getBalances() {
    const wallets = await this.getWallets()

    return Promise.all(
      wallets.map(async (wallet) => {
        const aggregations = await this.prisma.operation.aggregate({
          where: {
            wallet,
          },
          _sum: {
            amount: true,
          },
        })

        return {
          wallet,
          balance: aggregations._sum.amount || 0,
        }
      })
    )
  }
}
