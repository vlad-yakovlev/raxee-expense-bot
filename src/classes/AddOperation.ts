import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { BaseConversation, ConversationQuestion } from './BaseConversation'
import { Category, Wallet } from './ExpenseState'

interface Answers {
  wallet: Wallet
  category: Category
  name: string
  sign: number
  amount: number
}

export class AddOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addOperation.wallet, {
          reply_markup: {
            keyboard: ctx.session.expense.wallets.map((wallet) => [
              wallet.name,
            ]),
          },
        })
      },
      handleReply: (ctx) => {
        this.answers.wallet = ctx.session.expense.getWallet(
          ctx.message?.text || ''
        )
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
        this.answers.category = ctx.session.expense.getOrCreateCategory(
          ctx.message?.text || ''
        )
      },
    },
    {
      answered: () => !!this.answers.name,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.addOperation.name, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.name = ctx.message?.text
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
        this.answers.amount = Number(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const operation = ctx.session.expense.createOperation(
      answers.name,
      answers.sign * answers.amount,
      answers.category,
      answers.wallet
    )
    await ctx.replyWithMarkdown(
      MESSAGES.addOperation.done(operation, answers.wallet, answers.category),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
