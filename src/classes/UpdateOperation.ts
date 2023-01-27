import { Operation, Wallet } from '@prisma/client'
import { DO_NOT_CHANGE, LAST_OPERATIONS_COUNT, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  operation: Operation
  wallet: Wallet
  category: string
  description: string
  sign: number
  amount: number
}

export class UpdateOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.operation,
      sendMessage: async (ctx) => {
        const operations = await ctx.expense.getLastOperations({
          count: LAST_OPERATIONS_COUNT,
        })
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.operation, {
          reply_markup: {
            keyboard: [...operations]
              .reverse()
              .map((operation) => [
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
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.wallet, {
          reply_markup: {
            keyboard: [
              [DO_NOT_CHANGE],
              ...wallets.map((wallet) => [`${wallet.name} [${wallet.id}]`]),
            ],
          },
        })
      },
      handleReply: async (ctx) => {
        const walletId =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.operation?.walletId
            : extractObjectId(ctx.message?.text)
        if (walletId) {
          const wallet = await ctx.expense.getWallet(walletId)
          this.answers.wallet = wallet || undefined
        }
      },
    },
    {
      answered: () => !!this.answers.category,
      sendMessage: async (ctx) => {
        const categories = await ctx.expense.getCategories()
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.category, {
          reply_markup: {
            keyboard: [
              [DO_NOT_CHANGE],
              ...categories.map((category) => [category]),
            ],
          },
        })
      },
      handleReply: (ctx) => {
        this.answers.category =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.operation?.category
            : ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.description,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.description, {
          reply_markup: { keyboard: [[DO_NOT_CHANGE]] },
        })
      },
      handleReply: (ctx) => {
        this.answers.description =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.operation?.description
            : ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.sign,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.type, {
          reply_markup: { keyboard: [[DO_NOT_CHANGE], ['+', '-']] },
        })
      },
      handleReply: (ctx) => {
        if (
          ctx.message?.text === DO_NOT_CHANGE &&
          this.answers.operation?.amount
        ) {
          this.answers.sign = this.answers.operation.amount >= 0 ? 1 : -1
        } else if (ctx.message?.text === '+') {
          this.answers.sign = 1
        } else if (ctx.message?.text === '-') {
          this.answers.sign = -1
        }
      },
    },
    {
      answered: () => !isNaN(this.answers.amount ?? NaN),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.updateOperation.amount, {
          reply_markup: { keyboard: [[DO_NOT_CHANGE]] },
        })
      },
      handleReply: (ctx) => {
        this.answers.amount =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.operation?.amount
            : parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const operation = await ctx.expense.updateOperation(answers.operation.id, {
      description: answers.description,
      amount: answers.sign * Math.abs(answers.amount),
      category: answers.category,
      walletId: answers.wallet.id,
    })

    await ctx.replyWithMarkdown(
      MESSAGES.updateOperation.done(answers.wallet, operation),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
