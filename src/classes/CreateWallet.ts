import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  name: string
  currency: string
  balance: number
}

export class CreateWallet extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.name,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createWallet.name, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.name = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.currency,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createWallet.currency, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.currency = ctx.message?.text
      },
    },
    {
      answered: () => !isNaN(this.answers.balance ?? NaN),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createWallet.balance, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.balance = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const wallet = await ctx.expense.createWallet({
      name: answers.name,
      currency: answers.currency,
      balance: answers.balance,
    })

    await ctx.replyWithMarkdown(
      MESSAGES.createWallet.done(wallet, answers.balance),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
