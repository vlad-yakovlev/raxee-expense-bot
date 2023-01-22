import { Wallet } from '@prisma/client'
import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
  category: string
  description: string
  sign: number
  amount: number
}

export class AddOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets(String(ctx.chat?.id))
        await ctx.replyWithMarkdown(MESSAGES.addOperation.wallet, {
          reply_markup: { keyboard: wallets.map((wallet) => [wallet.name]) },
        })
      },
      handleReply: async (ctx) => {
        const wallet = await ctx.expense.getWallet(
          String(ctx.chat?.id),
          ctx.message?.text || ''
        )
        this.answers.wallet = wallet || undefined
      },
    },
    {
      answered: () => !!this.answers.category,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addOperation.category, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.category = ctx.message?.text || ''
      },
    },
    {
      answered: () => !!this.answers.description,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addOperation.description, {
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
        await ctx.replyWithMarkdown(MESSAGES.addOperation.type, {
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
      answered: () => !!this.answers.amount && !isNaN(this.answers.amount),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addOperation.amount, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.amount = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const operation = await ctx.expense.createOperation(
      answers.description,
      answers.sign * answers.amount,
      answers.category,
      answers.wallet.id
    )
    await ctx.replyWithMarkdown(
      MESSAGES.addOperation.done(answers.wallet, operation),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
