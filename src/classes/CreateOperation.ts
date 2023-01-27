import { Wallet } from '@prisma/client'
import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
  category: string
  description: string
  sign: number
  amount: number
}

export class CreateOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(MESSAGES.createOperation.wallet, {
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
        const categories = await ctx.expense.getCategories()
        await ctx.replyWithMarkdown(MESSAGES.createOperation.category, {
          reply_markup: { keyboard: categories.map((category) => [category]) },
        })
      },
      handleReply: (ctx) => {
        this.answers.category = ctx.message?.text || ''
      },
    },
    {
      answered: () => !!this.answers.description,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createOperation.description, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.description = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.sign,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createOperation.type, {
          reply_markup: { keyboard: [['+', '-']] },
        })
      },
      handleReply: (ctx) => {
        if (ctx.message?.text === '+') {
          this.answers.sign = 1
        } else if (ctx.message?.text === '-') {
          this.answers.sign = -1
        }
      },
    },
    {
      answered: () => !isNaN(this.answers.amount ?? NaN),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createOperation.amount, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.amount = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const operation = await ctx.expense.createOperation({
      description: answers.description,
      amount: answers.sign * Math.abs(answers.amount),
      category: answers.category,
      walletId: answers.wallet.id,
    })

    await ctx.replyWithMarkdown(
      MESSAGES.createOperation.done(answers.wallet, operation),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
