import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  name: string
  currency: string
  balance: number
}

export class AddWallet extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.name,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addWallet.name)
      },
      handleReply: (ctx) => {
        this.answers.name = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.currency,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addWallet.currency)
      },
      handleReply: (ctx) => {
        this.answers.currency = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.balance && !isNaN(this.answers.balance),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addWallet.balance)
      },
      handleReply: (ctx) => {
        this.answers.balance = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const wallet = await ctx.expense.createWallet(
      answers.name,
      answers.currency,
      answers.balance
    )
    await ctx.replyWithMarkdown(
      MESSAGES.addWallet.done(wallet, answers.balance)
    )
  }
}
