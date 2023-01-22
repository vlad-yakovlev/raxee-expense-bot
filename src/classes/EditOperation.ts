import { Operation, Wallet } from '@prisma/client'
import { LAST_OPERATIONS_COUNT, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { formatAmount } from '../utils/formatAmount'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
  operation: Operation
  category: string
  description: string
  amount: number
}

export class EditOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.operation,
      sendMessage: async (ctx) => {
        const operations = await ctx.expense.getLastOperations({
          count: LAST_OPERATIONS_COUNT,
        })
        await ctx.replyWithMarkdown(MESSAGES.editOperation.operation, {
          reply_markup: {
            keyboard: operations.map((operation) => [
              `${operation.description} [${operation.id}]`,
            ]),
          },
        })
      },
      handleReply: async (ctx) => {
        const operationId = extractObjectId(ctx.message?.text)
        if (operationId) {
          const operation = await ctx.expense.getOperation(operationId)
          this.answers.operation = operation || undefined
        }
      },
    },
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(MESSAGES.editOperation.wallet, {
          reply_markup: {
            keyboard: wallets.map((wallet) => [
              `${wallet.name} [${wallet.id}]`,
            ]),
          },
        })
      },
      handleReply: async (ctx) => {
        const walletId = extractObjectId(ctx.message?.text)
        if (walletId) {
          const wallet = await ctx.expense.getWallet(walletId)
          this.answers.wallet = wallet || undefined
        }
      },
    },
    {
      answered: () => !!this.answers.category,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.editOperation.category, {
          reply_markup: {
            keyboard: [[this.answers.operation?.category || '']],
          },
        })
      },
      handleReply: (ctx) => {
        this.answers.category = ctx.message?.text || ''
      },
    },
    {
      answered: () => !!this.answers.description,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.editOperation.description, {
          reply_markup: {
            keyboard: [[this.answers.operation?.description || '']],
          },
        })
      },
      handleReply: (ctx) => {
        this.answers.description = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.amount && !isNaN(this.answers.amount),
      sendMessage: async (ctx) => {
        const amount = formatAmount(this.answers.operation?.amount || 0, '')
        await ctx.replyWithMarkdown(MESSAGES.editOperation.amount, {
          reply_markup: { keyboard: [[amount]] },
        })
      },
      handleReply: (ctx) => {
        this.answers.amount = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const operation = await ctx.expense.updateOperation(answers.operation.id, {
      description: answers.description,
      amount: answers.amount,
      category: answers.category,
      walletId: answers.wallet.id,
    })

    await ctx.replyWithMarkdown(
      MESSAGES.editOperation.done(answers.wallet, operation),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
